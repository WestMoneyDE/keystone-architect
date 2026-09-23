import { Blobatar } from "@blobatar/react";

// Fixed fallback seed so an empty/undefined display name still renders a
// deterministic, non-broken avatar instead of an empty or malformed blob —
// e.g. before onboarding has run, or if it's re-run and the field is
// cleared. Intentionally NOT "" (blobatar's hashing would still produce
// *something* for an empty string, but pinning a real seed keeps the
// fallback avatar stable and recognizable rather than an implementation
// detail of the hash).
const FALLBACK_SEED = "keystone-user";

export interface AvatarProps {
  name: string;
  size?: number;
  className?: string;
}

/**
 * Thin wrapper around `@blobatar/react`'s `<Blobatar>` for consistent
 * sizing/usage across the app — onboarding's live preview, AppShell's
 * sidebar profile corner, Settings (ticket 12), the sidebar's conversation
 * entries (ticket 8), and the certificate PDF (ticket 9) all render through
 * this component rather than importing Blobatar directly.
 */
export function Avatar({ name, size = 40, className }: AvatarProps) {
  const seed = name.trim().length > 0 ? name : FALLBACK_SEED;
  return <Blobatar name={seed} size={size} className={className} />;
}
