// News-fetch provider abstraction. Copied verbatim from the approved build
// plan's "Core interfaces" section — mirrors lib/llm/types.ts's LLMProvider
// pattern. Do not rename anything here.

export interface NewsItemResult {
  title: string;
  url: string;
  source: string;
  publishedAt: string; // ISO date
  summary?: string;
}

export interface NewsProvider {
  readonly id: "rss" | "llm-web-search";
  fetchForDomain(domainSlug: string, domainTitle: string): Promise<NewsItemResult[]>;
}
