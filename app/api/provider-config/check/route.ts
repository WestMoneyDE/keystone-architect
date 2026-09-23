import { NextResponse } from "next/server";
import { z } from "zod";
import type { LLMAvailability } from "@/lib/llm/types";
import { OpenAIProvider } from "@/lib/llm/providers/openai";
import { AnthropicProvider } from "@/lib/llm/providers/anthropic";
import { ClaudeCliProvider } from "@/lib/llm/providers/claude-cli";
import { CodexCliProvider } from "@/lib/llm/providers/codex-cli";

const checkSchema = z.object({
  provider: z.enum(["openai", "anthropic", "claude-cli", "codex-cli"]),
  apiKey: z.string().optional(),
  model: z.string().optional(),
  cliPath: z.string().optional(),
});

// POST: runs checkAvailability() for the given provider WITHOUT necessarily
// saving anything — this is what the onboarding wizard calls before letting
// the user proceed past a provider card.
export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { provider, apiKey, model, cliPath } = parsed.data;

  let availability: LLMAvailability;

  try {
    switch (provider) {
      case "openai": {
        if (!apiKey) {
          availability = { ok: false, reason: "invalid-key", detail: "No API key provided." };
          break;
        }
        availability = await new OpenAIProvider(apiKey, model).checkAvailability();
        break;
      }
      case "anthropic": {
        if (!apiKey) {
          availability = { ok: false, reason: "invalid-key", detail: "No API key provided." };
          break;
        }
        availability = await new AnthropicProvider(apiKey, model).checkAvailability();
        break;
      }
      case "claude-cli":
        availability = await new ClaudeCliProvider(cliPath).checkAvailability();
        break;
      case "codex-cli":
        availability = await new CodexCliProvider(cliPath).checkAvailability();
        break;
    }
  } catch (err) {
    availability = { ok: false, reason: "unknown", detail: (err as Error).message };
  }

  return NextResponse.json({ availability });
}
