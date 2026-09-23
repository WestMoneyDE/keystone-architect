use std::path::PathBuf;
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;
use std::time::{Duration, Instant};

use serde::Serialize;
use tauri::{AppHandle, Emitter, Manager};

use crate::tray;

/// Holds the handle to the Next.js child process this app itself spawned
/// (nothing to hold for Postgres — that lives in Docker, managed by `docker
/// compose` and left running on quit via `restart: unless-stopped`).
pub struct AppState {
    pub child: Mutex<Option<Child>>,
}

#[derive(Clone, Serialize)]
pub struct StartupStatus {
    pub stage: String, // "starting" | "docker" | "postgres" | "server" | "ready" | "error"
    pub message: String,
    pub detail: String,
}

const DOCKER_WAIT_TIMEOUT: Duration = Duration::from_secs(60);
const SERVER_WAIT_TIMEOUT: Duration = Duration::from_secs(90);
const POLL_INTERVAL: Duration = Duration::from_millis(1000);

/// Mirrors the `process.env.PORT` fallback in `app/settings/page.tsx` /
/// `lib/network.ts` so the desktop shell's health check and the web app's
/// own QR panel always agree on which port Keystone runs on.
fn app_port() -> u16 {
    std::env::var("PORT")
        .ok()
        .and_then(|v| v.parse().ok())
        .unwrap_or(3000)
}

fn emit_status(app: &AppHandle, stage: &str, message: &str, detail: &str) {
    let _ = app.emit(
        "startup-status",
        StartupStatus {
            stage: stage.into(),
            message: message.into(),
            detail: detail.into(),
        },
    );
    tray::set_status_label(app, stage);
}

/// Resolves the Keystone app's project root.
///
/// In dev (`cargo tauri dev` / `cargo run` from `src-tauri`), that's simply
/// the parent of this crate (`CARGO_MANIFEST_DIR/..`) — the checked-out
/// repo. In a bundled release build there is no repo checkout on the user's
/// machine; the only files shipped alongside the app are whatever is listed
/// under `bundle.resources` in `tauri.conf.json` (currently just
/// `docker-compose.yml`, see the module doc on `spawn_next_server` for why
/// that's a known limitation rather than a full solution).
fn app_root(app: &AppHandle) -> PathBuf {
    if cfg!(debug_assertions) {
        PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .parent()
            .expect("src-tauri always has a parent directory")
            .to_path_buf()
    } else {
        app.path()
            .resource_dir()
            .expect("resource dir must resolve in a bundled app")
    }
}

fn compose_file_path(app: &AppHandle) -> PathBuf {
    app_root(app).join("docker-compose.yml")
}

/// Full startup sequence: Docker present? → Postgres healthy (start it if
/// not)? → Next.js server answering (start it if not)? → hand the ready URL
/// to the main window. Every step reports progress via `startup-status` so
/// the splash page (and the tray label) always reflect what's actually
/// happening, not just "still loading."
pub fn run_startup_sequence(app: AppHandle) {
    emit_status(&app, "starting", "Initialisiere Keystone…", "");

    if let Err(e) = check_docker_available() {
        emit_status(
            &app,
            "error",
            "Docker wurde nicht gefunden oder läuft nicht.",
            &format!(
                "Bitte installiere/starte Docker Desktop und klicke auf \"Erneut versuchen\".\n\nDetails: {e}"
            ),
        );
        return;
    }

    let compose_path = compose_file_path(&app);
    if !compose_path.exists() {
        emit_status(
            &app,
            "error",
            "docker-compose.yml wurde nicht gefunden.",
            &format!("Erwarteter Pfad: {}", compose_path.display()),
        );
        return;
    }

    emit_status(&app, "docker", "Prüfe Datenbank (PostgreSQL)…", "");
    if !postgres_is_healthy(&compose_path) {
        emit_status(&app, "docker", "Starte Datenbank (docker compose up -d)…", "");
        if let Err(e) = docker_compose_up(&compose_path) {
            emit_status(
                &app,
                "error",
                "docker compose up -d ist fehlgeschlagen.",
                &e,
            );
            return;
        }

        emit_status(&app, "postgres", "Warte auf PostgreSQL…", "");
        let start = Instant::now();
        loop {
            if postgres_is_healthy(&compose_path) {
                break;
            }
            if start.elapsed() > DOCKER_WAIT_TIMEOUT {
                emit_status(
                    &app,
                    "error",
                    "PostgreSQL wurde nicht rechtzeitig bereit.",
                    "Zeitüberschreitung beim Warten auf den Healthcheck des postgres-Containers. Prüfe `docker compose logs postgres`.",
                );
                return;
            }
            std::thread::sleep(POLL_INTERVAL);
        }
    }

    let port = app_port();

    emit_status(&app, "server", "Prüfe Keystone-Server…", "");
    if !http_is_ready(port) {
        emit_status(&app, "server", "Starte Keystone-Server…", "");
        if let Err(e) = spawn_next_server(&app) {
            emit_status(
                &app,
                "error",
                "Der Keystone-Server konnte nicht gestartet werden.",
                &e,
            );
            return;
        }

        emit_status(&app, "server", "Warte auf Keystone-Server…", "");
        let start = Instant::now();
        loop {
            if http_is_ready(port) {
                break;
            }
            if start.elapsed() > SERVER_WAIT_TIMEOUT {
                emit_status(
                    &app,
                    "error",
                    "Der Keystone-Server antwortet nicht.",
                    &format!(
                        "Zeitüberschreitung beim Warten auf http://localhost:{port}. Prüfe die Logs (npm run build / npm run start) und versuche es erneut."
                    ),
                );
                return;
            }
            std::thread::sleep(POLL_INTERVAL);
        }
    }

    emit_status(&app, "ready", "Keystone ist bereit.", "");

    if let Some(window) = app.get_webview_window("main") {
        let url = format!("http://localhost:{port}");
        if let Ok(parsed) = url.parse() {
            let _ = window.navigate(parsed);
        }
        let _ = window.show();
        let _ = window.set_focus();
    }
}

