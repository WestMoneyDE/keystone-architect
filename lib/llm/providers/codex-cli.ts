// Codex CLI passthrough provider.
//
// EXPERIMENTAL — ToS carve-out not clearly documented by OpenAI for this
// pattern (shelling out to the locally-installed, pre-authenticated `codex`
// binary and piping prompts to `codex exec`). This provider ships opt-in
// only and must NEVER be the default or pre-selected option in the
// onboarding wizard. Surface this at-your-own-risk status clearly in any UI
// that lets a user pick it (see components/setup/ProviderWizard.tsx).
//
// Command: `codex exec`, prompt piped via STDIN (never as a CLI arg).
//
// Hard timeout: older interactive-fallback modes of the Codex CLI are known
// to hang (per the plan). Every spawn here is wrapped in a hard kill-on-stall
// timeout (default 60s) so a hung subprocess can never hang the Node process.
//
// Auth-failure detection: the plan notes Codex's exit-code semantics are
// more conventional/reliable than Claude Code's, but we still treat output
// text ("Not logged in.") as the PRIMARY signal and exit code only as a
// secondary/confirmatory check, for the same robustness reasons as the
// claude-cli provider.
//
// Not installed on the machine this ticket was built on — this file is
// code-reviewed only, not live-verified against a real `codex` binary.

import { spawn } from "child_process";
import type { LLMAvailability, LLMMessage, LLMProvider } from "../types";

const NOT_AUTHENTICATED_PATTERNS = [/not logged in/i, /please run ['`]?codex login['`]?/i, /authentication required/i];
const BINARY_NOT_FOUND_PATTERNS = [/command not found/i, /is not recognized as an internal or external command/i, /enoent/i];

const HARD_TIMEOUT_MS = 60_000;

function runCodex(
  args: string[],
  stdin: string,
  cliPath: string,
  timeoutMs = HARD_TIMEOUT_MS
): Promise<{ stdout: string; stderr: string; code: number | null; timedOut: boolean; spawnError?: Error }> {
  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    let settled = false;
    let timedOut = false;

    const controller = new AbortController();
    const child = spawn(cliPath, args, { shell: false, signal: controller.signal });

    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
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
  return messages
    .map((m) => {
      if (m.role === "system") return `[System]\n${m.content}`;
      if (m.role === "assistant") return `[Assistant]\n${m.content}`;
      return `[User]\n${m.content}`;
    })
    .join("\n\n");
}

export class CodexCliProvider implements LLMProvider {
  readonly id = "codex-cli" as const;
  private cliPath: string;

  constructor(cliPath?: string) {
    this.cliPath = cliPath || "codex";
  }

  async checkAvailability(): Promise<LLMAvailability> {
    const run = await runCodex(["exec"], "Reply with exactly: OK", this.cliPath);

    if (run.spawnError) {
      const msg = run.spawnError.message || "";
      if (BINARY_NOT_FOUND_PATTERNS.some((re) => re.test(msg))) {
        return { ok: false, reason: "not-installed", detail: msg };
      }
      return { ok: false, reason: "unknown", detail: msg };
    }

    if (run.timedOut) {
      return { ok: false, reason: "unknown", detail: "codex CLI timed out during availability check (killed after 60s)" };
    }

    const combined = `${run.stdout}\n${run.stderr}`;

    // Primary signal: output text.
    if (NOT_AUTHENTICATED_PATTERNS.some((re) => re.test(combined))) {
      return {
        ok: false,
        reason: "not-authenticated",
        detail: "Run `codex login` in a real terminal, then try again.",
      };
    }

    // Secondary/confirmatory signal: exit code (more reliable for Codex than
    // for Claude Code per the plan, but still not trusted alone).
    if (run.code !== 0) {
      return { ok: false, reason: "unknown", detail: combined.slice(0, 500) || `exit code ${run.code}` };
    }

    return { ok: true };
  }

  // options (temperature/maxTokens/jsonSchema) has no CLI equivalent to pass
  // through, so the parameter is accepted (interface compliance) but unused.
  async *complete(messages: LLMMessage[]): AsyncIterable<{ delta: string; done: boolean }> {
    const prompt = composePrompt(messages);
    const run = await runCodex(["exec"], prompt, this.cliPath);

    if (run.spawnError) {
      throw new Error(`codex CLI not found or failed to start: ${run.spawnError.message}`);
    }
    if (run.timedOut) {
      throw new Error("codex CLI timed out (killed after 60s) — the process may have stalled.");
    }

    const combined = `${run.stdout}\n${run.stderr}`;
    if (NOT_AUTHENTICATED_PATTERNS.some((re) => re.test(combined))) {
      throw new Error("codex CLI is not authenticated. Run `codex login` in a real terminal and try again.");
    }
    if (run.code !== 0) {
      throw new Error(`codex CLI exited with code ${run.code}: ${combined.slice(0, 500)}`);
    }

    const text = run.stdout.trim();
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
    const run = await runCodex(["exec"], prompt, this.cliPath);

    if (run.spawnError) {
      throw new Error(`codex CLI not found or failed to start: ${run.spawnError.message}`);
    }
    if (run.timedOut) {
      throw new Error("codex CLI timed out (killed after 60s) — the process may have stalled.");
    }

    const combined = `${run.stdout}\n${run.stderr}`;
    if (NOT_AUTHENTICATED_PATTERNS.some((re) => re.test(combined))) {
      throw new Error("codex CLI is not authenticated. Run `codex login` in a real terminal and try again.");
    }
    if (run.code !== 0) {
      throw new Error(`codex CLI exited with code ${run.code}: ${combined.slice(0, 500)}`);
    }

    const raw = run.stdout.trim();
    const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    try {
      return JSON.parse(cleaned) as T;
    } catch (err) {
      throw new Error(
        `codex CLI completeJSON: failed to parse model output as JSON: ${(err as Error).message}. Raw: ${cleaned.slice(0, 500)}`
      );
    }
  }
}
