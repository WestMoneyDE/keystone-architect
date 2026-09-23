import Parser from "rss-parser";
import type { NewsItemResult, NewsProvider } from "../types";
import { feedsForDomain } from "../feeds";

const MAX_AGE_DAYS = 30;
const MAX_ITEMS_PER_DOMAIN = 8;
const FETCH_TIMEOUT_MS = 8000;

const parser = new Parser({
  timeout: FETCH_TIMEOUT_MS,
  headers: {
    // Some feeds (e.g. InfoQ) return 406 Not Acceptable to obviously
    // non-browser user agents. A realistic UA string plus an explicit
    // Accept header keeps this a well-behaved, honest RSS client without
    // trying to look like anything other than an automated feed reader.
    "User-Agent":
      "Mozilla/5.0 (compatible; Keystone/1.0; +self-hosted news fetch; RSS reader)",
    Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
  },
});

/**
 * Default NewsProvider. No API key required — polls a small curated set of
 * real RSS/Atom feeds (lib/news/feeds.ts) mapped to each domain's topic
 * cluster. Each feed is fetched independently inside its own try/catch so
 * one unreachable/malformed feed never breaks the whole domain fetch.
 */
export class RssNewsProvider implements NewsProvider {
  readonly id = "rss" as const;

  async fetchForDomain(domainSlug: string, _domainTitle: string): Promise<NewsItemResult[]> {
    const feeds = feedsForDomain(domainSlug);
    const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

    const results: NewsItemResult[] = [];

    for (const feed of feeds) {
      try {
        const parsed = await parser.parseURL(feed.url);
        for (const item of parsed.items ?? []) {
          const url = item.link;
          const title = item.title;
          if (!url || !title) continue;

          const publishedRaw = item.isoDate ?? item.pubDate;
          const publishedAt = publishedRaw ? new Date(publishedRaw) : null;
          if (publishedAt && !Number.isNaN(publishedAt.getTime())) {
            if (publishedAt.getTime() < cutoff) continue;
          }

          results.push({
            title: title.trim(),
            url,
            source: feed.name,
            publishedAt: (publishedAt && !Number.isNaN(publishedAt.getTime())
              ? publishedAt
              : new Date()
            ).toISOString(),
            summary: (item.contentSnippet || item.summary || undefined)?.slice(0, 500),
          });
        }
      } catch (err) {
        // Per-feed failure (unreachable, malformed XML, timeout, etc.) must
        // never break the rest of the domain's fetch.
        console.warn(
          `[news/rss] feed "${feed.name}" (${feed.url}) failed for domain "${domainSlug}": ${
            (err as Error).message
          }`
        );
      }
    }

    // Newest first, capped at a sane per-domain count.
    results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    return results.slice(0, MAX_ITEMS_PER_DOMAIN);
  }
}