fn check_docker_available() -> Result<(), String> {
    run_capture(Command::new("docker").arg("info")).map(|_| ())
}

/// Parses `docker compose ps --format json` (newline-delimited JSON, one
/// object per service) and checks whether the `postgres` service reports
/// `"Health": "healthy"`. Used both to skip a redundant `docker compose up
/// -d` on relaunch and to know when it's safe to stop polling after
/// starting it.
fn postgres_is_healthy(compose_path: &PathBuf) -> bool {
    let output = Command::new("docker")
        .args(["compose", "-f"])
        .arg(compose_path)
        .args(["ps", "--format", "json"])
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .output();

    let Ok(output) = output else { return false };
    if !output.status.success() {
        return false;
    }
    let text = String::from_utf8_lossy(&output.stdout);
    for line in text.lines() {
        let line = line.trim();
        if line.is_empty() {
            continue;
        }
        if let Ok(value) = serde_json::from_str::<serde_json::Value>(line) {
            let service = value.get("Service").and_then(|v| v.as_str()).unwrap_or("");
            let health = value.get("Health").and_then(|v| v.as_str()).unwrap_or("");
            if service == "postgres" && health == "healthy" {
                return true;
            }
        }
    }
    false
}

fn docker_compose_up(compose_path: &PathBuf) -> Result<(), String> {
    run_capture(
        Command::new("docker")
            .args(["compose", "-f"])
            .arg(compose_path)
            .args(["up", "-d"]),
    )
    .map(|_| ())
}

fn run_capture(cmd: &mut Command) -> Result<String, String> {
    let output = cmd
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()
        .map_err(|e| format!("Konnte Befehl nicht ausführen: {e}"))?;
    if !output.status.success() {
        return Err(format!(
            "Exit-Code {:?}\nstdout: {}\nstderr: {}",
            output.status.code(),
            String::from_utf8_lossy(&output.stdout),
            String::from_utf8_lossy(&output.stderr)
        ));
    }
    Ok(String::from_utf8_lossy(&output.stdout).to_string())
}

fn http_is_ready(port: u16) -> bool {
    ureq::get(&format!("http://127.0.0.1:{port}"))
        .timeout(Duration::from_secs(2))
        .call()
        .is_ok()
}

/// Spawns the Next.js production server as a child process of the desktop
/// shell.
///
/// **Known scope limitation** (documented here and in the ticket 13 report
/// rather than silently glossed over): this assumes a Node.js/npm
/// installation is present on the machine and that `npm run build` has
/// already produced a `.next` build in the app directory — same
/// "documented prerequisite" posture the plan already takes for Docker.
/// A fully self-contained installer would need Tauri's sidecar-binary
/// mechanism bundling a standalone Node runtime + `.next/standalone`
/// output so end users never need Node installed at all; that's real
/// follow-up work (flagged in this ticket's report) and out of scope for
/// getting the shell itself running end-to-end here.
fn spawn_next_server(app: &AppHandle) -> Result<(), String> {
    let root = app_root(app);
    if !cfg!(debug_assertions) {
        return Err(format!(
            "Bundled-Build kann den Next.js-Server nicht selbst starten — es wird kein Node.js-Projekt mitgeliefert. \
             Bitte `npm run build && npm run start` manuell im Projektverzeichnis ausführen, bis ein vollständiger \
             Node-Sidecar existiert (siehe Kommentar in startup.rs::spawn_next_server). Erwartetes Projektverzeichnis: {}",
            root.display()
        ));
    }

    let npm_cmd = if cfg!(target_os = "windows") { "npm.cmd" } else { "npm" };
    let child = Command::new(npm_cmd)
        .args(["run", "dev"])
        .current_dir(&root)
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .map_err(|e| format!("`npm run dev` konnte nicht gestartet werden: {e}"))?;

    if let Some(state) = app.try_state::<AppState>() {
        *state.child.lock().unwrap() = Some(child);
    }
    Ok(())
}
