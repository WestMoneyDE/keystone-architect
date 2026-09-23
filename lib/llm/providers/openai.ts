import OpenAI from "openai";
import type { LLMAvailability, LLMCompletionOptions, LLMMessage, LLMProvider } from "../types";

const DEFAULT_MODEL = "gpt-4o-mini";

export class OpenAIProvider implements LLMProvider {
  readonly id = "openai" as const;
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model?: string) {
    this.client = new OpenAI({ apiKey });
    this.model = model || DEFAULT_MODEL;
  }

  async checkAvailability(): Promise<LLMAvailability> {
    try {
      // Cheapest possible real round-trip against the account: list models.
      await this.client.models.list();
      return { ok: true };
    } catch (err) {
      return mapError(err);
    }
  }

  async *complete(
    messages: LLMMessage[],
    options?: LLMCompletionOptions
  ): AsyncIterable<{ delta: string; done: boolean }> {
    const stream = await this.client.chat.completions.create({
      model: this.model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: options?.temperature,
      max_tokens: options?.maxTokens,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content ?? "";
      const finished = chunk.choices[0]?.finish_reason != null;
      if (delta) {
        yield { delta, done: false };
      }
      if (finished) {
        yield { delta: "", done: true };
      }
    }
  }

  async completeJSON<T>(messages: LLMMessage[], schema: object): Promise<T> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        {
          role: "system" as const,
          content: `Respond with ONLY a single JSON object conforming to this JSON Schema, no prose, no markdown fences:\n${JSON.stringify(
            schema
          )}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) {
      throw new Error("OpenAIProvider.completeJSON: empty response from model");
    }
    try {
      return JSON.parse(raw) as T;
    } catch (err) {
      throw new Error(
        `OpenAIProvider.completeJSON: failed to parse model output as JSON: ${(err as Error).message}. Raw: ${raw.slice(0, 500)}`
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
