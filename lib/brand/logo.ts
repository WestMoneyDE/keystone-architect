// Shared geometry for the Keystone mark (viewBox 0 0 64 64): an arch whose
// highlighted keystone locks it together, standing on an open book, with a
// spark for AI-native learning. Used by the React mark, the PDF certificate
// and the social card so all three stay identical.

export const LOGO_VIEWBOX = "0 0 64 64";

export const LOGO_COLORS = {
  gradientFrom: "#4f46e5",
  gradientTo: "#7c3aed",
  stone: "#ffffff",
  keystone: "#67e8f9",
  spark: "#67e8f9",
};

export const LOGO_SHAPES = {
  background: { x: 0, y: 0, width: 64, height: 64, rx: 15 },
  archLeft: "M16 42 A16 16 0 0 1 27.59 26.62",
  archRight: "M36.41 26.62 A16 16 0 0 1 48 42",
  archStrokeWidth: 7,
  keystone: "M27.9 19.6 L36.1 19.6 L34.2 30.4 L29.8 30.4 Z",
  book: "M12 49 Q22 44.5 32 49 Q42 44.5 52 49",
  bookStrokeWidth: 3.2,
  spark: "M48 8.5 Q49.2 12.3 53 13.5 Q49.2 14.7 48 18.5 Q46.8 14.7 43 13.5 Q46.8 12.3 48 8.5 Z",
};

/** The mark as a standalone SVG string (social card, static asset). */
export function logoSvgMarkup(size: number, idSuffix = "k"): string {
  const s = LOGO_SHAPES;
  const c = LOGO_COLORS;
  const gid = `ksg-${idSuffix}`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${LOGO_VIEWBOX}">` +
    `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${c.gradientFrom}"/><stop offset="1" stop-color="${c.gradientTo}"/></linearGradient></defs>` +
    `<rect x="0" y="0" width="64" height="64" rx="${s.background.rx}" fill="url(#${gid})"/>` +
    `<path d="${s.archLeft}" fill="none" stroke="${c.stone}" stroke-width="${s.archStrokeWidth}"/>` +
    `<path d="${s.archRight}" fill="none" stroke="${c.stone}" stroke-width="${s.archStrokeWidth}"/>` +
    `<path d="${s.keystone}" fill="${c.keystone}"/>` +
    `<path d="${s.book}" fill="none" stroke="${c.stone}" stroke-width="${s.bookStrokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="${s.spark}" fill="${c.spark}"/>` +
    `</svg>`
  );
}
