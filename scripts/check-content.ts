/**
 * Keystone — content & source denylist check.
 *
 * Scans every file that would be committed (tracked + untracked-but-not-ignored,
 * via `git ls-files`; falls back to a directory walk without git) for personal
 * data, private-source leftovers and obvious secrets. Exits non-zero on any hit.
 *
 *   npm run check:content        (also runs as part of `npm run lint`)
 *
 * Add a rule here whenever a new class of leak is found — never weaken one to
 * make the check pass; fix the content instead.
 */

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..");
const SELF = path.relative(ROOT, __filename).split(path.sep).join("/");

interface Rule {
  name: string;
  pattern: RegExp;
  /** Optional filter: return false to ignore a specific match. */
  allow?: (match: string) => boolean;
}

// Patterns are assembled from fragments so this file never matches itself
// when grepped by other tools.
const j = (...parts: string[]) => parts.join("");

const ALLOWED_EMAIL_DOMAINS = [
  "users.noreply.github.com",
  "example.com",
  "example.org",
  "example.net",
];

/**
 * Private terms (personal names, unrelated private project names, internal
 * codenames) are listed only as SHA-256 hashes of the lower-cased, NFC-normalised
 * token, so this public file doesn't itself disclose them. A token is a run of
 * letters/digits, optionally joined by "-" or "_"; every contiguous sub-run of a
 * joined token is checked too (so "a-b-c" also checks "a-b", "b-c", "b", …).
 * To add a term: node -e 'console.log(require("crypto").createHash("sha256").update("term").digest("hex"))'
 */
const PRIVATE_TOKEN_HASHES = new Set([
  "81f4383292d6beec8a2860c865decc6d1a70dc7cfe02a4cf2eba9560d5d32c2b",
  "c23c3a5991d3de8dea53d0e460aea0d54f4ce68777a4f085e12b08d3b25956a2",
  "790272c06db5d329c92e4fb1be244b2d6340c15286628852093b0a7f4e6292aa",
  "67ce112a9e7ecc775938697932926201e6a14da571af38af7dc5683c206c6992",
  "4cb007e4f954b9e5ed520b8afe42f0241d2d46136cdf0f39ccd3086622542276",
  "8620e440e3f5dcc6f516d0c7955e8bc108426e16f6ee79917c1fbf563cd26fa7",
  "7ab7b4d3c0e9d789ad35e357b0e85e966eb8d1baa13df790852227c04b0a116c",
  "6e813a384ffeef6b0e900f360e8a3c335a06124fc42e197de5557655e1f2a8f7",
  "035549a413ab32579a2a59f112c69ee67ac92428ab4e6bfafb9a374795dc79cd",
  "b9a5c2d083c33f25cea01d56f57fb70b8b47ab04433b8a27bf67b874345ada60",
  "98b02f90f5fe2c4487a2005a274c4c6924085a2198a2dfcb23cd621c5e4944ba",
  "320c9d906545d41ae342d5d13228d0bb26d7be3330dd623854dcaa152b645b61",
  "a73e818f66de167de603df2e35be42b30cca3759202ffc43dfa623ef5770aea5",
]);
const TOKEN_RE = /[\p{L}\p{N}]+(?:[-_][\p{L}\p{N}]+)*/gu;
const tokenHashCache = new Map<string, boolean>();

function isPrivateToken(token: string): boolean {
  let hit = tokenHashCache.get(token);
  if (hit === undefined) {
    hit = PRIVATE_TOKEN_HASHES.has(createHash("sha256").update(token).digest("hex"));
    tokenHashCache.set(token, hit);
  }
  return hit;
}

function privateTokensIn(line: string): string[] {
  const found: string[] = [];
  for (const m of line.normalize("NFC").matchAll(TOKEN_RE)) {
    const parts = m[0].toLowerCase().split(/(?=[-_])|(?<=[-_])/).filter((p) => p !== "-" && p !== "_");
    const seps = m[0].match(/[-_]/g) ?? [];
    for (let a = 0; a < parts.length; a++) {
      for (let b = a; b < parts.length; b++) {
        let t = parts[a];
        for (let k = a + 1; k <= b; k++) t += seps[k - 1] + parts[k];
        if (isPrivateToken(t)) found.push(t);
      }
    }
  }
  return found;
}

