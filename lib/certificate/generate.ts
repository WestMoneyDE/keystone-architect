// lib/certificate/generate.ts — server-side certificate generation
// (ticket 9 / plan items 10 & 17). Generates a real PDF certificate via
// @react-pdf/renderer and a matching 1200x630 shareable social-card PNG,
// writes both to disk, and upserts the Certificate row.
//
export const GITHUB_REPO_URL = "https://github.com/WestMoneyDE/keystone-architect";

import { createHash } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { renderToBuffer } from "@react-pdf/renderer";
import sharp from "sharp";
import { db } from "@/lib/db";
import { CertificateDocument } from "./CertificateDocument";
import { buildSocialCardSvg } from "./socialCard";

// Not under /public — served exclusively through app/api/certificates/[id]/
// {pdf,social-card}/route.ts rather than as raw static files, per the
// ticket's instruction not to expose the filesystem path publicly.
const STORAGE_DIR = path.join(process.cwd(), "storage", "certificates");

/**
 * Verification hash formula (documented per ticket instruction — exact and
 * reproducible so a third party can verify a certificate independently
 * given attemptId + score + issuedAt from the Certificate record):
 *
 *   sha256(`${attemptId}:${score.toFixed(2)}:${issuedAt.toISOString()}`)
 *
 * hex-encoded. Not a security control (this is a self-hosted, offline app
 * with no central verification server) — it's a tamper-evidence marker
 * printed on the certificate so a re-computed hash from the stored
 * Certificate row can be checked to match what's printed on the PDF.
 */
export function computeVerificationHash(attemptId: string, score: number, issuedAt: Date): string {
  const material = `${attemptId}:${score.toFixed(2)}:${issuedAt.toISOString()}`;
  return createHash("sha256").update(material).digest("hex");
}

const dateFormatter = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" });

/**
 * Generates (or regenerates) the certificate for a completed, PASSED
 * TestAttempt. Idempotent on `attemptId` (Certificate.attemptId is unique):
 * calling this again for the same attempt overwrites the existing PDF/PNG
 * files and updates the Certificate row rather than erroring, so a
 * corrupted render or a later re-run doesn't get permanently stuck.
 */
export async function generateCertificate(attemptId: string): Promise<{ certificateId: string }> {
  const attempt = await db.testAttempt.findUnique({
    where: { id: attemptId },
    include: { test: { include: { role: true } }, user: true },
  });

  if (!attempt) throw new Error(`generateCertificate: TestAttempt ${attemptId} not found`);
  if (attempt.score == null || !attempt.passed) {
    throw new Error(`generateCertificate: TestAttempt ${attemptId} has not passed (score=${attempt.score}, passed=${attempt.passed})`);
  }

  const issuedAt = new Date();
  const score = attempt.score;
  const verificationHash = computeVerificationHash(attemptId, score, issuedAt);
  const recipientName = attempt.user.displayName?.trim() || attempt.user.username;
  const roleLabel = attempt.test.role.label;
  const issuedAtDisplay = dateFormatter.format(issuedAt);

  await mkdir(STORAGE_DIR, { recursive: true });

  const pdfBuffer = await renderToBuffer(
    CertificateDocument({
      recipientName,
      roleLabel,
      score,
      issuedAt: issuedAtDisplay,
      verificationHash,
      githubUrl: GITHUB_REPO_URL,
    })
  );

  const socialCardSvg = buildSocialCardSvg({
    recipientName,
    roleLabel,
    score,
    issuedAt: issuedAtDisplay,
    githubUrl: GITHUB_REPO_URL,
  });
  const socialCardBuffer = await sharp(Buffer.from(socialCardSvg)).png().toBuffer();

  const pdfRelPath = path.join("storage", "certificates", `${attemptId}.pdf`);
  const pngRelPath = path.join("storage", "certificates", `${attemptId}.png`);

  await Promise.all([
    writeFile(path.join(process.cwd(), pdfRelPath), pdfBuffer),
    writeFile(path.join(process.cwd(), pngRelPath), socialCardBuffer),
  ]);

  const certificate = await db.certificate.upsert({
    where: { attemptId },
    create: {
      attemptId,
      userId: attempt.userId,
      roleId: attempt.test.roleId,
      score,
      issuedAt,
      verificationHash,
      pdfPath: pdfRelPath,
      socialCardPath: pngRelPath,
    },
    update: {
      score,
      issuedAt,
      verificationHash,
      pdfPath: pdfRelPath,
      socialCardPath: pngRelPath,
    },
    select: { id: true },
  });

  return { certificateId: certificate.id };
}
