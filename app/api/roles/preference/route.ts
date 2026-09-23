import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const preferenceSchema = z.object({
  roleId: z.string().min(1),
  preferred: z.boolean(),
});

// POST: lightweight single-role toggle for the inline checkbox on
// app/roles/page.tsx — a faster path to the same UserRoleSelection table
// that the full onboarding wizard (app/api/onboarding/route.ts) and
// Settings page write wholesale. Idempotent: toggling an already-set
// state is a no-op success, not an error, so double-clicks / optimistic
// UI races never surface as errors.
export async function POST(request: Request) {
  const user = await db.user.findFirst({ where: { isDefault: true } });
  if (!user) {
    return NextResponse.json(
      { error: "No default user found — run `npm run db:seed` first." },
      { status: 500 }
    );
  }

  const body = await request.json();
  const parsed = preferenceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { roleId, preferred } = parsed.data;

  if (preferred) {
    await db.userRoleSelection.upsert({
      where: { userId_roleId: { userId: user.id, roleId } },
      create: { userId: user.id, roleId },
      update: {},
    });
  } else {
    await db.userRoleSelection.deleteMany({ where: { userId: user.id, roleId } });
  }

  return NextResponse.json({ ok: true });
}
