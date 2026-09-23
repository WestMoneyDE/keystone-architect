// lib/certificate/socialCard.ts — builds the 1200x630 shareable social-card
// PNG for a passed test attempt (plan item 10: "matching 1200x630 shareable
// social-card PNG for LinkedIn/Twitter").
//
// Approach: hand-roll a small SVG string (plain shapes + <text>, plus the
// recipient's Blobatar re-embedded as its own raw <svg> groups — same
// server-safe `blobatar()` generator used for the PDF, see blobatarSvg.ts)
// and rasterize it to PNG with `sharp` (already a project dependency
// transitively available with prebuilt Windows/Linux/macOS binaries via
// libvips, and the only new dependency this ticket adds). Chosen over
// satori+resvg because sharp alone already covers "SVG string -> PNG
// buffer" in one call with zero extra packages, keeping the dependency
// surface minimal per the ticket's instruction.

import { escapeXml } from "./xml";
import type { ParsedBlobatar } from "./blobatarSvg";

const WIDTH = 1200;
const HEIGHT = 630;

export interface SocialCardInput {
  recipientName: string;
  roleLabel: string;
  score: number;
  issuedAt: string; // pre-formatted display date
  avatar: ParsedBlobatar | null;
  githubUrl: string;
}

function fallbackColorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  const palette = ["#4f46e5", "#0ea5e9", "#16a34a", "#d97706", "#dc2626", "#7c3aed", "#0891b2", "#db2777"];
  return palette[hash % palette.length];
}

function renderAvatarGroup(avatar: ParsedBlobatar, size: number): string {
  const scale = size / 100; // avatar viewBox is always "0 0 100 100"
  const groups = avatar.groups
    .map((g) => {
      const circles = g.circles.map((c) => `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}"/>`).join("");
      const paths = g.paths.map((p) => `<path d="${p.d}"/>`).join("");
      return `<g fill="${g.fill}">${circles}${paths}</g>`;
    })
    .join("");
  return `<g transform="scale(${scale})">${groups}</g>`;
}

export function buildSocialCardSvg(input: SocialCardInput): string {
  const { recipientName, roleLabel, score, issuedAt, avatar } = input;
  const avatarSize = 88;
  const avatarX = 96;
  const avatarY = 236;

  const avatarMarkup = avatar
    ? `<clipPath id="avatarClip"><circle cx="${avatarX + avatarSize / 2}" cy="${avatarY + avatarSize / 2}" r="${avatarSize / 2}"/></clipPath>` +
      `<g clip-path="url(#avatarClip)"><rect x="${avatarX}" y="${avatarY}" width="${avatarSize}" height="${avatarSize}" fill="#f3f4f6"/>` +
      `<g transform="translate(${avatarX}, ${avatarY})">${renderAvatarGroup(avatar, avatarSize)}</g></g>`
    : `<circle cx="${avatarX + avatarSize / 2}" cy="${avatarY + avatarSize / 2}" r="${avatarSize / 2}" fill="${fallbackColorFor(recipientName)}"/>` +
      `<text x="${avatarX + avatarSize / 2}" y="${avatarY + avatarSize / 2 + 14}" font-size="34" font-family="Georgia, 'Times New Roman', serif" font-weight="bold" fill="#ffffff" text-anchor="middle">${escapeXml((recipientName.trim()[0] ?? "K").toUpperCase())}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#eef2ff"/>
      <stop offset="100%" stop-color="#fdfcf8"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect x="24" y="24" width="${WIDTH - 48}" height="${HEIGHT - 48}" fill="none" stroke="#4f46e5" stroke-width="3"/>
  <rect x="34" y="34" width="${WIDTH - 68}" height="${HEIGHT - 68}" fill="none" stroke="#c7c2b8" stroke-width="1"/>

  <text x="96" y="120" font-size="20" letter-spacing="4" font-family="Georgia, 'Times New Roman', serif" fill="#4f46e5">KEYSTONE CERTIFICATION</text>
  <text x="96" y="180" font-size="46" font-family="Georgia, 'Times New Roman', serif" font-weight="bold" fill="#16181d">Certificate of Completion</text>

  ${avatarMarkup}

  <text x="${avatarX + avatarSize + 28}" y="${avatarY + 34}" font-size="30" font-family="Georgia, 'Times New Roman', serif" font-weight="bold" fill="#16181d">${escapeXml(recipientName)}</text>
  <text x="${avatarX + avatarSize + 28}" y="${avatarY + 68}" font-size="22" font-family="Georgia, 'Times New Roman', serif" fill="#4f46e5">${escapeXml(roleLabel)}</text>

  <text x="96" y="420" font-size="15" letter-spacing="1.5" font-family="Arial, sans-serif" fill="#9ca3af">SCORE</text>
  <text x="96" y="460" font-size="40" font-family="Georgia, 'Times New Roman', serif" font-weight="bold" fill="#16181d">${score.toFixed(1)}%</text>

  <text x="320" y="420" font-size="15" letter-spacing="1.5" font-family="Arial, sans-serif" fill="#9ca3af">ISSUED</text>
  <text x="320" y="460" font-size="40" font-family="Georgia, 'Times New Roman', serif" font-weight="bold" fill="#16181d">${escapeXml(issuedAt)}</text>

  <text x="96" y="${HEIGHT - 56}" font-size="15" font-family="Arial, sans-serif" fill="#6b7280">GitHub: keystone-architect</text>
</svg>`;
}
