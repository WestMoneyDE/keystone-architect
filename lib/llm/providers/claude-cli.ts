// Claude Code CLI passthrough provider.
//
// Shells out to the user's locally-installed, pre-authenticated `claude`
// binary. This never reads, stores, or touches any OAuth token/credential
// file — Keystone only ever spawns the binary and reads its stdout.
//
// Command: `claude -p --output-format json`, prompt piped via STDIN (never
// as a CLI arg — avoids both shell-injection surface and CLI arg length
// limits). We do NOT pass `--bare`: it strips top-level metadata fields
// (session_id/total_cost_usd) that are useful for the audit trail described
// in the plan, and plain `--output-format json` worked cleanly when tested
// live on this machine.
//
// Verified real output shape (via `claude -p "Say OK" --output-format json`
// on this machine, 2026-09-22, authenticated session):
//   {
//     "type": "result",
//     "subtype": "success",
//     "is_error": false,
//     "result": "OK",
//     "session_id": "...",
//     "total_cost_usd": 0.168...,
//     "duration_ms": 6593,
//     ...
//   }
// We parse defensively — the plan flags this shape as something to confirm
// per-machine/per-version, so we never assume a field is present beyond
// `result`.
//
// CRITICAL / load-bearing (per plan): auth-failure detection MUST match
// stdout/result text, not exit code — some Claude Code versions exit 0
// even when unauthenticated. We check the raw stdout (and, defensively,
// stderr) against /not logged in/i and /please run \/login/i before trusting
// exit code or JSON parse success at all.
//
// Streaming: this ticket implements streaming by chunking the final
// `--output-format json` result (word-by-word) rather than parsing
// `--output-format stream-json` NDJSON — stream-json's event shape is more
// fiddly to parse defensively and non-streaming `json` mode was the shape
// actually verified live on this machine within this ticket's time budget.
// A future ticket can upgrade to true NDJSON streaming without changing
// this provider's public shape.

import { spawn } from "child_process";
import type { LLMAvailability, LLMMessage, LLMProvider } from "../types";

const NOT_AUTHENTICATED_PATTERNS = [/not logged in/i, /please run \/login/i, /\/login/i];
const BINARY_NOT_FOUND_PATTERNS = [/command not found/i, /is not recognized as an internal or external command/i, /enoent/i];

interface ClaudeCliResult {
  result?: string;
  session_id?: string;
  total_cost_usd?: number;
  is_error?: boolean;
  subtype?: string;
  [key: string]: unknown;
}

function runClaude(
  args: string[],
  stdin: string,
  cliPath: string,
  timeoutMs = 60_000
): Promise<{ stdout: string; stderr: string; code: number | null; timedOut: boolean; spawnError?: Error }> {
  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    let settled = false;
    let timedOut = false;

    const child = spawn(cliPath, args, { shell: false });

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout?.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr?.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });

    child.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ stdout, stderr, code: null, timedOut, spawnError: err });
    });

    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ stdout, stderr, code, timedOut });
    });

    child.stdin?.write(stdin);
    child.stdin?.end();
  });
}

function composePrompt(messages: LLMMessage[]): string {
  // The CLI takes a single prompt; fold the message list into one text blob,
  // preserving role labels so multi-turn context isn't silently lost.
  return messages
    .map((m) => {
      if (m.role === "system") return `[System]\n${m.content}`;
      if (m.role === "assistant") return `[Assistant]\n${m.content}`;
      return `[User]\n${m.content}`;
    })
    .join("\n\n");
}

export class ClaudeCliProvider implements LLMProvider {
  readonly id = "claude-cli" as const;
  private cliPath: string;

  constructor(cliPath?: string) {
    this.cliPath = cliPath || "claude";
  }

