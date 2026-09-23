// Streams the generated 1200x630 social-card PNG — same not-under-/public
// serving pattern as the PDF route.
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { db } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const certificate = await db.certificate.findUnique({ where: { id } });
  if (!certificate) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }

  try {
    // Same static-path re-derivation as the PDF route — see its comment.
    const filename = path.basename(certificate.socialCardPath);
    const buffer = await readFile(path.join(process.cwd(), "storage", "certificates", filename));
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `inline; filename="keystone-certificate-${certificate.roleId}-${id}.png"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "file-missing" }, { status: 404 });
  }
}
