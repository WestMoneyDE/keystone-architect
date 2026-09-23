/**
 * lib/recommendation.ts — "next best article" scoring for the home
 * dashboard (fast-follow to ticket 12/14).
 *
 * Ticket 12 shipped a static heuristic: role-filtered, not-yet-touched,
 * ordered by curriculum order (domain wave, then article sequence). This
 * module keeps that ordering as the BASE/tiebreaker (so a fresh account
 * with zero ArticleView/SearchLog history degrades gracefully to exactly
 * ticket 12's behavior) and layers three real behavioral signals on top:
 *
 *   1. Graph affinity — the candidate's `related`/`requires` array
 *      contains an already-touched article's id, OR the candidate's id
 *      appears in an already-touched article's `related`/`requires`
 *      array (checked bidirectionally, since the graph isn't guaranteed
 *      symmetric in the manifest data).
 *   2. View-recency domain affinity — the candidate's domain matches a
 *      domain the user has recently opened (last 10 ArticleView rows),
 *      weighted so more recent views count for more (same spirit as
 *      lib/relevance.ts's exponential recency decay, simplified to a
 *      linear rank-based weight here since we only need order, not
 *      wall-clock timestamps of the *candidate* — the sidebar's use case
 *      differs enough that reusing its exact half-life formula isn't a
 *      good fit for "rank position in a 10-item recent-views list").
 *   3. Search-intent keyword overlap — the candidate's title/domainTitle
 *      shares a word with a recent search query (last 10 SearchLog
 *      rows), case-insensitive, stop-words-lite filtered so short/common
 *      German/English connector words don't cause noisy matches.
 *
 * Each signal contributes an additive score and, when it fires, a short
 * honest one-line reason string is attached (highest-scoring signal
 * wins the displayed reason) — no reason is shown that didn't actually
 * fire for that article.
 */

import { db } from "@/lib/db";

// Scoring weights — tuned by feel (same approach as lib/relevance.ts),
// not empirically fit. Graph affinity (you already learned the
// prerequisite/sibling) is the strongest signal because it is the most
// specific/intentional; search intent is weakest because a single
// keyword match is the weakest form of evidence about future interest.
const GRAPH_AFFINITY_SCORE = 50;
const VIEW_AFFINITY_MAX_SCORE = 30; // recency-weighted, decays across the last 10 views
const SEARCH_AFFINITY_SCORE = 20;
// Tiny per-row tiebreaker so curriculum order still decides ties when no
// behavioral signal fired at all (base heuristic from ticket 12).
const CURRICULUM_BASE_MAX = 1;

const RECENT_VIEWS_LIMIT = 10;
const RECENT_SEARCHES_LIMIT = 10;

const STOPWORDS = new Set([
  "der", "die", "das", "und", "oder", "für", "mit", "von", "ist", "ein", "eine",
  "the", "and", "for", "with", "from", "is", "a", "an", "of", "to", "in", "on",
]);

export interface RecommendationCandidate {
  id: string;
  title: string;
  domainTitle: string;
  domainId: string;
  primaryRoles: string[];
  sequence: number;
  requires: string[];
  related: string[];
  domain: { wave: number };
}

export interface ScoredRecommendation {
  id: string;
  title: string;
  domainTitle: string;
  primaryRoles: string[];
  score: number;
  reason: string;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-zäöüß0-9]+/i)
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w));
}

/**
 * Fetches the raw behavioral signal rows needed to score recommendations.
 * Kept separate from scoring itself so scoring stays pure/testable.
 */
async function loadSignals(userId: string, touchedArticleIds: Set<string>) {
  const [recentViews, recentSearches, touchedArticles] = await Promise.all([
    db.articleView.findMany({
      where: { userId },
      orderBy: { viewedAt: "desc" },
      take: RECENT_VIEWS_LIMIT,
      select: { articleId: true, article: { select: { domainId: true } } },
    }),
    db.searchLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: RECENT_SEARCHES_LIMIT,
      select: { query: true },
    }),
    touchedArticleIds.size > 0
      ? db.article.findMany({
          where: { id: { in: Array.from(touchedArticleIds) } },
          select: { id: true, requires: true, related: true },
        })
      : Promise.resolve([]),
  ]);

  return { recentViews, recentSearches, touchedArticles };
}

/**
 * Scores and ranks candidate articles (already role-filtered + not-yet-
 * touched by the caller — see app/page.tsx) by behavioral affinity,
 * falling back to curriculum order when no signal fires.
 */
