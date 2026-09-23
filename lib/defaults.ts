// Zero-config defaults so a fresh clone runs with `docker compose up -d` and
// no .env file. Every value can be overridden via the matching env variable.

/** Matches the credentials/port of the bundled docker-compose.yml Postgres service. */
export const DEFAULT_DATABASE_URL =
  "postgresql://keystone:keystone@localhost:5432/keystone?schema=public";

export function databaseUrl(): string {
  return process.env.DATABASE_URL || DEFAULT_DATABASE_URL;
}
