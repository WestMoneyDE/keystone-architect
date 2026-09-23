import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const onboardingSchema = z.object({
  displayName: z.string().trim().min(1).max(80).optional(),
  roleIds: z.array(z.string()).default([]),
  newsMode: z.enum(["off", "global", "roles"]).default("off"),
  newsRoleIds: z.array(z.string()).default([]),
});

// POST: persists the role-selection + news-preference steps of the
// onboarding wizard for the default (implicit, single) user. Provider
// selection is saved separately via app/api/provider-config/route.ts as the
// wizard progresses through Step A.
export async function POST(request: Request) {
  const user = await db.user.findFirst({ where: { isDefault: true } });
  if (!user) {
    return NextResponse.json(
      { error: "No default user found — run `npm run db:seed` first." },
      { status: 500 }
    );
  }

  const body = await request.json();
  const parsed = onboardingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { displayName, roleIds, newsMode, newsRoleIds } = parsed.data;

  const newsEnabledGlobal = newsMode === "global";
  const newsEnabledRoles = newsMode === "roles" ? newsRoleIds : [];

  await db.$transaction(async (tx) => {
    if (displayName !== undefined) {
      await tx.user.update({ where: { id: user.id }, data: { displayName } });
    }

    // Replace the user's role selection wholesale — simplest correct
    // semantics for a wizard that can be re-run.
    await tx.userRoleSelection.deleteMany({ where: { userId: user.id } });
    if (roleIds.length > 0) {
      await tx.userRoleSelection.createMany({
        data: roleIds.map((roleId) => ({ userId: user.id, roleId })),
        skipDuplicates: true,
      });
    }

    await tx.featureFlags.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        newsEnabledGlobal,
        newsEnabledRoles,
      },
      update: {
        newsEnabledGlobal,
        newsEnabledRoles,
      },
    });
  });

  return NextResponse.json({ ok: true });
}
