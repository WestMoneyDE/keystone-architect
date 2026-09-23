import type { NewsProvider } from "./types";
import { RssNewsProvider } from "./providers/rss";

/**
 * Mirrors lib/llm/factory.ts's pattern for NewsProvider. Unlike the LLM
 * factory, this does not need a per-user config lookup yet: the RSS
 * provider (no API key required) is the only production-ready
 * implementation right now. `LlmWebSearchNewsProvider` exists
 * (lib/news/providers/llm-web-search.ts) but is honestly a prompt-based
 * "model knowledge" fallback, not real web search — see that file's doc
 * comment — so this factory does not select it by default. If a future
 * ticket wires real web-search tool-use into the LLM providers, swap the
 * branch below to read a config flag and return
 * `new LlmWebSearchNewsProvider(userId)` when requested.
 */
export function getNewsProvider(_userId: string): NewsProvider {
  return new RssNewsProvider();
}
