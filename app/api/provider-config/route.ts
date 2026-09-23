import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { encrypt } from "@/lib/crypto";

const PROVIDER_IDS = ["openai", "anthropic", "claude-cli", "codex-cli"] as const;

const saveSchema = z.object({
  provider: z.enum(PROVIDER_IDS),
  apiKey: z.string().min(1).optional(), // plaintext, encrypted server-side below
  model: z.string().optional(),
  cliPath: z.string().optional(),
  isActive: z.boolean().default(true),
});

async function getDefaultUser() {
  const user = await db.user.findFirst({ where: { isDefault: true } });
  if (!user) {
    throw new Error("No default user found — run `npm run db:seed` first.");
  }
  return user;
}

// GET: current provider configs for the default user (never returns the
// encrypted key or decrypted plaintext — just enough to render the wizard's
// current state).
export async function GET() {
  const user = await getDefaultUser();
  const configs = await db.providerConfig.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      provider: true,
      model: true,
      cliPath: true,
      isActive: true,
      updatedAt: true,
      apiKeyEnc: true, // only used below to derive a boolean, never returned raw
    },
  });

  return NextResponse.json({
    configs: configs.map((c) => ({
      id: c.id,
      provider: c.provider,
      model: c.model,
      cliPath: c.cliPath,
      isActive: c.isActive,
      updatedAt: c.updatedAt,
      hasApiKey: Boolean(c.apiKeyEnc),
    })),
  });
}

// POST: save (upsert) a provider config. The client sends the plaintext API
// key over localhost HTTP — fine for a self-hosted single-machine app — and
// THIS route handler encrypts it before persisting. Never trust the client
// to encrypt. Setting isActive:true deactivates any other provider config
// for this user, since only one provider is active at a time.
export async function POST(request: Request) {
  const user = await getDefaultUser();
  const body = await request.json();
  const parsed = saveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { provider, apiKey, model, cliPath, isActive } = parsed.data;

  const apiKeyEnc = apiKey ? encrypt(apiKey) : undefined;

  const result = await db.$transaction(async (tx) => {
    if (isActive) {
      await tx.providerConfig.updateMany({
        where: { userId: user.id, provider: { not: provider } },
        data: { isActive: false },
      });
    }

    return tx.providerConfig.upsert({
      where: { userId_provider: { userId: user.id, provider } },
      create: {
        userId: user.id,
        provider,
        apiKeyEnc,
        model,
        cliPath,
        isActive,
      },
      update: {
        ...(apiKeyEnc !== undefined ? { apiKeyEnc } : {}),
        ...(model !== undefined ? { model } : {}),
        ...(cliPath !== undefined ? { cliPath } : {}),
        isActive,
      },
      select: { id: true, provider: true, model: true, cliPath: true, isActive: true, updatedAt: true },
    });
  });

  return NextResponse.json({ config: result });
}
