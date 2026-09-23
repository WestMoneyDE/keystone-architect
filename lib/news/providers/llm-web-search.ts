import { getActiveProvider } from "@/lib/llm/factory";
import type { NewsItemResult, NewsProvider } from "../types";

/**
 * Optional "higher quality" news source, per the plan's item 8: "optional
 * higher-quality alternative uses the already-configured LLM provider's
 * native web-search tool when available."
 *
 * HONESTY NOTE (read before wiring this up anywhere): as of ticket 11,
 * lib/llm/providers/{openai,anthropic}.ts (built in ticket 4) do NOT expose
 * or use any native web-search tool — OpenAIProvider calls plain
 * `chat.completions.create` and AnthropicProvider calls plain
 * `messages.create`, neither with a web-search tool attached. So a
 * "live web search" implementation here would be fabricated.
 *
 * This class instead implements option (a) from the ticket: a scoped-down,
 * clearly-labeled, PROMPT-BASED provider that asks the active LLM what it
 * knows about recent developments in a domain from its training data. It is
 * NOT real-time web search, results are NOT guaranteed current, and every
 * item's `summary` is prefixed to say so explicitly. It also has no way to
 * produce genuine per-article URLs (the model can't browse), so it links
 * back to a search-engine query instead of fabricating an article URL —
 * fabricating a working URL would be worse than being upfront that this
 * provider doesn't have one to give.
 *
 * lib/news/factory.ts does NOT select this provider by default — see that
 * file for why. It's included so the interface has a second real
 * implementation to compile/test against, not because it's a trustworthy
 * default news source.
 */
export class LlmWebSearchNewsProvider implements NewsProvider {
  readonly id = "llm-web-search" as const;

  constructor(private userId: string) {}

  async fetchForDomain(domainSlug: string, domainTitle: string): Promise<NewsItemResult[]> {
    const provider = await getActiveProvider(this.userId);
    if (!provider) return [];

    type ModelKnowledgeItem = { headline: string; summary: string };

    try {
      const schema = {
        type: "object",
        properties: {
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                headline: { type: "string" },
                summary: { type: "string" },
              },
              required: ["headline", "summary"],
            },
          },
        },
        required: ["items"],
      };

      const result = await provider.completeJSON<{ items: ModelKnowledgeItem[] }>(
        [
          {
            role: "system",
            content:
              "You are summarizing what you already know from training data about recent " +
              "developments in a technical domain. You have NO live web access. Do not " +
              "invent URLs, dates, or sources. Return 3-5 short, general items describing " +
              "notable trends/themes you're aware of for this domain, each with a one-line " +
              "headline and a 1-2 sentence summary.",
          },
          {
            role: "user",
            content: `Domain: ${domainTitle} (${domainSlug}). What notable trends or developments do you know about?`,
          },
        ],
        schema
      );

      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(domainTitle + " news")}`;
      const now = new Date().toISOString();

      return (result.items ?? []).slice(0, 5).map((item) => ({
        title: item.headline,
        url: searchUrl,
        source: `${provider.id} (model knowledge, not live search)`,
        publishedAt: now,
        summary:
          "⚠️ Based on the model's training data, not a live web search — may be outdated. " +
          item.summary,
      }));
    } catch (err) {
      console.warn(`[news/llm-web-search] failed for domain "${domainSlug}": ${(err as Error).message}`);
      return [];
    }
  }
}
