/**
 * Keystone — knowledge base importer.
 *
 * Parses the 720 bundled Markdown knowledge-base articles
 * (`content/knowledge-base/<domain>/<article>.md`, JSON frontmatter + Markdown body) plus the
 * domain manifest (`content/manifest.json`) into a normalized in-memory
 * shape that prisma/seed.ts upserts into the database.
 *
 * Both paths default to the repo-local `content/` folder, so a fresh clone
 * seeds without any configuration. Override them with KNOWLEDGE_BASE_PATH /
 * KNOWLEDGE_BASE_MANIFEST_PATH to import your own (compatible) content.
 */

import fs from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// Public shapes consumed by prisma/seed.ts
// ---------------------------------------------------------------------------

export interface ImportedDomain {
  id: string;
  slug: string;
  title: string;
  wave: number;
}

export interface ImportedInterviewQuestion {
  position: number;
  question: string;
  referenceAnswer: string;
}

export interface ImportedArticle {
  id: string;
  title: string;
  h1: string;
  ziel: string;
  domainId: string;
  domainSlug: string;
  domainTitle: string;
  sequence: number;
  documentType: string;
  primaryRoles: string[];
  requires: string[];
  related: string[];
  competencies: unknown;
  body: string;
  path: string;
  interviewQuestions: ImportedInterviewQuestion[];
  checklist: string[];
}

export interface ImportResult {
  domains: ImportedDomain[];
  articles: ImportedArticle[];
  source: "markdown";
}

// ---------------------------------------------------------------------------
// Config / defaults
// ---------------------------------------------------------------------------

const REPO_ROOT = path.resolve(__dirname, "..");
const DEFAULT_KB_PATH = path.join(REPO_ROOT, "content", "knowledge-base");
const DEFAULT_MANIFEST_PATH = path.join(REPO_ROOT, "content", "manifest.json");

function resolveFromRepo(p: string): string {
  return path.isAbsolute(p) ? p : path.resolve(REPO_ROOT, p);
}

function resolveKbPath(): string {
  return resolveFromRepo(process.env.KNOWLEDGE_BASE_PATH || DEFAULT_KB_PATH);
}

function resolveManifestPath(): string {
  return resolveFromRepo(process.env.KNOWLEDGE_BASE_MANIFEST_PATH || DEFAULT_MANIFEST_PATH);
}

// ---------------------------------------------------------------------------
// Markdown parsing
// ---------------------------------------------------------------------------

interface Frontmatter {
  id: string;
  title: string;
  domain: string;
  sequence?: number;
  document_type?: string;
  primary_roles?: string[];
  requires?: Array<string | { id: string }>;
  related?: string[];
  competencies?: unknown;
}

function walkMarkdownFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkMarkdownFiles(full));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      results.push(full);
    }
  }
  return results;
}

function extractFrontmatter(content: string): { frontmatter: Frontmatter | null; body: string } {
  // Frontmatter is JSON between the first two lines of "---"
  const parts = content.split(/^---\s*$/m);
  if (parts.length < 3) return { frontmatter: null, body: content };
  const jsonPart = parts[1].trim();
  const body = parts.slice(2).join("---").trim();
  let frontmatter: Frontmatter | null;
  try {
    frontmatter = JSON.parse(jsonPart);
  } catch (e) {
    console.error(`Failed to parse frontmatter JSON: ${(e as Error).message}`);
    return { frontmatter: null, body };
  }
  return { frontmatter, body };
}

function extractSection(body: string, headingRegex: RegExp): string {
  // Returns the text of a "## Heading" section up to the next "## " heading (or end of doc)
  const lines = body.split("\n");
  let start = -1;
  let end = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (start === -1 && headingRegex.test(lines[i])) {
      start = i + 1;
      continue;
    }
    if (start !== -1 && /^## /.test(lines[i])) {
      end = i;
      break;
    }
  }
  if (start === -1) return "";
  return lines.slice(start, end).join("\n").trim();
}

