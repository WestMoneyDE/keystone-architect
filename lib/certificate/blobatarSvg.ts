// lib/certificate/blobatarSvg.ts — embeds a recipient's Blobatar avatar in
// the server-rendered certificate PDF (ticket 9 / plan item 17).
//
// Investigation summary (see ticket 9 report for the full writeup): the
// `blobatar` package (the plain-JS core `@blobatar/react`'s `<Blobatar>`
// wraps client-side) exports a non-React, server-safe generator at
// `blobatar/blob` — `blobatar(name, opts): string` — that returns a raw SVG
// markup string (viewBox "0 0 100 100"), built from the SAME deterministic
// hash/trait/palette pipeline `@blobatar/react` uses. So the exact same
// name seed produces the exact same blob on the certificate as it does in
// the app's `<Avatar>` component everywhere else (AppShell sidebar,
// onboarding preview, Settings) — no separate/different-looking fallback
// needed.
//
// `@react-pdf/renderer`'s `<Image>` component does not rasterize arbitrary
// SVG markup, so the raw SVG string can't be handed to it directly. Rather
// than pull in a rasterization dependency (sharp/resvg) just for this,
// this module parses blobatar's (intentionally minimal, hand-rolled)
// output — always just `<g fill="...">` groups containing `<circle>` and
// `<path>` elements, see node_modules/blobatar/dist/uri.js's `Ct`/render
// functions — and re-renders those same primitives directly with
// @react-pdf/renderer's own `<G>`/`<Circle>`/`<Path>` vector components.
// This keeps the certificate's avatar fully vector (crisp at any print
// size, no rasterization artifacts) and adds zero new dependencies.
//
// If blobatar ever changes its output shape to include elements this
// parser doesn't recognize (e.g. <rect>, <ellipse>), `parseBlobatarSvg`
// simply skips them (does not throw) and `generate.ts` falls back to the
// deterministic colored-initial badge in `initialsBadge.ts` — see the
// fallback wiring there.

import { blobatar } from "blobatar/blob";

export interface SvgGroup {
  fill: string;
  circles: { cx: number; cy: number; r: number }[];
  paths: { d: string }[];
}

export interface ParsedBlobatar {
  viewBox: string;
  groups: SvgGroup[];
}

const GROUP_RE = /<g fill="([^"]*)">([\s\S]*?)<\/g>/g;
const CIRCLE_RE = /<circle cx="([-\d.]+)" cy="([-\d.]+)" r="([-\d.]+)"\s*\/>/g;
const PATH_RE = /<path d="([^"]*)"\s*\/>/g;
const VIEWBOX_RE = /viewBox="([^"]*)"/;

/**
 * Parses blobatar's raw SVG markup into the small set of primitives it
 * actually emits. Returns `null` if the markup doesn't match the expected
 * shape at all (defensive — see module doc), so callers can fall back.
 */
export function parseBlobatarSvg(svg: string): ParsedBlobatar | null {
  const viewBoxMatch = svg.match(VIEWBOX_RE);
  if (!viewBoxMatch) return null;

  const groups: SvgGroup[] = [];
  let groupMatch: RegExpExecArray | null;
  GROUP_RE.lastIndex = 0;
  while ((groupMatch = GROUP_RE.exec(svg))) {
    const [, fill, inner] = groupMatch;
    const circles: SvgGroup["circles"] = [];
    let cm: RegExpExecArray | null;
    CIRCLE_RE.lastIndex = 0;
    while ((cm = CIRCLE_RE.exec(inner))) {
      circles.push({ cx: Number(cm[1]), cy: Number(cm[2]), r: Number(cm[3]) });
    }
    const paths: SvgGroup["paths"] = [];
    let pm: RegExpExecArray | null;
    PATH_RE.lastIndex = 0;
    while ((pm = PATH_RE.exec(inner))) {
      paths.push({ d: pm[1] });
    }
    groups.push({ fill, circles, paths });
  }

  if (groups.length === 0) return null;

  return { viewBox: viewBoxMatch[1], groups };
}

/** Generates and parses a Blobatar for `name` in one step. */
export function blobatarForPdf(name: string): ParsedBlobatar | null {
  const seed = name.trim().length > 0 ? name : "keystone-user";
  const svg = blobatar(seed);
  return parseBlobatarSvg(svg);
}
