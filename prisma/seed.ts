/**
 * Keystone — database seed script.
 *
 * Idempotent: every write goes through `upsert`, so `npm run db:seed` is
 * safe to re-run repeatedly during development.
 *
 * Orchestrates:
 *   (a) upsert Domain rows
 *   (b) upsert Article + InterviewQuestion + ChecklistItem rows
 *   (c) upsert the 8 Role rows
 *   (d) seed RoleMeta from data/role-meta.json
 *   (e) create one default User + FeatureFlags row (v1 has no login)
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { databaseUrl } from "../lib/defaults";
import fs from "node:fs";
import path from "node:path";
import { importKnowledgeBase } from "../scripts/import-knowledge-base";

const prisma = new PrismaClient({ datasourceUrl: databaseUrl() });

const ROLE_LABELS: Record<string, string> = {
  CHIEF: "Chief Architect",
  STAFF: "Staff Engineer",
  PRINCIPAL: "Principal Architect",
  ENTERPRISE: "Enterprise Architect",
  CLOUD: "Cloud Architect",
  PLATFORM: "Platform Architect",
  GENAI: "GenAI Architect",
  MLOPS: "MLOps Architect",
};

interface RoleMetaFile {
  rateDisclaimer: string;
  roles: Array<{
    roleId: string;
    label: string;
    shortDescription: string;
    tier: string;
    indicativeRateMinUsd: number;
    indicativeRateMaxUsd: number;
  }>;
}

async function main() {
  console.log("Importing knowledge base...");
  const { domains, articles, source } = importKnowledgeBase();
  console.log(`  source: ${source}`);
  console.log(`  domains: ${domains.length}`);
  console.log(`  articles: ${articles.length}`);

  // --- (a) Domains ---------------------------------------------------------
  console.log("Upserting domains...");
  for (const d of domains) {
    await prisma.domain.upsert({
      where: { id: d.id },
      create: { id: d.id, slug: d.slug, title: d.title, wave: d.wave },
      update: { slug: d.slug, title: d.title, wave: d.wave },
    });
  }

  // --- (b) Articles + InterviewQuestions + ChecklistItems -----------------
  console.log("Upserting articles...");
  let totalQuestions = 0;
  let totalChecklistItems = 0;
  let count = 0;
  for (const a of articles) {
    await prisma.article.upsert({
      where: { id: a.id },
      create: {
        id: a.id,
        title: a.title,
        h1: a.h1,
        ziel: a.ziel,
        domainId: a.domainId,
        domainSlug: a.domainSlug,
        domainTitle: a.domainTitle,
        sequence: a.sequence,
        documentType: a.documentType,
        primaryRoles: a.primaryRoles,
        requires: a.requires,
        related: a.related,
        competencies: a.competencies as object,
        body: a.body,
        path: a.path,
      },
      update: {
        title: a.title,
        h1: a.h1,
        ziel: a.ziel,
        domainId: a.domainId,
        domainSlug: a.domainSlug,
        domainTitle: a.domainTitle,
        sequence: a.sequence,
        documentType: a.documentType,
        primaryRoles: a.primaryRoles,
        requires: a.requires,
        related: a.related,
        competencies: a.competencies as object,
        body: a.body,
        path: a.path,
      },
    });

    for (const q of a.interviewQuestions) {
      await prisma.interviewQuestion.upsert({
        where: { articleId_position: { articleId: a.id, position: q.position } },
        create: {
          articleId: a.id,
          position: q.position,
          question: q.question,
          referenceAnswer: q.referenceAnswer,
        },
        update: {
          question: q.question,
          referenceAnswer: q.referenceAnswer,
        },
      });
      totalQuestions++;
    }

    for (let i = 0; i < a.checklist.length; i++) {
      const position = i + 1;
      await prisma.checklistItem.upsert({
        where: { articleId_position: { articleId: a.id, position } },
        create: { articleId: a.id, position, text: a.checklist[i] },
        update: { text: a.checklist[i] },
      });
      totalChecklistItems++;
    }

    count++;
    if (count % 100 === 0) console.log(`  ...${count}/${articles.length} articles`);
  }
  console.log(`Articles: ${count}, interview questions: ${totalQuestions}, checklist items: ${totalChecklistItems}`);

  // --- (c) Roles -------------------------------------------------------------
  console.log("Upserting roles...");
  for (const [id, label] of Object.entries(ROLE_LABELS)) {
    await prisma.role.upsert({
      where: { id },
      create: { id, label },
      update: { label },
    });
  }

  // --- (d) RoleMeta from data/role-meta.json --------------------------------
  console.log("Upserting role meta...");
  const roleMetaPath = path.resolve(__dirname, "..", "data", "role-meta.json");
  const roleMetaFile: RoleMetaFile = JSON.parse(fs.readFileSync(roleMetaPath, "utf8"));
  for (const r of roleMetaFile.roles) {
    await prisma.roleMeta.upsert({
      where: { roleId: r.roleId },
      create: {
        roleId: r.roleId,
        shortDescription: r.shortDescription,
        tier: r.tier,
        indicativeRateMinUsd: r.indicativeRateMinUsd,
        indicativeRateMaxUsd: r.indicativeRateMaxUsd,
        rateDisclaimer: roleMetaFile.rateDisclaimer,
      },
      update: {
        shortDescription: r.shortDescription,
        tier: r.tier,
        indicativeRateMinUsd: r.indicativeRateMinUsd,
        indicativeRateMaxUsd: r.indicativeRateMaxUsd,
        rateDisclaimer: roleMetaFile.rateDisclaimer,
      },
    });
  }

  // --- (e) Default user (v1 has no login) + FeatureFlags ---------------------
  console.log("Upserting default user + feature flags...");
  const defaultUser = await prisma.user.upsert({
    where: { username: "default" },
    create: { username: "default", passwordHash: null, isDefault: true },
    update: {},
  });

  await prisma.featureFlags.upsert({
    where: { userId: defaultUser.id },
    create: {
      userId: defaultUser.id,
      newsEnabledGlobal: false,
      newsEnabledRoles: [],
      pwaEnabled: true,
    },
    update: {},
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
