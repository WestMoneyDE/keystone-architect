# Contributing to Keystone

Thanks for your interest! Bug reports, fixes, content corrections and focused
features are welcome.

## Ground rules

- **License:** by submitting a contribution you agree that it is licensed under
  the project's [PolyForm Noncommercial License 1.0.0](LICENSE), and you grant
  the maintainer the right to also include it in separately licensed commercial
  editions (see [`COMMERCIAL-LICENSE.md`](COMMERCIAL-LICENSE.md)). Only submit
  work you have the right to contribute.
- **No personal data or secrets** in code, content, fixtures or screenshots —
  no real names, e-mail addresses, local paths, API keys or `.env` files.
- Keep pull requests small and focused; open an issue first for larger changes.

## Development setup

```bash
docker compose up -d
npm install
npm run setup
npm run dev
```

See [`docs/SETUP.md`](docs/SETUP.md) for details.

## Before you open a pull request

```bash
npm run lint    # ESLint + content/PII denylist check (npm run check:content)
npm run build   # type-check and production build
```

## Content changes

Articles live in `content/knowledge-base/<domain>/<nn>-<slug>.md` with a
single-line JSON frontmatter block between `---` lines. Please:

- keep the `id`, `domain`, `sequence`, `requires` and `related` fields valid —
  other articles link to these IDs;
- keep the `## Interviewfragen` and `## Production Checklist` headings exactly
  as they are (the importer parses them);
- cite sources with an access date, and prefer primary documentation;
- run `npm run db:seed` to re-import and check the article in the reader.

## Reporting bugs

Open a GitHub issue with steps to reproduce, the expected and actual behaviour,
and your OS / Node / Docker versions. For security issues, follow
[`SECURITY.md`](SECURITY.md) instead.
