use tauri::{
    menu::{Menu, MenuItem, MenuItemBuilder, PredefinedMenuItem},
    tray::TrayIconBuilder,
    App, AppHandle, Manager, Wry,
};

/// Holds a handle to the tray's status menu item so `set_status_label` can
/// update its text in place ("Server: Wird gestartet…" → "Server: Läuft")
/// without rebuilding the whole menu.
pub struct TrayState {
    status_item: MenuItem<Wry>,
}

pub fn build_tray(app: &mut App) -> tauri::Result<()> {
    let status_item = MenuItemBuilder::with_id("status", "Server: Wird gestartet…")
        .enabled(false)
        .build(app)?;
    let separator = PredefinedMenuItem::separator(app)?;
    let open_item = MenuItemBuilder::with_id("open", "Öffnen").build(app)?;
    let quit_item = MenuItemBuilder::with_id("quit", "Beenden").build(app)?;

    let menu = Menu::with_items(app, &[&status_item, &separator, &open_item, &quit_item])?;

    let mut builder = TrayIconBuilder::new().menu(&menu).tooltip("Keystone");
    if let Some(icon) = app.default_window_icon() {
        builder = builder.icon(icon.clone());
    }

    builder
        .on_menu_event(|app, event| match event.id.as_ref() {
            "open" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
            "quit" => {
                // Kill our own spawned Next.js child (if any) before
                // exiting. Postgres deliberately stays up in Docker
                // (`restart: unless-stopped` in docker-compose.yml) so
                // relaunching the app doesn't pay the docker-compose-up +
                // health-check cost again — this mirrors the ticket's
                // "avoid redundant restarts" requirement across relaunches,
                // not just within a single session.
                if let Some(state) = app.try_state::<crate::startup::AppState>() {
                    if let Some(mut child) = state.child.lock().unwrap().take() {
                        let _ = child.kill();
                    }
                }
                app.exit(0);
            }
            _ => {}
        })
        .build(app)?;

    app.manage(TrayState { status_item });
    Ok(())
}

pub fn set_status_label(app: &AppHandle, stage: &str) {
    let Some(state) = app.try_state::<TrayState>() else {
        return;
    };
    let label = match stage {
        "starting" => "Server: Wird gestartet…",
        "docker" => "Server: Docker wird geprüft…",
        "postgres" => "Server: Datenbank startet…",
        "server" => "Server: App wird gestartet…",
        "ready" => "Server: Läuft",
        "error" => "Server: Fehler",
        _ => "Server: Unbekannt",
    };
    let _ = state.status_item.set_text(label);
}
