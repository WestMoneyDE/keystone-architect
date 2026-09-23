# Setup reference

This is the detailed reference behind the README's quick-start. It covers the full `.env` variable list, Postgres, seeding the knowledge base, configuring each of the four LLM providers, the news feature's background-fetch implications, and building the Tauri desktop app yourself.

## Prerequisites

- [Docker](https://www.docker.com/) — runs the bundled Postgres 16 service.
- [Node.js](https://nodejs.org/) 20+ and npm.
- For the desktop build only: a Rust toolchain (installed automatically by `@tauri-apps/cli` on first `tauri:build`/`tauri:dev`, or manually via [rustup](https://rustup.rs/)) plus your platform's Tauri prerequisites ([v2.tauri.app/start/prerequisites](https://v2.tauri.app/start/prerequisites/) — on Windows this means the WebView2 runtime and the MSVC build tools).

## 1. Postgres

`docker-compose.yml` at the repo root defines a single `postgres` service:

```bash
docker compose up -d
```

This starts Postgres 16 on `localhost:5432` with user/password/database all set to `keystone` (container name `keystone-postgres`, data persisted in the `keystone-postgres-data` volume). These defaults match Keystone's built-in `DATABASE_URL` default out of the box — you only need to change them if you point Keystone at a Postgres instance you run yourself.

Note: `docker-compose.yml` currently only runs Postgres. The Next.js app itself is not containerized — you run it directly with `npm run dev` / `npm run build && npm run start` (or via the Tauri desktop shell, which also just runs the Next.js process on the host). A commented-out `app` service in the compose file sketches what a fully containerized setup would look like, for a future iteration.

## 2. Environment variables (`.env`) — all optional

A fresh clone needs **no** `.env` file: every variable has a default that matches the bundled `docker-compose.yml` and the bundled `content/` folder. Copy `.env.example` to `.env` only if you want to override something.

| Variable | Default | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | `postgresql://keystone:keystone@localhost:5432/keystone?schema=public` | Postgres connection string (see `lib/defaults.ts`). Matches the bundled `docker-compose.yml` credentials. |
| `PORT` | `3000` (Next.js default) | Server port. Read by both the Settings "Fernzugriff" QR panel (`app/settings/page.tsx`) and the Tauri desktop shell's readiness check (`src-tauri/src/startup.rs`) — keep them in sync if you change it. |
| `KNOWLEDGE_BASE_PATH` | `content/knowledge-base` | Folder of the 720 Markdown knowledge-base articles (JSON frontmatter + body), read by `scripts/import-knowledge-base.ts`. Relative paths resolve from the repo root. |
| `KNOWLEDGE_BASE_MANIFEST_PATH` | `content/manifest.json` | Domain manifest (ids, slugs, titles, waves) used to enrich imported articles. |
| `ENCRYPTION_KEY` | auto-generated into `storage/encryption.key` | AES-256-GCM key (64-char hex = 32 bytes) used by `lib/crypto.ts` to encrypt stored OpenAI/Anthropic API keys. If unset, a random key is generated on first use and kept in the git-ignored `storage/encryption.key`; back it up together with your database. To use your own: `openssl rand -hex 32`. The CLI-passthrough providers (Claude Code CLI, Codex CLI) store no key. |
| `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` | unset | Optional: lets the setup wizard auto-detect and pre-configure an API-key provider. |
| `NEWS_CRON_SCHEDULE` | `0 */12 * * *` | Optional override for the background news fetch interval (see §5). |

`.env` is git-ignored — never commit real secrets.

## 3. Installing dependencies and seeding

```bash
npm install
npm run setup
```

`npm run setup` runs `prisma db push && npm run db:seed` (see `package.json`) — it pushes the full schema from `prisma/schema.prisma` to your Postgres database (no migration history, fine for a self-hosted single-instance app) and then runs `prisma/seed.ts`, which imports the 720 bundled articles from `content/knowledge-base/` (via `scripts/import-knowledge-base.ts`) and loads `data/role-meta.json` into the `RoleMeta` table. The seed is idempotent — safe to re-run with `npm run db:seed` alone if you just want to refresh content without touching the schema.

Individual pieces, if you need them separately:

| Script | What it does |
| --- | --- |
| `npm run db:push` | Sync `prisma/schema.prisma` to the database only, no seeding. |
| `npm run db:generate` | Regenerate the Prisma client (normally automatic via `db:push`/install). |
| `npm run db:seed` | Run `prisma/seed.ts` alone — re-import articles + role metadata. |
| `npm run dev` | Start the Next.js dev server. |
| `npm run build` / `npm run start` | Production build and server. |

## 4. Configuring each LLM provider in detail

All four providers implement the same `LLMProvider` interface (`lib/llm/types.ts`) and are configured through the onboarding wizard (`app/setup/page.tsx` → `components/setup/ProviderWizard.tsx`) or later via Settings, which write to `ProviderConfig` rows through `app/api/provider-config/route.ts`. `app/api/provider-config/check/route.ts` backs the wizard's "Verfügbarkeit prüfen" button and runs the exact same `checkAvailability()` call the app uses at request time, so you can verify a provider actually works before finishing setup.

### OpenAI API key
1. Get a key from your OpenAI account.
2. The key is encrypted with `ENCRYPTION_KEY` (or the auto-generated `storage/encryption.key`, see §2) before being stored in `ProviderConfig.apiKeyEnc`.
3. Paste the key into the wizard/Settings, click "Verfügbarkeit prüfen." A rejected key surfaces as `invalid-key`.

### Anthropic API key
Same flow as OpenAI, against Anthropic's API. Billed per call by Anthropic, independent of a Claude.ai subscription.

### Claude Code CLI (passthrough)
1. Install the Claude Code CLI on the same machine running Keystone.
2. In a real terminal (not through Keystone), run `claude login` and complete authentication.
3. Select "Claude Code CLI" in the wizard and check availability. Behind the scenes this calls `claude -p --output-format json` against the already-authenticated local CLI — Keystone never touches your OAuth credentials directly; auth-failure detection matches on stdout/result text rather than exit code, since the CLI's exit code alone isn't a reliable signal. If you see `not-authenticated`, re-run `claude login`. If you see `not-installed`, the `claude` binary wasn't found on `PATH` (`ProviderConfig.cliPath` can override the binary location if it's installed somewhere nonstandard).

### Codex CLI (passthrough, experimental)
1. Install the Codex CLI.
2. In a real terminal, run `codex login`.
3. Select "Codex CLI (experimental)" in the wizard. This option is never preselected and is labeled experimental because, unlike Anthropic's documented carve-out for Claude Code, OpenAI's terms don't as clearly cover this automated-CLI-invocation usage pattern — use at your own risk. Under the hood it runs `codex exec` with the prompt piped via stdin, with a hard timeout and kill-on-stall so a hung CLI process can't block a request indefinitely.

You can switch your active provider at any time; only one `ProviderConfig` per provider type is kept per user, with `isActive` marking the one currently in use.

## 5. Enabling the news feature

The "Document News" panel (per-article, Notion-style expandable footer) is **off by default** because it requires a periodic background job that makes outbound network calls — it's gated by `FeatureFlags.newsEnabledGlobal` / `FeatureFlags.newsEnabledRoles`, set during onboarding's news-toggle step or later in Settings.

- **Global**: every domain is eligible for fetching.
- **Per role**: only domains tagged with your enabled roles are fetched.
- **Off** (default): `lib/news/scheduler.ts`'s cron task still runs on its interval, but `lib/news/fetchCycle.ts` checks `FeatureFlags` first and skips the entire cycle (0 domains fetched, logged as such) when nothing is enabled — no network calls happen.

Fetch source is pluggable (`NewsProvider` interface, mirroring `LLMProvider`): the default is curated RSS feeds per domain (no API key required), with an optional alternative that uses your configured `LLMProvider`'s native web-search capability where available.

Scheduling runs inside the same long-running Node process via `node-cron` (`lib/news/scheduler.ts`), default interval every 12 hours. Override the schedule with the `NEWS_CRON_SCHEDULE` environment variable (standard cron syntax, e.g. `*/1 * * * *` for once-a-minute testing).

To manually trigger one fetch cycle for testing without waiting for the cron interval:

```bash
npx tsx scripts/trigger-news-fetch.ts
```

This runs the exact same `runNewsFetchCycle()` code path the scheduler calls, respecting the same `FeatureFlags` gating — it will report 0 fetched if news is disabled.

## 6. Building the Tauri desktop app yourself

```bash
npm run tauri:build
```

This is the real `tauri build` command (`package.json`'s `tauri:build` script), configured via `src-tauri/tauri.conf.json`. On Windows it currently produces:

- `src-tauri/target/release/bundle/nsis/Keystone_0.1.0_x64-setup.exe`
- `src-tauri/target/release/bundle/msi/Keystone_0.1.0_x64_en-US.msi`

macOS (`dmg`/`app`) and Linux (`deb`/`appimage`) targets are configured in the same `tauri.conf.json` bundle list but need to be built from those platforms respectively — Tauri doesn't cross-compile installers.

For iterating on the desktop shell itself without a full release build:

```bash
npm run tauri:dev
```

**Known limitation:** the release build does not bundle the Next.js server as a Tauri sidecar binary. The installer gives you a native window + system tray icon (open/quit/status) that, on launch, runs `docker compose up -d`, waits for a Postgres health check, and then opens a native window against `localhost:<PORT>` — but Node.js/npm and Docker still need to be present on the machine running the installed app, the same as the web-only path. This is a deliberate scope boundary for v1, not an oversight — bundling the server as a sidecar so the installer is truly standalone is a reasonable next step for a future release.

## Also see

- [`../README.md`](../README.md) — quick-start, feature overview, and license summary.
- [`../CONTRIBUTING.md`](../CONTRIBUTING.md) — how to contribute (including content fixes and `npm run check:content`).
- [`REMOTE-ACCESS.md`](REMOTE-ACCESS.md) — Tailscale / Cloudflare Tunnel setup for reaching Keystone from outside your local network.
