// Prevents an additional console window from appearing on Windows in release.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod startup;
mod tray;

use std::sync::Mutex;
use tauri::Emitter;

use startup::{run_startup_sequence, AppState, StartupStatus};

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            child: Mutex::new(None),
        })
        .setup(|app| {
            let handle = app.handle().clone();
            tray::build_tray(app)?;

            // The whole "get Postgres + the Next.js server ready" sequence
            // is I/O-bound (spawning processes, polling HTTP) and must not
            // block Tauri's own event loop, so it runs on a plain OS thread
            // rather than inline in `setup()`. Progress is reported back to
            // the splash window (src-tauri/dist/index.html) via the
            // "startup-status" event so the user sees *why* the window is
            // still blank instead of a frozen splash screen.
            std::thread::spawn(move || run_startup_sequence(handle));

            Ok(())
        })
        .on_window_event(|window, event| {
            // Closing the main window ("X") hides it instead of quitting —
            // Keystone keeps running in the tray so re-opening it doesn't
            // re-run the whole docker-compose-up + health-check sequence
            // (see the ticket's tray requirement). Actually quitting happens
            // only via the tray's "Beenden" item.
            if window.label() == "main" {
                if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                    api.prevent_close();
                    let _ = window.hide();
                }
            }
        })
        .invoke_handler(tauri::generate_handler![retry_startup])
        .run(tauri::generate_context!())
        .expect("error while running the Keystone desktop shell");
}

/// Invoked from the splash page's "Erneut versuchen" button after a
/// startup failure (Docker not running, health check timeout, ...).
#[tauri::command]
fn retry_startup(app: tauri::AppHandle) {
    let _ = app.emit(
        "startup-status",
        StartupStatus {
            stage: "starting".into(),
            message: "Starte erneut…".into(),
            detail: String::new(),
        },
    );
    std::thread::spawn(move || run_startup_sequence(app));
}
