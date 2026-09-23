"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Download, Loader2, Moon, QrCode, Upload } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { useToast } from "@/components/ui/Toast";
import { ProviderWizard } from "@/components/setup/ProviderWizard";
import { RoleSelectionStep } from "@/components/setup/RoleSelectionStep";
import { NewsToggleStep } from "@/components/setup/NewsToggleStep";
import type { NewsMode, RoleCardData } from "@/components/setup/types";

interface SettingsClientProps {
  initialDisplayName: string;
  roles: RoleCardData[];
  initialSelectedRoles: string[];
  initialNewsMode: NewsMode;
  initialNewsRoleIds: string[];
  initialPwaEnabled: boolean;
  remoteUrl: string | null;
  remoteQrDataUrl: string | null;
}

const DISPLAY_NAME_PLACEHOLDER = "Architect";

export function SettingsClient({
  initialDisplayName,
  roles,
  initialSelectedRoles,
  initialNewsMode,
  initialNewsRoleIds,
  initialPwaEnabled,
  remoteUrl,
  remoteQrDataUrl,
}: SettingsClientProps) {
  const router = useRouter();
  const { show } = useToast();

  // --- Remote Access (QR) ---
  async function copyRemoteUrl() {
    if (!remoteUrl) return;
    try {
      await navigator.clipboard.writeText(remoteUrl);
      show({ message: "Link kopiert." });
    } catch {
      show({ message: "Kopieren fehlgeschlagen — Link bitte manuell markieren." });
    }
  }

  // --- Display name ---
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [savingName, setSavingName] = useState(false);

  async function saveDisplayName() {
    setSavingName(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: displayName.trim() || undefined, roleIds: initialSelectedRoles, newsMode: initialNewsMode, newsRoleIds: initialNewsRoleIds }),
      });
      show({ message: "Anzeigename gespeichert." });
      router.refresh();
    } finally {
      setSavingName(false);
    }
  }

  // --- Roles + News (one combined save, mirrors /api/onboarding's shape) ---
  const [selectedRoles, setSelectedRoles] = useState<string[]>(initialSelectedRoles);
  const [newsMode, setNewsMode] = useState<NewsMode>(initialNewsMode);
  const [newsRoleIds, setNewsRoleIds] = useState<string[]>(initialNewsRoleIds);
  const [savingRoles, setSavingRoles] = useState(false);

  function toggleRole(roleId: string) {
    setSelectedRoles((prev) => (prev.includes(roleId) ? prev.filter((r) => r !== roleId) : [...prev, roleId]));
  }
  function toggleNewsRole(roleId: string) {
    setNewsRoleIds((prev) => (prev.includes(roleId) ? prev.filter((r) => r !== roleId) : [...prev, roleId]));
  }

  async function saveRolesAndNews() {
    setSavingRoles(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleIds: selectedRoles,
          newsMode,
          newsRoleIds: newsMode === "roles" ? (newsRoleIds.length > 0 ? newsRoleIds : selectedRoles) : [],
        }),
      });
      show({ message: "Rollen & News-Einstellungen gespeichert." });
      router.refresh();
    } finally {
      setSavingRoles(false);
    }
  }

  // --- PWA toggle ---
  const [pwaEnabled, setPwaEnabled] = useState(initialPwaEnabled);
  const [savingPwa, setSavingPwa] = useState(false);

  async function togglePwa() {
    const next = !pwaEnabled;
    setPwaEnabled(next);
    setSavingPwa(true);
    try {
      await fetch("/api/feature-flags", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pwaEnabled: next }),
      });
      show({ message: next ? "Offline-Caching aktiviert." : "Offline-Caching deaktiviert." });
    } finally {
      setSavingPwa(false);
    }
  }

  // --- Export / Import ---
  const [importing, setImporting] = useState(false);
  const [importSummary, setImportSummary] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function exportProgress() {
    const res = await fetch("/api/export");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `keystone-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    show({ message: "Fortschritt exportiert." });
  }

  async function handleImportFile(file: File) {
    setImporting(true);
    setImportSummary(null);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      const data = await res.json();
      if (!res.ok) {
        show({ message: "Import fehlgeschlagen — ungültiges Dateiformat." });
        return;
      }
      const r = data.result;
      setImportSummary(
        `Highlights: +${r.highlights.inserted} (${r.highlights.skippedDuplicate} bereits vorhanden) · ` +
          `Gespräche: +${r.conversations.inserted} (${r.conversations.skippedDuplicate} bereits vorhanden) · ` +
          `Karteikarten: ${r.srsStates.upserted} übernommen (${r.srsStates.skippedMissingQuestion} übersprungen) · ` +
          `Testversuche: +${r.testAttempts.inserted} (${r.testAttempts.skippedDuplicate} bereits vorhanden, ${r.testAttempts.skippedMissingTest} ohne passenden Test) · ` +
          `Zertifikate in Datei: ${r.certificatesInFile} (nicht neu angelegt, siehe Hinweis unten)`
      );
      show({ message: "Import abgeschlossen." });
      router.refresh();
    } catch {
      show({ message: "Import fehlgeschlagen — Datei konnte nicht gelesen werden." });
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Profile */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Profil</h2>
        <GlassCard className="flex items-center gap-5 p-5">
          <Avatar name={displayName} size={64} className="shrink-0 rounded-full" />
          <div className="flex-1">
            <label htmlFor="settings-display-name" className="mb-1.5 block text-sm font-medium text-foreground">
              Anzeigename
            </label>
            <div className="flex gap-2">
              <input
                id="settings-display-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={DISPLAY_NAME_PLACEHOLDER}
                autoComplete="off"
                className="w-full max-w-xs rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
              />
              <Button variant="primary" size="sm" onClick={saveDisplayName} disabled={savingName}>
                {savingName && <Loader2 className="h-4 w-4 animate-spin" />}
                Speichern
              </Button>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Der Avatar (Blobatar) aktualisiert sich live bei jedem Tastenanschlag — derselbe Name ergibt immer
              denselben Avatar.
            </p>
          </div>
        </GlassCard>
      </section>

      {/* Theme */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Theme</h2>
        <GlassCard className="flex items-center gap-3 p-5 text-sm text-muted-foreground">
          <Moon size={16} />
          Hell/Dunkel lässt sich über den Umschalter oben rechts in der Kopfleiste ändern — die Einstellung wird
          automatisch lokal gespeichert.
        </GlassCard>
      </section>

      {/* LLM provider */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">LLM-Anbieter</h2>
        <GlassCard className="p-5">
          <ProviderWizard onComplete={() => show({ message: "Anbieter-Einstellung gespeichert." })} />
        </GlassCard>
      </section>

      {/* Roles + News */}
      <section className="space-y-4">
        <RoleSelectionStep roles={roles} selected={selectedRoles} onToggle={toggleRole} />
        <NewsToggleStep
          roles={roles}
          selectedRoles={selectedRoles}
          mode={newsMode}
          onModeChange={setNewsMode}
          newsRoleIds={newsRoleIds}
          onNewsRoleToggle={toggleNewsRole}
        />
        <div className="flex justify-end">
          <Button variant="primary" onClick={saveRolesAndNews} disabled={savingRoles}>
            {savingRoles && <Loader2 className="h-4 w-4 animate-spin" />}
            Rollen &amp; News speichern
          </Button>
        </div>
      </section>

      {/* PWA / offline */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Offline-Lesen (PWA)</h2>
        <GlassCard className="p-5">
          <label className="flex items-start justify-between gap-4">
            <span>
              <span className="block text-sm font-medium text-foreground">Bereits besuchte Artikel offline cachen</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Cached nur bereits geöffnete Lese-Seiten (Artikel/Domains) für Offline-Zugriff — Chat, Tests und Suche
                brauchen weiterhin eine Verbindung zum lokalen Server.
              </span>
            </span>
            <input
              type="checkbox"
              checked={pwaEnabled}
              onChange={togglePwa}
              disabled={savingPwa}
              className="mt-1 h-5 w-5 shrink-0 accent-[var(--accent)]"
            />
          </label>
        </GlassCard>
      </section>

      {/* Remote Access (QR) */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Fernzugriff</h2>
        <GlassCard className="p-5">
          {remoteUrl && remoteQrDataUrl ? (
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <img
                src={remoteQrDataUrl}
                alt={`QR-Code für ${remoteUrl}`}
                width={140}
                height={140}
                className="rounded-lg border border-border bg-white p-2"
              />
              <div className="flex-1 space-y-2">
                <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <QrCode className="h-4 w-4" /> Mit dem Handy scannen
                </p>
                <p className="text-xs text-muted-foreground">
                  Öffnet Keystone auf einem Smartphone/Tablet im selben WLAN — ideal in Kombination mit der
                  installierbaren PWA (siehe oben).
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <code className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground">
                    {remoteUrl}
                  </code>
                  <Button variant="secondary" size="sm" onClick={copyRemoteUrl}>
                    <Copy className="h-3.5 w-3.5" /> Kopieren
                  </Button>
                </div>
                <p className="pt-1 text-xs text-muted-foreground">
                  Funktioniert nur, solange dein Handy im selben lokalen Netzwerk (WLAN) wie dieser Rechner ist.
                  Für Zugriff von unterwegs — z. B. über eine andere Internetverbindung — siehe{" "}
                  <code className="rounded bg-background px-1 py-0.5">docs/REMOTE-ACCESS.md</code> (Tailscale
                  oder Cloudflare Tunnel).
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Konnte keine LAN-IP-Adresse dieses Rechners ermitteln (z. B. weil nur eine VPN- oder
              Loopback-Verbindung aktiv ist). Stelle sicher, dass der Rechner über WLAN oder Ethernet mit deinem
              lokalen Netzwerk verbunden ist, und lade die Seite neu. Details zum Fernzugriff außerhalb des LAN
              stehen in <code className="rounded bg-background px-1 py-0.5">docs/REMOTE-ACCESS.md</code>.
            </p>
          )}
        </GlassCard>
      </section>

      {/* Export / Import */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Fortschritt exportieren / importieren</h2>
        <GlassCard className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={exportProgress}>
              <Download className="h-4 w-4" /> Fortschritt exportieren
            </Button>
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
            >
              {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Fortschritt importieren
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImportFile(file);
                e.target.value = "";
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Export enthält Highlights/Notizen, Gespräche, Karteikarten-Status, Testversuche, Zertifikats-Metadaten
            (ohne PDF/PNG-Dateien selbst), Rollenwahl und Einstellungen als eine versionierte JSON-Datei. Import fügt
            neue Daten additiv hinzu (dedupliziert per Inhalt) statt vorhandene Aktivität zu überschreiben —
            Karteikarten-Status und Rollenwahl werden dabei anhand ihrer natürlichen Schlüssel aktualisiert.
            Zertifikate werden aus der Datei nicht neu angelegt (nur ihre Metadaten sind enthalten); bei Bedarf bitte
            den Test erneut ablegen.
          </p>
          {importSummary && (
            <div className="rounded-lg border border-border bg-background p-3 text-xs text-foreground">
              {importSummary}
            </div>
          )}
        </GlassCard>
      </section>
    </div>
  );
}
