# Security policy

## Supported versions

Keystone is a self-hosted application. Security fixes are made on the `main`
branch; please update to the latest `main` before reporting.

## Reporting a vulnerability

Please **do not** open a public issue for security problems.

Report it privately through GitHub's security advisory form:
<https://github.com/WestMoneyDE/keystone-architect/security/advisories/new>
(repository → **Security** tab → **Report a vulnerability**).

If private reporting is unavailable for some reason, open a public issue titled
**"Security contact request"** *without any details*, and the maintainer will
arrange a private channel with you there.

Please include:

- a description of the issue and its impact,
- steps to reproduce or a proof of concept,
- affected version/commit and your environment.

You can expect an acknowledgement within a few days. Please give the maintainer
reasonable time to fix the issue before disclosing it publicly.

## Deployment notes

Keystone is designed as a **single-user, local** application without built-in
authentication. Do not expose it directly to the internet — use a private
network such as Tailscale (see [`docs/REMOTE-ACCESS.md`](docs/REMOTE-ACCESS.md)).
Keep your `.env`, `storage/encryption.key` and database backups private.
