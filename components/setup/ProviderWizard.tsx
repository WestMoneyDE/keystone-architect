"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Eye, EyeOff, Loader2, XCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { ProviderId } from "./types";
import type { LLMAvailability } from "@/lib/llm/types";

interface ProviderOption {
  id: ProviderId;
  title: string;
  explanation: string; // required inline "what this means / what it costs you" guidance
  kind: "api-key" | "cli";
  experimental?: boolean;
}

const PROVIDER_OPTIONS: ProviderOption[] = [
  {
    id: "openai",
    title: "OpenAI API-Key",
    explanation:
      "Du fügst deinen eigenen OpenAI-API-Key ein. Er wird verschlüsselt lokal gespeichert (AES-256-GCM) und verlässt deinen Rechner nur in Richtung OpenAI. Kosten fallen pro API-Aufruf nach OpenAIs Preisliste an, unabhängig von einem eventuell bestehenden ChatGPT-Abo.",
    kind: "api-key",
  },
  {
    id: "anthropic",
    title: "Anthropic API-Key",
    explanation:
      "Du fügst deinen eigenen Anthropic-API-Key ein. Er wird verschlüsselt lokal gespeichert und verlässt deinen Rechner nur in Richtung Anthropic. Kosten fallen pro API-Aufruf nach Anthropics Preisliste an, unabhängig von einem eventuell bestehenden Claude-Abo.",
    kind: "api-key",
  },
  {
    id: "claude-cli",
    title: "Claude Code CLI",
    explanation:
      "Nutzt dein bestehendes Claude-Abo über die lokal installierte Claude Code CLI. Du musst vorher einmal `claude login` in einem echten Terminal ausgeführt haben — Keystone speichert oder sieht dein Login niemals, es startet nur den bereits authentifizierten Prozess. Keine zusätzlichen API-Kosten über das Abo hinaus.",
    kind: "cli",
  },
  {
    id: "codex-cli",
    title: "Codex CLI (experimental)",
    explanation:
      "Nutzt dein bestehendes OpenAI-Abo über die lokal installierte Codex CLI. Experimentell: OpenAI hat dieses Nutzungsmuster (automatisiertes Aufrufen der CLI durch eine Drittanwendung) nicht eindeutig in den Nutzungsbedingungen freigegeben. Nutzung auf eigenes Risiko — wird niemals vorausgewählt.",
    kind: "cli",
    experimental: true,
  },
];

interface ProviderWizardProps {
  onComplete: () => void;
}

export function ProviderWizard({ onComplete }: ProviderWizardProps) {
  const [selected, setSelected] = useState<ProviderId | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [checking, setChecking] = useState(false);
  const [availability, setAvailability] = useState<LLMAvailability | null>(null);
  const [saving, setSaving] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const selectedOption = PROVIDER_OPTIONS.find((p) => p.id === selected);

  async function runCheck() {
    if (!selectedOption) return;
    setChecking(true);
    setAvailability(null);
    try {
      const res = await fetch("/api/provider-config/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: selectedOption.id,
          apiKey: selectedOption.kind === "api-key" ? apiKey : undefined,
        }),
      });
      const data = await res.json();
      setAvailability(data.availability as LLMAvailability);
    } catch {
      setAvailability({ ok: false, reason: "unknown", detail: "Netzwerkfehler bei der Prüfung." });
    } finally {
      setChecking(false);
    }
  }

  async function saveAndContinue() {
    if (!selectedOption) return;
    setSaving(true);
    try {
      await fetch("/api/provider-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: selectedOption.id,
          apiKey: selectedOption.kind === "api-key" ? apiKey : undefined,
          isActive: true,
        }),
      });
      onComplete();
    } finally {
      setSaving(false);
    }
  }

  const canContinue =
    selectedOption != null &&
    (selectedOption.kind === "api-key" ? apiKey.trim().length > 0 && availability?.ok === true : availability?.ok === true);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">LLM-Anbieter wählen</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Keystone braucht ein LLM für Chat, Antwort-Bewertung und Zusammenfassungen. Wähle einen der vier Wege — du
          kannst die Wahl später jederzeit in den Einstellungen ändern.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PROVIDER_OPTIONS.map((option) => {
          const isSelected = selected === option.id;
          return (
            <GlassCard
              key={option.id}
              onClick={() => {
                setSelected(option.id);
                setAvailability(null);
              }}
              className={`cursor-pointer p-4 ${isSelected ? "ring-2 ring-accent" : ""}`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-medium text-foreground">{option.title}</h3>
                {option.experimental && (
                  <Badge variant="warning" className="shrink-0">
                    Experimentell
                  </Badge>
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{option.explanation}</p>
            </GlassCard>
          );
        })}
      </div>

      {selectedOption && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-surface p-4 space-y-4"
        >
          {selectedOption.experimental && (
            <div className="flex items-start gap-2 rounded-lg bg-warning/10 p-3 text-sm text-warning">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                Experimentell — nicht klar durch OpenAIs Nutzungsbedingungen abgedeckt. Nutzung auf eigenes Risiko.
              </span>
            </div>
          )}

          {selectedOption.kind === "api-key" ? (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">API-Key</label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setAvailability(null);
                  }}
                  placeholder="sk-..."
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-sm text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label={showKey ? "Key verbergen" : "Key anzeigen"}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ) : null}

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={runCheck}
              disabled={checking || (selectedOption.kind === "api-key" && apiKey.trim().length === 0)}
            >
              {checking && <Loader2 className="h-4 w-4 animate-spin" />}
              Verfügbarkeit prüfen
            </Button>

            {availability && (
              <span
                className={`inline-flex items-center gap-1.5 text-sm ${
                  availability.ok ? "text-success" : "text-danger"
                }`}
              >
                {availability.ok ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {availability.ok ? "Verfügbar" : availabilityLabel(availability)}
              </span>
            )}
          </div>

          {availability && !availability.ok && (
            <p className="text-xs text-muted-foreground">{availabilityGuidance(availability, selectedOption.id)}</p>
          )}
        </motion.div>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => {
            setSkipped(true);
            onComplete();
          }}
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          Später einrichten überspringen
        </button>
        <Button variant="primary" onClick={saveAndContinue} disabled={!canContinue || saving || skipped}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Weiter
        </Button>
      </div>
    </div>
  );
}

function availabilityLabel(a: Extract<LLMAvailability, { ok: false }>): string {
  switch (a.reason) {
    case "not-authenticated":
      return "Nicht angemeldet";
    case "not-installed":
      return "Nicht installiert";
    case "invalid-key":
      return "Ungültiger Key";
    default:
      return "Unbekannter Fehler";
  }
}

function availabilityGuidance(a: Extract<LLMAvailability, { ok: false }>, provider: ProviderId): string {
  if (a.reason === "not-authenticated") {
    const cmd = provider === "codex-cli" ? "codex login" : "claude login";
    return `Führe \`${cmd}\` in einem echten Terminal aus und versuche es erneut.`;
  }
  if (a.reason === "not-installed") {
    const bin = provider === "codex-cli" ? "codex" : "claude";
    return `Die CLI \`${bin}\` wurde auf diesem Rechner nicht gefunden. Installiere sie zuerst.`;
  }
  if (a.reason === "invalid-key") {
    return "Der API-Key wurde vom Anbieter abgelehnt. Prüfe, ob er korrekt kopiert wurde und noch gültig ist.";
  }
  return a.detail ?? "Unbekannter Fehler bei der Prüfung.";
}
