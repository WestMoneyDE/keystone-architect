import path from "node:path";
import type { PrismaConfig } from "prisma";
import "dotenv/config";
import { DEFAULT_DATABASE_URL } from "./lib/defaults";

// No .env needed for the default docker-compose Postgres.
process.env.DATABASE_URL ||= DEFAULT_DATABASE_URL;

export default {
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
} satisfies PrismaConfig;
