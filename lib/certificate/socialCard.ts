// lib/certificate/socialCard.ts — builds the 1200x630 shareable social-card
// PNG for a passed test attempt (plan item 10: "matching 1200x630 shareable
// social-card PNG for LinkedIn/Twitter").
//
// Approach: hand-roll a small SVG string (plain shapes + <text>, plus the
// Keystone logo from lib/brand/logo.ts) and rasterize it to PNG with `sharp` (already a project dependency
// transitively available with prebuilt Windows/Linux/macOS binaries via
// libvips, and the only new dependency this ticket adds). Chosen over
// satori+resvg because sharp alone already covers "SVG string -> PNG
// buffer" in one call with zero extra packages, keeping the dependency
// surface minimal per the ticket's instruction.

import { escapeXml } from "./xml";
import { logoSvgMarkup } from "../brand/logo";
import { AUTHOR_CREDIT } from "../brand/credit";

const WIDTH = 1200;
const HEIGHT = 630;

export interface SocialCardInput {
  recipientName: string;
  roleLabel: string;
  score: number;
  issuedAt: string; // pre-formatted display date
  githubUrl: string;
}

export function buildSocialCardSvg(input: SocialCardInput): string {
  const { recipientName, roleLabel, score, issuedAt } = input;
  const logoSize = 96;
  const logoX = WIDTH - 96 - logoSize;
  const logoY = 72;
  const logoMarkup = logoSvgMarkup(logoSize, "card").replace("<svg ", `<svg x=\"${logoX}\" y=\"${logoY}\" `);

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

  ${logoMarkup}
  <text x="${logoX + logoSize}" y="${logoY + logoSize + 30}" font-size="16" font-family="Arial, sans-serif" fill="#374151" text-anchor="end">${escapeXml(AUTHOR_CREDIT)}</text>

  <text x="96" y="270" font-size="30" font-family="Georgia, 'Times New Roman', serif" font-weight="bold" fill="#16181d">${escapeXml(recipientName)}</text>
  <text x="96" y="306" font-size="22" font-family="Georgia, 'Times New Roman', serif" fill="#4f46e5">${escapeXml(roleLabel)}</text>

  <text x="96" y="420" font-size="15" letter-spacing="1.5" font-family="Arial, sans-serif" fill="#9ca3af">SCORE</text>
  <text x="96" y="460" font-size="40" font-family="Georgia, 'Times New Roman', serif" font-weight="bold" fill="#16181d">${score.toFixed(1)}%</text>

  <text x="320" y="420" font-size="15" letter-spacing="1.5" font-family="Arial, sans-serif" fill="#9ca3af">ISSUED</text>
  <text x="320" y="460" font-size="40" font-family="Georgia, 'Times New Roman', serif" font-weight="bold" fill="#16181d">${escapeXml(issuedAt)}</text>

  <text x="96" y="${HEIGHT - 56}" font-size="15" font-family="Arial, sans-serif" fill="#6b7280">GitHub: keystone-architect</text>
</svg>`;
}
