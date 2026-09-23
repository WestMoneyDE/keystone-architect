import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CertificateView } from "@/components/test/CertificateView";
import { GITHUB_REPO_URL } from "@/lib/certificate/generate";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" });

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ role: string; attemptId: string }>;
}) {
  const { role: roleId, attemptId } = await params;

  const certificate = await db.certificate.findUnique({
    where: { attemptId },
    include: { user: true, attempt: { include: { test: { include: { role: true } } } } },
  });

  if (!certificate || certificate.roleId !== roleId) {
    notFound();
  }

  const recipientName = certificate.user.displayName?.trim() || certificate.user.username;
  const roleLabel = certificate.attempt.test.role.label;

  return (
    <div className="flex flex-col gap-6">
      <Link href={`/roles/${roleId}`} className="text-sm text-muted-foreground hover:text-foreground">
        ← {roleLabel}
      </Link>
      <CertificateView
        certificateId={certificate.id}
        recipientName={recipientName}
        roleLabel={roleLabel}
        score={certificate.score}
        issuedAt={dateFormatter.format(certificate.issuedAt)}
        verificationHash={certificate.verificationHash}
        githubUrl={GITHUB_REPO_URL}
        shareUrl={`/roles/${roleId}/certificate/${attemptId}`}
      />
    </div>
  );
}
