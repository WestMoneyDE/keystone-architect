import { PrismaClient } from "@prisma/client";
import { databaseUrl } from "./defaults";

// Standard Next.js singleton pattern: in dev, Next's hot-reload re-executes
// this module on every edit, which would otherwise spawn a new PrismaClient
// (and a new connection pool) each time. Stashing the instance on
// globalThis survives the reload; in production each server process just
// gets one instance naturally.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl: databaseUrl() });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
