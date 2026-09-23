/**
 * Short (1-3 word) labels for the sidebar's compact domain list.
 *
 * The Domain model / Prisma schema has no dedicated short-label field, and
 * this is purely a display concern scoped to the collapsible sidebar nav
 * (components/shell/AppShell.tsx) — so rather than a DB migration, this is
 * a small static mapping keyed by Domain.id, derived from each domain's
 * full `title`. The full title is still used everywhere else (e.g. the
 * /domains pages).
 *
 * Falls back to a truncated version of the full title for any domain id
 * this mapping doesn't cover (e.g. a newly seeded domain), so the sidebar
 * never crashes or renders blank — see `getDomainShortLabel` below.
 */
export const domainShortLabels: Record<string, string> = {
  "00": "Navigation",
  "01": "Target Roles",
  "02": "Linux Systems",
  "03": "Networking",
  "04": "Enterprise Networking",
  "05": "Distributed Systems",
  "06": "Software Architecture",
  "07": "Backend & APIs",
  "08": "Messaging",
  "09": "Databases",
  "10": "Data Platforms",
  "11": "GenAI Architecture",
  "12": "Agentic AI",
  "13": "RAG & Retrieval",
  "14": "ML Engineering",
  "15": "MLOps",
  "16": "Kubernetes",
  "17": "GPU & Inference",
  "18": "Cloud Foundations",
  "19": "AWS",
  "20": "Azure",
  "21": "GCP",
  "22": "DevOps & GitOps",
  "23": "Security & IAM",
  "24": "Observability",
  "25": "Enterprise Architecture",
  "26": "AI Governance",
  "27": "FinOps",
  "28": "IoT & Edge",
  "29": "Commerce & ERP",
  "30": "Architect Practice",
};

const FALLBACK_MAX_LENGTH = 24;

/**
 * Returns the compact sidebar label for a domain, falling back to a
 * truncated version of its full title when this domain's id isn't in the
 * static mapping above.
 */
export function getDomainShortLabel(domainId: string, fullTitle: string): string {
  const mapped = domainShortLabels[domainId];
  if (mapped) return mapped;

  if (fullTitle.length <= FALLBACK_MAX_LENGTH) return fullTitle;
  return `${fullTitle.slice(0, FALLBACK_MAX_LENGTH - 1).trimEnd()}…`;
}
