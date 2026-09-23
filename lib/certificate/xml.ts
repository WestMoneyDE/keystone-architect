// Minimal XML/SVG text escaping — used by socialCard.ts when interpolating
// user-controlled strings (display name, role label) into hand-built SVG
// markup, so a name containing `<`, `&`, etc. can't break the SVG.
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
