import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/shell/AppShell";
import { RegisterServiceWorker } from "@/components/pwa/RegisterServiceWorker";
import { db } from "@/lib/db";
import { autoDetectAndActivateProvider } from "@/lib/llm/autodetect";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Keystone",
  description: "Self-hosted Enterprise Architecture knowledge platform",
  icons: {
    icon: "/icons/favicon-64.png",
    apple: "/icons/icon-192.png",
  },
};

// Runs before hydration to avoid a flash of the wrong theme: reads the
// persisted preference (defaulting to "light" — never prefers-color-scheme)
// and sets data-theme on <html> immediately, matching the logic in
// components/shell/AppShell.tsx.
const themeInitScript = `
(function () {
  try {
    var stored = window.localStorage.getItem("keystone:theme");
    document.documentElement.dataset.theme = stored === "dark" ? "dark" : "light";
  } catch (e) {
    document.documentElement.dataset.theme = "light";
  }
})();
`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Fetched here (server component) and passed down as props, rather than
  // having the client-component AppShell fetch them itself — keeps the
  // sidebar nav data server-rendered and avoids an extra client round-trip
  // on every page load.
  const [domains, roles, defaultUser] = await Promise.all([
    db.domain.findMany({ orderBy: { id: "asc" }, select: { id: true, slug: true, title: true } }),
    db.role.findMany({ orderBy: { id: "asc" }, select: { id: true, label: true } }),
    db.user.findFirst({ where: { isDefault: true }, select: { id: true, displayName: true } }),
  ]);

  const featureFlags = defaultUser
    ? await db.featureFlags.findUnique({ where: { userId: defaultUser.id }, select: { pwaEnabled: true } })
    : null;
  // Schema default is true; an existing row can still explicitly opt out.
  const pwaEnabled = featureFlags?.pwaEnabled ?? true;

  // Cheap live due-count for the sidebar's SRS badge — a single indexed
  // count query (dueAt is not separately indexed, but SrsState is scoped
  // to one user and starts small; revisit with an index if this becomes a
  // hot path at scale). Only fetched when a default user exists.
  const srsDueCount = defaultUser
    ? await db.srsState.count({
        where: { user: { isDefault: true }, dueAt: { lte: new Date() } },
      })
    : 0;

  // Auto-detect an already-usable LLM backend (claude-cli, then
  // ANTHROPIC_API_KEY/OPENAI_API_KEY) the very first time no ProviderConfig
  // is active yet — see lib/llm/autodetect.ts for the full priority order
  // and rationale. Cheap: the function's own first step is a single indexed
  // query for an existing active config, so once a provider is active
  // (auto- or manually-configured) this is a no-op on every later load.
  // `autoDetectResult` is only non-null on the exact request where a
  // provider was just newly activated, which naturally makes the
  // confirmation toast below one-time rather than something we need extra
  // bookkeeping for.
  const autoDetectResult = defaultUser ? await autoDetectAndActivateProvider(defaultUser.id) : null;

  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="h-full flex flex-col overflow-hidden">
        <RegisterServiceWorker pwaEnabled={pwaEnabled} />
        <AppShell
          domains={domains}
          roles={roles}
          displayName={defaultUser?.displayName ?? null}
          srsDueCount={srsDueCount}
          autoDetectedProviderLabel={autoDetectResult?.label ?? null}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