function parseInterviewQuestions(sectionText: string): ImportedInterviewQuestion[] {
  // Pattern: "### N. Question text" followed by "**Antwort:** answer text" (until next ### or end)
  const questions: ImportedInterviewQuestion[] = [];
  const blocks = sectionText.split(/^### /m).filter(Boolean);
  let position = 1;
  for (const block of blocks) {
    const lines = block.split("\n");
    const headingLine = lines[0] || "";
    const qMatch = headingLine.match(/^\d+\.\s*(.+)$/);
    const question = qMatch ? qMatch[1].trim() : headingLine.trim();
    const rest = lines.slice(1).join("\n").trim();
    const aMatch = rest.match(/\*\*Antwort:\*\*\s*([\s\S]*)/);
    const answer = aMatch ? aMatch[1].trim() : rest;
    if (question && answer) {
      questions.push({ position: position++, question, referenceAnswer: answer });
    }
  }
  return questions;
}

function parseChecklist(sectionText: string): string[] {
  const items: string[] = [];
  for (const line of sectionText.split("\n")) {
    const m = line.match(/^-\s*\[[ xX]\]\s*(.+)$/) || line.match(/^-\s+(.+)$/);
    if (m) items.push(m[1].trim());
  }
  return items;
}

function extractH1(body: string): string {
  const m = body.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : "";
}

function extractZiel(body: string): string {
  const m = body.match(/^>\s*\*\*Ziel:\*\*\s*([\s\S]*?)(?=\n\n|\n##)/m);
  return m ? m[1].trim() : "";
}

function loadFromMarkdown(): ImportResult {
  const kbBase = resolveKbPath();
  const manifestPath = resolveManifestPath();

  if (!fs.existsSync(kbBase) || !fs.existsSync(manifestPath)) {
    throw new Error(
      `Knowledge base not found. Expected articles at "${kbBase}" and the manifest at ` +
        `"${manifestPath}". The repository ships both under content/ — if you set ` +
        `KNOWLEDGE_BASE_PATH / KNOWLEDGE_BASE_MANIFEST_PATH, check that they point to existing paths.`,
    );
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
    domains: Array<{ id: string; slug: string; source_title: string; count: number; wave: number }>;
  };

  const domainMeta: Record<string, { slug: string; title: string; count: number; wave: number }> = {};
  for (const d of manifest.domains) {
    domainMeta[d.id] = { slug: d.slug, title: d.source_title, count: d.count, wave: d.wave };
  }

  const files = walkMarkdownFiles(kbBase).sort();
  const articles: ImportedArticle[] = [];

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, "utf8");
    const { frontmatter, body } = extractFrontmatter(raw);
    if (!frontmatter || !frontmatter.id) {
      console.error(`Skipping (no valid frontmatter): ${filePath}`);
      continue;
    }

    const domainId = frontmatter.domain;
    const dMeta = domainMeta[domainId] || {
      slug: `domain-${domainId}`,
      title: `Domain ${domainId}`,
      count: 0,
      wave: 0,
    };

    const interviewSection = extractSection(body, /^## Interviewfragen\s*$/);
    const checklistSection = extractSection(body, /^## Production Checklist\s*$/);
    const interviewQuestions = parseInterviewQuestions(interviewSection);
    const checklist = parseChecklist(checklistSection);
    const h1 = extractH1(body) || frontmatter.title;
    const ziel = extractZiel(body);
    const relPath = path.relative(kbBase, filePath).split(path.sep).join("/");

    articles.push({
      id: frontmatter.id,
      title: frontmatter.title,
      h1,
      ziel,
      domainId,
      domainSlug: dMeta.slug,
      domainTitle: dMeta.title,
      sequence: frontmatter.sequence ?? 0,
      documentType: frontmatter.document_type ?? "",
      primaryRoles: frontmatter.primary_roles ?? [],
      requires: (frontmatter.requires ?? []).map((r) => (typeof r === "string" ? r : r.id)),
      related: frontmatter.related ?? [],
      competencies: frontmatter.competencies ?? {},
      body,
      path: relPath,
      interviewQuestions,
      checklist,
    });
  }

  articles.sort((a, b) => a.sequence - b.sequence);

  const domains: ImportedDomain[] = manifest.domains.map((d) => ({
    id: d.id,
    slug: d.slug,
    title: d.source_title,
    wave: d.wave,
  }));

  return { domains, articles, source: "markdown" };
}

// ---------------------------------------------------------------------------
// Public entrypoint
// ---------------------------------------------------------------------------

export function importKnowledgeBase(): ImportResult {
  return loadFromMarkdown();
}

// Allow running standalone for a quick sanity check: `npx tsx scripts/import-knowledge-base.ts`
if (require.main === module) {
  const result = importKnowledgeBase();
  const totalQuestions = result.articles.reduce((sum, a) => sum + a.interviewQuestions.length, 0);
  console.log(`Source: ${result.source}`);
  console.log(`Domains: ${result.domains.length}`);
  console.log(`Articles: ${result.articles.length}`);
  console.log(`Interview questions: ${totalQuestions}`);
}