export async function scoreRecommendations(
  userId: string,
  candidates: RecommendationCandidate[],
  touchedArticleIds: Set<string>,
  limit = 6,
): Promise<ScoredRecommendation[]> {
  if (candidates.length === 0) return [];

  const { recentViews, recentSearches, touchedArticles } = await loadSignals(userId, touchedArticleIds);

  // Build the set of ids "connected to" something already touched
  // (bidirectional: either direction of the requires/related edge).
  const connectedIds = new Map<string, string>(); // candidateId -> id of the touched article it connects to
  for (const touched of touchedArticles) {
    for (const relId of [...touched.requires, ...touched.related]) {
      if (!connectedIds.has(relId)) connectedIds.set(relId, touched.id);
    }
  }
  for (const candidate of candidates) {
    if (connectedIds.has(candidate.id)) continue;
    const hit = [...candidate.requires, ...candidate.related].find((relId) => touchedArticleIds.has(relId));
    if (hit) connectedIds.set(candidate.id, hit);
  }

  // Recency-weighted domain affinity: most-recent view = full weight,
  // decaying linearly across the last N views (rank-based, not wall-clock —
  // see module doc for why).
  const domainWeight = new Map<string, number>();
  recentViews.forEach((v, idx) => {
    const domainId = v.article.domainId;
    const weight = (RECENT_VIEWS_LIMIT - idx) / RECENT_VIEWS_LIMIT; // 1.0 down to 0.1
    domainWeight.set(domainId, Math.max(domainWeight.get(domainId) ?? 0, weight));
  });

  const searchTokens = new Set(recentSearches.flatMap((s) => tokenize(s.query)));
  const mostRecentQuery = recentSearches[0]?.query;

  const touchedTitleById = new Map<string, string>();
  // We only have ids/requires/related for touched articles from the query
  // above (no title selected there) — fetch titles lazily only if needed
  // for the reason string, to keep the common path cheap.
  const connectedTouchedIds = new Set(connectedIds.values());
  if (connectedTouchedIds.size > 0) {
    const titledTouched = await db.article.findMany({
      where: { id: { in: Array.from(connectedTouchedIds) } },
      select: { id: true, title: true },
    });
    for (const t of titledTouched) touchedTitleById.set(t.id, t.title);
  }

  const maxCurriculumIndex = Math.max(1, candidates.length - 1);

  const scored = candidates.map((candidate, curriculumIndex) => {
    let score = 0;
    let reason = "Nächstes Kapitel in deinem Lernpfad";
    let bestSignalScore = 0;

    // Signal 1: graph affinity
    const connectedTo = connectedIds.get(candidate.id);
    if (connectedTo) {
      score += GRAPH_AFFINITY_SCORE;
      if (GRAPH_AFFINITY_SCORE > bestSignalScore) {
        bestSignalScore = GRAPH_AFFINITY_SCORE;
        const touchedTitle = touchedTitleById.get(connectedTo);
        reason = touchedTitle
          ? `Baut auf "${touchedTitle}" auf`
          : "Baut auf einem bereits gelesenen Artikel auf";
      }
    }

    // Signal 2: view-recency domain affinity
    const weight = domainWeight.get(candidate.domainId) ?? 0;
    if (weight > 0) {
      const viewScore = VIEW_AFFINITY_MAX_SCORE * weight;
      score += viewScore;
      if (viewScore > bestSignalScore) {
        bestSignalScore = viewScore;
        reason = `Passt zu Artikeln, die du kürzlich in ${candidate.domainTitle} angesehen hast`;
      }
    }

    // Signal 3: search-intent keyword overlap
    if (searchTokens.size > 0) {
      const candidateTokens = new Set([...tokenize(candidate.title), ...tokenize(candidate.domainTitle)]);
      const overlap = [...candidateTokens].some((t) => searchTokens.has(t));
      if (overlap) {
        score += SEARCH_AFFINITY_SCORE;
        if (SEARCH_AFFINITY_SCORE > bestSignalScore) {
          bestSignalScore = SEARCH_AFFINITY_SCORE;
          reason = mostRecentQuery
            ? `Passt zu deiner letzten Suche nach "${mostRecentQuery}"`
            : "Passt zu deiner letzten Suche";
        }
      }
    }

    // Base curriculum order tiebreaker — always applied, tiny weight, so
    // it only decides ties/fresh-account fallback and never overrides a
    // real behavioral signal.
    score += CURRICULUM_BASE_MAX * (1 - curriculumIndex / maxCurriculumIndex);

    return {
      id: candidate.id,
      title: candidate.title,
      domainTitle: candidate.domainTitle,
      primaryRoles: candidate.primaryRoles,
      score,
      reason,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}
