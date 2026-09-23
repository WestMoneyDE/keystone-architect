// lib/srs.ts — SM-2 spaced repetition algorithm (classic SuperMemo-2).
//
// TypeScript port of an earlier flat-file SM-2 implementation — same
// formulas, same reset-on-again behavior, same ease-factor floor.
//
// One deliberate shape change from the old app: `SrsState.dueAt` /
// Prisma's `SrsState` model store dates as `DateTime` (real Date objects
// via Prisma), not ISO strings — the old app was a flat-file/localStorage
// app with no DB, so it serialized dates as strings. This port keeps
// `dueAt`/`lastReviewedAt` as `Date | null` to match the DB-backed model
// exactly; the actual SM-2 math (quality mapping, interval growth,
// ease-factor formula, floor, reset-on-again) is unchanged.

export type SrsRating = "again" | "hard" | "good" | "easy";

// Rating -> SM-2 quality scale (0-5). Only "again" (quality < 3) counts as
// a failed recall in classic SM-2 — matches the old app exactly.
const RATING_TO_QUALITY: Record<SrsRating, number> = {
  again: 0,
  hard: 3,
  good: 4,
  easy: 5,
};

export interface SrsCardState {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  dueAt: Date;
}

/**
 * Fresh card state for a question the user has never reviewed — mirrors
 * `SrsState`'s Prisma column defaults (easeFactor 2.5, intervalDays 0,
 * repetitions 0, dueAt now) so a brand-new `SrsState` row and a value
 * returned by this function are equivalent.
 */
export function newCardState(): SrsCardState {
  return {
    repetitions: 0,
    easeFactor: 2.5,
    intervalDays: 0,
    dueAt: new Date(),
  };
}

/**
 * Applies one SM-2 review to `state` for the given self-rating, returning
 * the new state. Faithful port of the old app's `reviewCard`:
 *   - quality < 3 ("again"): failed recall — repetitions resets to 0,
 *     interval drops to 1 day, but the ease factor is NOT punished beyond
 *     the normal formula below (matches the old app's comment: "don't
 *     punish too hard").
 *   - quality >= 3 (hard/good/easy): successful recall — repetitions
 *     increments; interval is 1 day on the first repetition, 6 days on
 *     the second, and `round(intervalDays * easeFactor)` afterwards.
 *   - Ease factor always updates via the classic SM-2 formula and is
 *     floored at 1.3, then rounded to 2 decimal places.
 *   - `dueAt` is `now + intervalDays` days.
 */
export function reviewCard(state: SrsCardState, ratingKey: SrsRating): SrsCardState {
  const quality = RATING_TO_QUALITY[ratingKey];
  if (quality === undefined) throw new Error(`Unknown rating: ${ratingKey}`);

  let { repetitions, easeFactor, intervalDays } = state;

  if (quality < 3) {
    // Failed recall: reset repetitions, short interval, but keep ease
    // factor (don't punish too hard) — the ease-factor formula below still
    // runs and will lower it somewhat, exactly as in the old app.
    repetitions = 0;
    intervalDays = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      intervalDays = 1;
    } else if (repetitions === 2) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
  }

  // Update ease factor (SM-2 formula), floor at 1.3.
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const now = new Date();
  const dueAt = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  return {
    repetitions,
    easeFactor: Math.round(easeFactor * 100) / 100,
    intervalDays,
    dueAt,
  };
}

/** True when `state` is due for review at or before `referenceDate`. */
export function isDue(state: SrsCardState, referenceDate: Date = new Date()): boolean {
  return state.dueAt.getTime() <= referenceDate.getTime();
}
