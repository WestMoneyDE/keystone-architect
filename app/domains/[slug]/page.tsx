import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText } from "lucide-react";
import { db } from "@/lib/db";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function DomainDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const domain = await db.domain.findUnique({
    where: { slug },
    include: {
      articles: {
        orderBy: { sequence: "asc" },
      },
    },
  });

  if (!domain) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/domains" className="text-sm text-muted-foreground hover:text-foreground">
          ← All domains
        </Link>
        <h1 className="mb-1 mt-2 text-2xl font-bold text-foreground">{domain.title}</h1>
        <p className="text-muted-foreground">
          {domain.articles.length} article{domain.articles.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {domain.articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.id}`}>
            <GlassCard className="flex items-center gap-4 p-4 rounded-xl">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface text-muted-foreground">
                <FileText size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{article.title}</p>
                <p className="text-xs text-muted-foreground">{article.id}</p>
              </div>
              <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                {article.primaryRoles.map((role) => (
                  <Badge key={role} variant="accent">
                    {role}
                  </Badge>
                ))}
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
