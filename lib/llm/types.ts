// Core LLM provider abstraction. Copied verbatim from the approved build
// plan's "Core interfaces" section — do not rename anything here, tickets
// 5/7/8/10 depend on this exact shape.

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMCompletionOptions {
  temperature?: number;
  maxTokens?: number;
  jsonSchema?: object; // when set, provider must return structured JSON conforming to it
}

export type LLMAvailability =
  | { ok: true }
  | { ok: false; reason: "not-authenticated" | "not-installed" | "invalid-key" | "unknown"; detail?: string };

export interface LLMProvider {
  readonly id: "openai" | "anthropic" | "claude-cli" | "codex-cli";
  checkAvailability(): Promise<LLMAvailability>;
  complete(messages: LLMMessage[], options?: LLMCompletionOptions): AsyncIterable<{ delta: string; done: boolean }>;
  completeJSON<T>(messages: LLMMessage[], schema: object): Promise<T>;
}
