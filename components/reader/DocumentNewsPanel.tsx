"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, ExternalLink, Newspaper } from "lucide-react";

interface NewsItemDTO {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

interface NewsResponse {
  enabled: boolean;
  items: NewsItemDTO[];
}

interface DocumentNewsPanelProps {
  domainId: string;
  domainTitle: string;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("de-DE", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

/**
 * Notion-style expandable "Document News" panel (plan item 8 / ticket 11).
 * Always renders a collapsed footer affordance — never silently hides —
 * but the disabled state is intentionally minimal/unobtrusive rather than a
 * prominent empty state, since news is off by default for most installs.
 */
export function DocumentNewsPanel({ domainId, domainTitle }: DocumentNewsPanelProps) {
  const [data, setData] = useState<NewsResponse | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/news?domainId=${encodeURIComponent(domainId)}`)
      .then((res) => (res.ok ? res.json() : { enabled: false, items: [] }))
      .then((json: NewsResponse) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setData({ enabled: false, items: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [domainId]);

  // Still loading the initial check — render nothing rather than a
  // flash of the disabled state.
  if (data === null) return null;

  if (!data.enabled) {
    return (
      <div className="mt-6 border-t border-border pt-3">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Newspaper size={13} />
          Keine aktuellen News — Feature ist deaktiviert.{" "}
          <Link href="/setup" className="text-accent hover:underline">
            In den Einstellungen aktivieren
          </Link>
        </p>
      </div>
    );
  }

  const count = data.items.length;

  return (
    <div className="mt-6 border-t border-border pt-3">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg px-1 py-1.5 text-left text-sm text-muted-foreground hover:bg-surface hover:text-foreground"
        aria-expanded={expanded}
      >
        <span className="flex items-center gap-1.5">
          <Newspaper size={14} />
          {count > 0
            ? `${count} aktuelle News zu diesem Thema`
            : `Keine aktuellen News zu "${domainTitle}" gefunden`}
        </span>
        {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="news-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {count === 0 ? (
              <p className="px-1 py-2 text-xs text-muted-foreground">
                Es wurden noch keine News für diese Domäne abgerufen. Der Hintergrund-Job läuft periodisch —
                spätestens beim nächsten Lauf sollten hier Einträge erscheinen.
              </p>
            ) : (
              <ul className="mt-1 flex flex-col gap-1.5 px-1 py-2">
                {data.items.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-surface"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-foreground group-hover:text-accent">
                          {item.title}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                          {item.source} · {formatDate(item.publishedAt)}
                        </span>
                      </span>
                      <ExternalLink
                        size={13}
                        className="mt-0.5 shrink-0 text-muted-foreground group-hover:text-accent"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
