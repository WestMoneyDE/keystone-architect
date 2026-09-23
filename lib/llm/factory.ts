import { db } from "@/lib/db";
import { decrypt } from "@/lib/crypto";
import type { LLMProvider } from "./types";
import { OpenAIProvider } from "./providers/openai";
import { AnthropicProvider } from "./providers/anthropic";
import { ClaudeCliProvider } from "./providers/claude-cli";
import { CodexCliProvider } from "./providers/codex-cli";

/**
 * Resolves the active ProviderConfig row for `userId` and returns the
 * matching LLMProvider instance, or `null` if no provider is configured
 * (or none is marked active). Callers (chat route, grading route, summary
 * route, news scheduler) MUST handle `null` themselves — e.g. by falling
 * back to a self-assessment mode or showing a "configure a provider" CTA.
 * This function never throws for the "not configured" case; it only throws
 * if decryption itself fails (e.g. ENCRYPTION_KEY missing/wrong), which is
 * a genuine misconfiguration the caller should surface loudly.
 */
export async function getActiveProvider(userId: string): Promise<LLMProvider | null> {
  const config = await db.providerConfig.findFirst({
    where: { userId, isActive: true },
  });

  if (!config) {
    return null;
  }

  const apiKey = config.apiKeyEnc ? decrypt(config.apiKeyEnc) : undefined;

  switch (config.provider) {
    case "openai":
      if (!apiKey) return null;
      return new OpenAIProvider(apiKey, config.model ?? undefined);
    case "anthropic":
      if (!apiKey) return null;
      return new AnthropicProvider(apiKey, config.model ?? undefined);
    case "claude-cli":
      return new ClaudeCliProvider(config.cliPath ?? undefined);
    case "codex-cli":
      return new CodexCliProvider(config.cliPath ?? undefined);
    default:
      return null;
  }
}
