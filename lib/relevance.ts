/**
 * lib/relevance.ts — pure relevance scoring for the per-article right
 * sidebar (ticket 8). Implements EXACTLY the formula from the plan's
 * "Resolved product design" item 2:
 *
 *   score = 100 * recencyDecay(lastMessageAt)         // exp. half-life 72h
 *         + 40  * (isPinned ? 1 : 0)
 *         + 25  * (anchorCurrentlyInViewport ? 1 : 0) // highlight convos only
 *         + 10  * min(messageCount, 10)/10
 *         - 15  * (isOrphanedHighlight ? 1 : 0)
 *
 * Kept pure/side-effect-free on purpose: "anchor in viewport" is inherently
 * a client-side signal (IntersectionObserver), but the caller computes that
 * boolean and passes it in — this module never touches the DOM itself, so
 * it stays trivially unit-testable in isolation.
 */

const RECENCY_HALF_LIFE_HOURS = 72;

/**
 * Exponential recency decay with a 72h half-life: 1.0 right when a message
 * just landed, 0.5 after 72h, 0.25 after 144h, etc. `null` (no messages at
 * all — should not normally happen since every conversation is seeded with
 * at least one message, but defend anyway) decays to 0.
 */
export function recencyDecay(lastMessageAt: Date | string | null | undefined, now: Date = new Date()): number {
  if (!lastMessageAt) return 0;
  const last = typeof lastMessageAt === "string" ? new Date(lastMessageAt) : lastMessageAt;
  if (Number.isNaN(last.getTime())) return 0;
  const hoursSince = Math.max(0, (now.getTime() - last.getTime()) / (1000 * 60 * 60));
  return Math.pow(0.5, hoursSince / RECENCY_HALF_LIFE_HOURS);
}

export interface RelevanceInput {
  lastMessageAt: Date | string | null | undefined;
  isPinned: boolean;
  /** Only meaningful for highlight-anchored conversations; false otherwise. */
  anchorCurrentlyInViewport: boolean;
  messageCount: number;
  /** True only for conversations anchored to a Highlight with orphaned === true. */
  isOrphanedHighlight: boolean;
  /** Injectable for deterministic testing; defaults to `new Date()`. */
  now?: Date;
}

export function computeRelevanceScore(input: RelevanceInput): number {
  const recency = recencyDecay(input.lastMessageAt, input.now ?? new Date());
  const messageDepthBonus = Math.min(Math.max(input.messageCount, 0), 10) / 10;

  return (
    100 * recency +
    40 * (input.isPinned ? 1 : 0) +
    25 * (input.anchorCurrentlyInViewport ? 1 : 0) +
    10 * messageDepthBonus -
    15 * (input.isOrphanedHighlight ? 1 : 0)
  );
}
