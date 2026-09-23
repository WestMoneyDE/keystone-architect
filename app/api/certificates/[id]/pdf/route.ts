// Streams a generated certificate PDF from storage/certificates/ — never
// exposes the raw filesystem path publicly (storage/ is outside /public).
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
    // certificate.pdfPath is always "storage/certificates/<attemptId>.pdf"
    // (written by lib/certificate/generate.ts) — re-derive the filename
    // rather than joining the stored path directly, so the build tracer
    // sees a statically-scoped subfolder instead of an arbitrary DB string.
    const filename = path.basename(certificate.pdfPath);
    const buffer = await readFile(path.join(process.cwd(), "storage", "certificates", filename));
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="keystone-certificate-${certificate.roleId}-${id}.pdf"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "file-missing" }, { status: 404 });
  }
}