const RULES: Rule[] = [
  // --- personal data -------------------------------------------------------
  {
    name: "e-mail address",
    pattern: /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g,
    allow: (m) =>
      /@\d+x\.(png|jpe?g|webp|svg)$/i.test(m) || // retina asset names like icon@2x.png
      ALLOWED_EMAIL_DOMAINS.some((d) => m.toLowerCase().endsWith(`@${d}`) || m.toLowerCase().endsWith(`.${d}`)),
  },
  { name: "local user path", pattern: /\b[A-Za-z]:[\\/]+Users[\\/]/i },
  { name: "home path", pattern: /(^|[\s"'`(])\/(home|Users)\/[a-z0-9._-]+\//i },
  { name: "cloud-drive path", pattern: new RegExp(j("i", "Cloud", "\\s?Drive|\\bi", "Cloud\\b"), "i") },
  // --- private CV / planning leftovers --------------------------------------
  { name: "CV evidence id", pattern: new RegExp(j("\\bC", "V-(\\d|CURRENT|Evidenz|Claim|Projekt|Kontext)"), "i") },
  { name: "CV mention", pattern: new RegExp(j("\\bC", "V\\b")) },
  { name: "cv_evidence field", pattern: new RegExp(j("\\bcv", "_evidence\\b")) },
  { name: "Lebenslauf", pattern: new RegExp(j("Lebens", "lauf"), "i") },
  // --- secrets ----------------------------------------------------------------
  { name: "OpenAI-style key", pattern: /\bsk-(proj-|ant-)?[A-Za-z0-9_-]{24,}/ },
  { name: "GitHub token", pattern: /\b(ghp|gho|ghs|ghu|github_pat)_[A-Za-z0-9_]{20,}/ },
  { name: "AWS access key", pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "hard-coded ENCRYPTION_KEY", pattern: /ENCRYPTION_KEY\s*[=:]\s*["']?[0-9a-fA-F]{32,}/ },
  { name: "private key block", pattern: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
];

const SKIP_FILES = new Set([SELF, "package-lock.json", "src-tauri/Cargo.lock"]);
const SKIP_DIRS = ["node_modules/", ".next/", ".git/", "src-tauri/target/", "src-tauri/gen/", "storage/"];
const BINARY_EXT = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".icns", ".pdf", ".woff", ".woff2", ".ttf", ".otf", ".zip", ".exe", ".msi",
]);

function listFiles(): string[] {
  try {
    const out = execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], {
      cwd: ROOT,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
    return out.split("\0").filter(Boolean);
  } catch {
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
        const rel = dir ? `${dir}/${e.name}` : e.name;
        if (e.isDirectory()) {
          if (!SKIP_DIRS.some((d) => `${rel}/`.startsWith(d))) walk(rel);
        } else if (!rel.startsWith(".env") || rel === ".env.example") {
          files.push(rel);
        }
      }
    };
    walk("");
    return files;
  }
}

function main() {
  const files = listFiles().filter(
    (f) =>
      !SKIP_FILES.has(f) &&
      !SKIP_DIRS.some((d) => f.startsWith(d)) &&
      !BINARY_EXT.has(path.extname(f).toLowerCase()) &&
      fs.existsSync(path.join(ROOT, f)),
  );

  const hits: string[] = [];
  for (const file of files) {
    const text = fs.readFileSync(path.join(ROOT, file), "utf8");
    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => {
      for (const t of privateTokensIn(line)) {
        hits.push(`${file}:${i + 1}: [private term] token of length ${t.length} (see PRIVATE_TOKEN_HASHES)`);
      }
      for (const rule of RULES) {
        const re = new RegExp(rule.pattern.source, rule.pattern.flags.includes("g") ? rule.pattern.flags : `${rule.pattern.flags}g`);
        for (const m of line.matchAll(re)) {
          if (rule.allow?.(m[0])) continue;
          const start = Math.max(0, (m.index ?? 0) - 40);
          hits.push(`${file}:${i + 1}: [${rule.name}] …${line.slice(start, (m.index ?? 0) + m[0].length + 40)}…`);
        }
      }
    });
  }

  if (hits.length > 0) {
    console.error(`check:content — ${hits.length} finding(s) in ${files.length} files:\n`);
    for (const h of hits.slice(0, 200)) console.error(`  ${h}`);
    if (hits.length > 200) console.error(`  … and ${hits.length - 200} more`);
    process.exit(1);
  }
  console.log(`check:content — OK (${files.length} files scanned, ${RULES.length} rules + ${PRIVATE_TOKEN_HASHES.size} private-term hashes)`);
}

main();
