import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

async function getDefaultUser() {
  const user = await db.user.findFirst({ where: { isDefault: true } });
  if (!user) throw new Error("No default user found — run `npm run db:seed` first.");
  return user;
}

// GET: current feature flags for the default user (creates the default row
// on first read rather than requiring one to already exist — FeatureFlags
// is optional on User).
export async function GET() {
  const user = await getDefaultUser();
  const flags = await db.featureFlags.findUnique({ where: { userId: user.id } });
  return NextResponse.json({
    pwaEnabled: flags?.pwaEnabled ?? true,
    newsEnabledGlobal: flags?.newsEnabledGlobal ?? false,
    newsEnabledRoles: flags?.newsEnabledRoles ?? [],
  });
}

const patchSchema = z.object({
  pwaEnabled: z.boolean().optional(),
});

// PATCH: partial update — currently only used by Settings' PWA toggle.
// News flags are still set as a pair via app/api/onboarding/route.ts
// (global vs per-role is a single mode there); this route only owns
// pwaEnabled to avoid two routes racing on the same row's other fields.
export async function PATCH(request: Request) {
  const user = await getDefaultUser();
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  if (parsed.data.pwaEnabled === undefined) {
    return NextResponse.json({ ok: true });
  }

  await db.featureFlags.upsert({
    where: { userId: user.id },
    create: { userId: user.id, pwaEnabled: parsed.data.pwaEnabled },
    update: { pwaEnabled: parsed.data.pwaEnabled },
  });

  return NextResponse.json({ ok: true });
}
