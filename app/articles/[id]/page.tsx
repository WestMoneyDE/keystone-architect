import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/Badge";
import { ArticleBody } from "@/components/reader/ArticleBody";
import { SelectionPopup } from "@/components/reader/SelectionPopup";
import { ConversationSidebar } from "@/components/sidebar/ConversationSidebar";
import { DocumentNewsPanel } from "@/components/reader/DocumentNewsPanel";

export const dynamic = "force-dynamic";

async function getDefaultUser() {
  return db.user.findFirst({ where: { isDefault: true } });
}

/**
 * Logs a page view for the "next best article" behavioral signals (see
 * lib/recommendation.ts). Fire-and-forget: awaited internally but never
 * blocks/throws into the render path — a logging failure must never break
 * article reading. No dedup — repeat views are meaningful signal too
 * (interest reinforced by revisiting), and the query in recommendation.ts
 * only reads the most recent N rows anyway.
 */
async function logArticleView(userId: string, articleId: string) {
  try {
    await db.articleView.create({ data: { userId, articleId } });
  } catch (err) {
    console.error("Failed to log article view (non-fatal):", err);
  }
}

async function relatedArticleLabels(ids: string[]) {
  if (ids.length === 0) return [];
  const rows = await db.article.findMany({
    where: { id: { in: ids } },
    select: { id: true, title: true },
  });
  const byId = new Map(rows.map((r) => [r.id, r.title]));
  // Preserve the order/id list from the source article even if some ids are missing.
  return ids.map((id) => ({ id, title: byId.get(id) ?? null }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const article = await db.article.findUnique({ where: { id } });

  if (!article) {
    notFound();
  }

  const [requires, related, user] = await Promise.all([
    relatedArticleLabels(article.requires),
    relatedArticleLabels(article.related),
    getDefaultUser(),
  ]);

  // Not awaited into the render path on purpose (see logArticleView's doc
  // comment) — this is a server component so there's no client beacon, but
  // we still don't want a slow/failed insert to delay the page.
  if (user) void logArticleView(user.id, article.id);

  return (
    // Two-column layout: main content + the per-article conversations
    // sidebar (ticket 8), flush next to the title (the sidebar's first grid
    // row lines up with the title/badges row, not just anywhere further
    // down the page). Below the `lg` breakpoint this collapses to a single
    // stacked column — ConversationSidebar itself additionally starts
    // collapsed there with its own toggle, so a long conversation list
    // doesn't push the article below the fold on narrow viewports.
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex min-w-0 flex-col gap-6">
        <div>
          <Link
            href={`/domains/${article.domainSlug}`}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← {article.domainTitle}
          </Link>
          <h1 className="mb-2 mt-2 text-3xl font-bold text-foreground">{article.h1}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral">{article.domainTitle}</Badge>
            {article.primaryRoles.map((role) => (
              <Badge key={role} variant="accent">
                {role}
              </Badge>
            ))}
          </div>
        </div>

        <ArticleBody body={article.body} />
        <SelectionPopup articleId={article.id} />

        {(requires.length > 0 || related.length > 0) && (
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
            {requires.length > 0 && (
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Requires:</span>{" "}
                {requires.map((r, idx) => (
                  <span key={r.id}>
                    {idx > 0 && ", "}
                    <Link href={`/articles/${r.id}`} className="text-accent hover:underline">
                      {r.title ?? r.id}
                    </Link>
                  </span>
                ))}
              </p>
            )}
            {related.length > 0 && (
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Related:</span>{" "}
                {related.map((r, idx) => (
                  <span key={r.id}>
                    {idx > 0 && ", "}
                    <Link href={`/articles/${r.id}`} className="text-accent hover:underline">
                      {r.title ?? r.id}
                    </Link>
                  </span>
                ))}
              </p>
            )}
          </div>
        )}

        <DocumentNewsPanel domainId={article.domainId} domainTitle={article.domainTitle} />
      </div>

      <div className="lg:pt-[3.75rem]">
        <ConversationSidebar articleId={article.id} />
      </div>
    </div>
  );
}
