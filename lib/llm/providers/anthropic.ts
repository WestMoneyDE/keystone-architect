import Anthropic from "@anthropic-ai/sdk";
import type { LLMAvailability, LLMCompletionOptions, LLMMessage, LLMProvider } from "../types";

const DEFAULT_MODEL = "claude-sonnet-4-5";
const DEFAULT_MAX_TOKENS = 1024;

export class AnthropicProvider implements LLMProvider {
  readonly id = "anthropic" as const;
  private client: Anthropic;
  private model: string;

  constructor(apiKey: string, model?: string) {
    this.client = new Anthropic({ apiKey });
    this.model = model || DEFAULT_MODEL;
  }

  async checkAvailability(): Promise<LLMAvailability> {
    try {
      // Cheapest real round-trip: a 1-token completion.
      await this.client.messages.create({
        model: this.model,
        max_tokens: 1,
        messages: [{ role: "user", content: "hi" }],
      });
      return { ok: true };
    } catch (err) {
      return mapError(err);
    }
  }

  private splitSystem(messages: LLMMessage[]): { system?: string; rest: { role: "user" | "assistant"; content: string }[] } {
    const systemParts = messages.filter((m) => m.role === "system").map((m) => m.content);
    const rest = messages
      .filter((m): m is LLMMessage & { role: "user" | "assistant" } => m.role !== "system")
      .map((m) => ({ role: m.role, content: m.content }));
    return { system: systemParts.length ? systemParts.join("\n\n") : undefined, rest };
  }

  async *complete(
    messages: LLMMessage[],
    options?: LLMCompletionOptions
  ): AsyncIterable<{ delta: string; done: boolean }> {
    const { system, rest } = this.splitSystem(messages);
    const stream = this.client.messages.stream({
      model: this.model,
      max_tokens: options?.maxTokens ?? DEFAULT_MAX_TOKENS,
      temperature: options?.temperature,
      system,
      messages: rest,
    });

    for await (const event of stream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
        yield { delta: event.delta.text, done: false };
      } else if (event.type === "message_stop") {
        yield { delta: "", done: true };
      }
    }
  }

  async completeJSON<T>(messages: LLMMessage[], schema: object): Promise<T> {
    const { system, rest } = this.splitSystem(messages);
    const instructedSystem = `${system ? system + "\n\n" : ""}Respond with ONLY a single JSON object conforming to this JSON Schema, no prose, no markdown code fences:\n${JSON.stringify(
      schema
    )}`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: DEFAULT_MAX_TOKENS,
      system: instructedSystem,
      messages: rest,
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const raw = textBlock && "text" in textBlock ? textBlock.text : undefined;
    if (!raw) {
      throw new Error("AnthropicProvider.completeJSON: empty response from model");
    }
    const cleaned = raw.trim().replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    try {
      return JSON.parse(cleaned) as T;
    } catch (err) {
      throw new Error(
        `AnthropicProvider.completeJSON: failed to parse model output as JSON: ${(err as Error).message}. Raw: ${cleaned.slice(0, 500)}`
      );
    }
  }
}

function mapError(err: unknown): LLMAvailability {
  const anyErr = err as { status?: number; message?: string };
  if (anyErr?.status === 401 || anyErr?.status === 403) {
    return { ok: false, reason: "invalid-key", detail: anyErr.message };
  }
  return { ok: false, reason: "unknown", detail: anyErr?.message ?? String(err) };
}
