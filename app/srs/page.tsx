// app/srs/page.tsx — SRS review queue entry point (ticket 10). Supports
// optional ?roleId=/?domainId= scoping, forwarded straight through SrsFlow
// (mode selection: "Gelerntes" vs. "Zufällig") -> ReviewQueue -> /api/srs/due.
import { SrsFlow } from "@/components/srs/SrsFlow";

export const dynamic = "force-dynamic";

export default async function SrsPage({
  searchParams,
}: {
  searchParams: Promise<{ roleId?: string; domainId?: string }>;
}) {
  const { roleId, domainId } = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Karteikarten</h1>
        <p className="text-sm text-muted-foreground">
          Spaced-Repetition-Wiederholung (SM-2) der Interviewfragen aus der Wissensbasis.
        </p>
      </div>
      <SrsFlow roleId={roleId} domainId={domainId} />
    </div>
  );
}
