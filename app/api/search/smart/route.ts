import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getActiveProvider } from "@/lib/llm/factory";
import type { LLMMessage } from "@/lib/llm/types";

// Smart, LLM-ranked semantic search backing AppShell's sidebar search box and
// CommandPalette's Cmd+K search — upgrades the plain `contains` keyword
// search in app/api/search/route.ts (which stays as-is, used as the
// no-provider fallback and for fast incremental/keystroke filtering).
//
// Cost/latency approach (documented per the plan's constraint): we never send
// the 720 articles' full markdown bodies through the LLM. Instead we fetch a
// cheap metadata-only candidate set (id, title, domainTitle, primaryRoles,
// ziel) for ALL articles — this is a small amount of text (a title + one-line
// "ziel" per article, no bodies) — and ask the model to select+rank every
// genuinely relevant one against the user's natural-language query via
// `completeJSON`. This keeps the prompt small (roughly a few hundred bytes
// per article * 720 ≈ low hundreds of KB of text at most, well within
// context budgets) while still giving the model enough signal (title, domain,
// role tags, one-line goal) to judge relevance without reading full bodies.
//
// No fixed result-count cap: the model is instructed to return every
// genuinely relevant article (not a hardcoded "top 10"), and relevance is
// enforced solely by MATCH_CONFIDENCE_THRESHOLD below — a broad query (e.g.
// "Kubernetes") can legitimately surface many more results than a narrow
// one. The dropdown UI (AppShell/CommandPalette) handles this with an
// internal scroll instead of growing unbounded.

const bodySchema = z.object({ query: z.string().min(1).max(500) });

// Below this match-confidence threshold we consider the knowledge base to
// not actually have a good answer and offer the external-web fallback
// instead of force-fitting a weak match. Chosen conservatively: 87%/72%
// examples in the plan read as "confident" percentages, so results below
// 40% are treated as noise-level guesses rather than genuine matches.
const MATCH_CONFIDENCE_THRESHOLD = 40;

interface RankedResult {
  articleId: string;
  matchPercent: number;
  reason: string;
}

interface SmartSearchLLMResponse {
  results: RankedResult[];
  noMatch: boolean;
}

const RESULT_SCHEMA = {
  type: "object",
  properties: {
    results: {
      type: "array",
      items: {
        type: "object",
        properties: {
          articleId: { type: "string" },
          matchPercent: { type: "number" },
          reason: { type: "string" },
        },
        required: ["articleId", "matchPercent", "reason"],
      },
    },
    noMatch: { type: "boolean" },
  },
  required: ["results", "noMatch"],
};

async function getDefaultUser() {
  const user = await db.user.findFirst({ where: { isDefault: true } });
  if (!user) {
    throw new Error("No default user found — run `npm run db:seed` first.");
  }
  return user;
}

function buildExternalSearchUrl(query: string): string {
  const refined = `${query} enterprise architecture`;
  return `https://www.google.com/search?q=${encodeURIComponent(refined)}`;
}

function clampPercent(n: unknown): number {
  const num = typeof n === "number" && Number.isFinite(n) ? n : 0;
  return Math.max(0, Math.min(100, Math.round(num)));
}

export async function POST(request: Request) {
  const user = await getDefaultUser();
  const json = await request.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { query } = parsed.data;

  // Fire-and-forget: log the query for the "next best article"
  // search-intent signal (lib/recommendation.ts). This route already only
  // fires on submit/idle-pause (not per-keystroke, unlike the plain
  // keyword route), so every call here is a genuinely-submitted query —
  // no extra length/debounce threshold needed on top of that.
  db.searchLog.create({ data: { userId: user.id, query } }).catch((err) => {
    console.error("Failed to log search query (non-fatal):", err);
  });

  const provider = await getActiveProvider(user.id);
  if (!provider) {
    return NextResponse.json({ mode: "keyword-fallback" as const });
  }

  const candidates = await db.article.findMany({
    select: { id: true, title: true, domainTitle: true, primaryRoles: true, ziel: true },
  });

  const candidateLines = candidates
    .map((a) => {
      const roles = a.primaryRoles.length > 0 ? a.primaryRoles.join(",") : "-";
      const ziel = a.ziel ? a.ziel.slice(0, 200) : "";
      return `${a.id} | ${a.title} | ${a.domainTitle} | roles:${roles} | ${ziel}`;
    })
    .join("\n");

  const llmMessages: LLMMessage[] = [
    {
      role: "system",
      content:
        "You are Keystone's search relevance ranker. Given a natural-language question and a list of " +
        "candidate knowledge-base articles (id | title | domain | roles | one-line goal), select EVERY " +
        "article that would genuinely help answer the question — there is no fixed limit on how many you " +
        "return; return as few or as many as actually match, from zero up to the full candidate list. Do " +
        "not artificially cap the count and do not force-fit weak matches just to pad the list. For each " +
        "selected article, give a matchPercent (0-100, honest confidence that the article answers the " +
        "question — do not inflate) and a short one-sentence reason (in German). If none of the " +
        "candidates genuinely address the question, set noMatch to true and return an empty results " +
        "array. Respond with ONLY a JSON object matching the given schema, no prose, no markdown fences.",
    },
    {
      role: "user",
      content: `Frage: "${query}"\n\nKandidaten-Artikel:\n${candidateLines}`,
    },
  ];

  let llmResult: SmartSearchLLMResponse;
  try {
    llmResult = await provider.completeJSON<SmartSearchLLMResponse>(llmMessages, RESULT_SCHEMA);
  } catch (err) {
    return NextResponse.json(
      { error: "llm-error", message: err instanceof Error ? err.message : "LLM error" },
      { status: 502 },
    );
  }

  const rawResults = Array.isArray(llmResult?.results) ? llmResult.results : [];
  const clamped = rawResults
    .filter((r) => r && typeof r.articleId === "string" && r.articleId.length > 0)
    .map((r) => ({
      articleId: r.articleId,
      matchPercent: clampPercent(r.matchPercent),
      reason: typeof r.reason === "string" ? r.reason.slice(0, 300) : "",
    }));

  const confidentResults = clamped.filter((r) => r.matchPercent >= MATCH_CONFIDENCE_THRESHOLD);

  if (llmResult?.noMatch || confidentResults.length === 0) {
    return NextResponse.json({
      mode: "smart" as const,
      results: [],
      suggestExternalSearch: true,
      externalSearchUrl: buildExternalSearchUrl(query),
    });
  }

  // Don't trust the model's title text — re-look-up the real title/domainTitle
  // from the DB for every selected article, dropping any hallucinated ids.
  const articleIds = confidentResults.map((r) => r.articleId);
  const dbArticles = await db.article.findMany({
    where: { id: { in: articleIds } },
    select: { id: true, title: true, domainTitle: true },
  });
  const byId = new Map(dbArticles.map((a) => [a.id, a]));

  const results = confidentResults
    .filter((r) => byId.has(r.articleId))
    .map((r) => {
      const article = byId.get(r.articleId)!;
      return {
        articleId: r.articleId,
        title: article.title,
        domainTitle: article.domainTitle,
        matchPercent: r.matchPercent,
        reason: r.reason,
      };
    })
    .sort((a, b) => b.matchPercent - a.matchPercent);

  if (results.length === 0) {
    return NextResponse.json({
      mode: "smart" as const,
      results: [],
      suggestExternalSearch: true,
      externalSearchUrl: buildExternalSearchUrl(query),
    });
  }

  return NextResponse.json({ mode: "smart" as const, results });
}