  async checkAvailability(): Promise<LLMAvailability> {
    const run = await runClaude(["-p", "--output-format", "json"], "Reply with exactly: OK", this.cliPath);

    if (run.spawnError) {
      const msg = run.spawnError.message || "";
      if (BINARY_NOT_FOUND_PATTERNS.some((re) => re.test(msg))) {
        return { ok: false, reason: "not-installed", detail: msg };
      }
      return { ok: false, reason: "unknown", detail: msg };
    }

    const combined = `${run.stdout}\n${run.stderr}`;

    if (run.timedOut) {
      return { ok: false, reason: "unknown", detail: "claude CLI timed out during availability check" };
    }

    // Load-bearing: check text FIRST, before trusting exit code, because
    // some claude versions return exit 0 even when not authenticated.
    if (NOT_AUTHENTICATED_PATTERNS.some((re) => re.test(combined))) {
      return {
        ok: false,
        reason: "not-authenticated",
        detail: "Run `claude login` in a real terminal, then try again.",
      };
    }

    let parsed: ClaudeCliResult | undefined;
    try {
      parsed = JSON.parse(run.stdout) as ClaudeCliResult;
    } catch {
      // fall through — non-JSON output handled below
    }

    if (parsed?.result && NOT_AUTHENTICATED_PATTERNS.some((re) => re.test(parsed!.result!))) {
      return {
        ok: false,
        reason: "not-authenticated",
        detail: "Run `claude login` in a real terminal, then try again.",
      };
    }

    if (parsed?.is_error) {
      return { ok: false, reason: "unknown", detail: parsed.result ?? combined.slice(0, 500) };
    }

    if (run.code !== 0 && !parsed) {
      return { ok: false, reason: "unknown", detail: combined.slice(0, 500) || `exit code ${run.code}` };
    }

    return { ok: true };
  }

  // options (temperature/maxTokens/jsonSchema) has no CLI equivalent to pass
  // through, so the parameter is accepted (interface compliance) but unused.
  async *complete(messages: LLMMessage[]): AsyncIterable<{ delta: string; done: boolean }> {
    const prompt = composePrompt(messages);
    const run = await runClaude(["-p", "--output-format", "json"], prompt, this.cliPath);

    if (run.spawnError) {
      throw new Error(`claude CLI not found or failed to start: ${run.spawnError.message}`);
    }

    const combined = `${run.stdout}\n${run.stderr}`;
    if (NOT_AUTHENTICATED_PATTERNS.some((re) => re.test(combined))) {
      throw new Error("claude CLI is not authenticated. Run `claude login` in a real terminal and try again.");
    }

    let parsed: ClaudeCliResult | undefined;
    try {
      parsed = JSON.parse(run.stdout) as ClaudeCliResult;
    } catch {
      throw new Error(`claude CLI returned non-JSON output: ${run.stdout.slice(0, 500)}`);
    }

    if (parsed.result && NOT_AUTHENTICATED_PATTERNS.some((re) => re.test(parsed!.result!))) {
      throw new Error("claude CLI is not authenticated. Run `claude login` in a real terminal and try again.");
    }

    const text = parsed.result ?? "";
    // Simulated streaming (see file header): chunk the final result word by word.
    const words = text.split(/(\s+)/).filter((w) => w.length > 0);
    for (const word of words) {
      yield { delta: word, done: false };
    }
    yield { delta: "", done: true };
  }

  async completeJSON<T>(messages: LLMMessage[], schema: object): Promise<T> {
    const instructedMessages: LLMMessage[] = [
      ...messages,
      {
        role: "system",
        content: `Respond with ONLY a single JSON object conforming to this JSON Schema, no prose, no markdown fences:\n${JSON.stringify(
          schema
        )}`,
      },
    ];
    const prompt = composePrompt(instructedMessages);
    const run = await runClaude(["-p", "--output-format", "json"], prompt, this.cliPath);

    if (run.spawnError) {
      throw new Error(`claude CLI not found or failed to start: ${run.spawnError.message}`);
    }

    const combined = `${run.stdout}\n${run.stderr}`;
    if (NOT_AUTHENTICATED_PATTERNS.some((re) => re.test(combined))) {
      throw new Error("claude CLI is not authenticated. Run `claude login` in a real terminal and try again.");
    }

    let parsed: ClaudeCliResult;
    try {
      parsed = JSON.parse(run.stdout) as ClaudeCliResult;
    } catch (err) {
      throw new Error(`claude CLI returned non-JSON output: ${(err as Error).message}. Raw: ${run.stdout.slice(0, 500)}`);
    }

    const raw = parsed.result;
    if (!raw) {
      throw new Error("claude CLI completeJSON: empty `result` field in CLI output");
    }
    const cleaned = raw.trim().replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    try {
      return JSON.parse(cleaned) as T;
    } catch (err) {
      throw new Error(
        `claude CLI completeJSON: failed to parse model output as JSON: ${(err as Error).message}. Raw: ${cleaned.slice(0, 500)}`
      );
    }
  }
}
