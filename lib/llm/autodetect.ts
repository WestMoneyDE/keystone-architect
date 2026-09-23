// Startup auto-detection for an already-usable LLM backend — a fast-follow
// on top of ticket 4's fully-manual setup wizard.
//
// Rationale (see federated-discovering-naur.md item 11 / ticket 4): most
// people running this on their own dev machine already have the `claude`
// CLI installed and logged in (it's their own Anthropic subscription — the
// plan explicitly treats claude-cli as having a legitimate default-eligible
// ToS posture), or they're self-hosting via Docker and already set
// ANTHROPIC_API_KEY/OPENAI_API_KEY as container env vars. Forcing everyone
// through the manual wizard in those cases is friction for no reason.
//
// Priority order (deliberate, not arbitrary):
//   1. claude-cli — checkAvailability() must return {ok:true} (installed AND
//      authenticated). Auto-activated without asking; this is the one
//      backend the plan already treats as default-eligible.
//   2. ANTHROPIC_API_KEY / OPENAI_API_KEY env vars — a real self-hosting
//      pattern. Verified live via checkAvailability() before activating (an
//      env var can be stale/revoked) and, once verified, encrypted at rest
//      via lib/crypto.ts exactly like the manual wizard path — env-sourced
//      keys are not treated differently once stored.
//   3. codex-cli — deliberately EXCLUDED from auto-activation. Per the
//      plan's explicit policy ("Experimental — use at your own risk, ships
//      opt-in only, never default"), it is never silently activated even if
//      installed and authenticated. We still probe it so the caller can
//      mention it's available as an opt-in option, but that's it.
//
// If none of the above are usable, this is a no-op: no ProviderConfig is
// created, and the existing "kein Anbieter konfiguriert" fallback states /
// the manual /setup wizard remain exactly as ticket 4 built them.

import { db } from "@/lib/db";
import { encrypt } from "@/lib/crypto";
import { ClaudeCliProvider } from "./providers/claude-cli";
import { CodexCliProvider } from "./providers/codex-cli";
import { AnthropicProvider } from "./providers/anthropic";
import { OpenAIProvider } from "./providers/openai";

export type AutoDetectedProvider = "claude-cli" | "anthropic" | "openai";

export interface AutoDetectResult {
  activated: AutoDetectedProvider;
  /** Human-readable label for the confirmation toast. */
  label: string;
}

const LABELS: Record<AutoDetectedProvider, string> = {
  "claude-cli": "Claude Code CLI",
  anthropic: "Anthropic API-Key (Umgebungsvariable)",
  openai: "OpenAI API-Key (Umgebungsvariable)",
};

/**
 * Runs auto-detection and, if something usable is found, creates + activates
 * a ProviderConfig for `userId`. Returns `null` when nothing was activated —
 * either because a provider is already active (this function still does the
 * cheap check itself so callers don't have to duplicate it) or because
 * nothing could be auto-detected.
 *
 * Cheap by construction: the very first thing this does is check for an
 * existing active ProviderConfig row and return immediately if one exists,
 * so once a provider is active (auto- or manually-configured), every
 * subsequent call is a single indexed query — no CLI spawning, no network
 * calls — until the user deactivates it.
 */
export async function autoDetectAndActivateProvider(userId: string): Promise<AutoDetectResult | null> {
  const existingActive = await db.providerConfig.findFirst({
    where: { userId, isActive: true },
    select: { id: true },
  });
  if (existingActive) {
    return null;
  }

  // 1. Claude Code CLI — the default-eligible backend.
  const claudeCli = await new ClaudeCliProvider().checkAvailability();
  if (claudeCli.ok) {
    await activate(userId, "claude-cli", {});
    return { activated: "claude-cli", label: LABELS["claude-cli"] };
  }

  // 2. Env-var API keys — Anthropic first (mirrors claude-cli's priority as
  // the "first-party" backend), then OpenAI.
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey) {
    const availability = await new AnthropicProvider(anthropicKey).checkAvailability();
    if (availability.ok) {
      await activate(userId, "anthropic", { apiKeyEnc: encrypt(anthropicKey) });
      return { activated: "anthropic", label: LABELS.anthropic };
    }
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    const availability = await new OpenAIProvider(openaiKey).checkAvailability();
    if (availability.ok) {
      await activate(userId, "openai", { apiKeyEnc: encrypt(openaiKey) });
      return { activated: "openai", label: LABELS.openai };
    }
  }

  // 3. Codex CLI — probed for detection purposes only (so the fallback
  // wizard can honestly say "we noticed codex is installed, opt in if you
  // want"), NEVER auto-activated. Failures here are silently ignored —
  // this is a courtesy signal, not something that should ever throw.
  try {
    await new CodexCliProvider().checkAvailability();
  } catch {
    // ignore — codex is opt-in only anyway, detection failure changes nothing
  }

  return null;
}

async function activate(
  userId: string,
  provider: AutoDetectedProvider,
  extra: { apiKeyEnc?: string }
): Promise<void> {
  await db.$transaction(async (tx) => {
    await tx.providerConfig.updateMany({
      where: { userId, provider: { not: provider } },
      data: { isActive: false },
    });
    await tx.providerConfig.upsert({
      where: { userId_provider: { userId, provider } },
      create: { userId, provider, isActive: true, ...extra },
      update: { isActive: true, ...extra },
    });
  });
}
