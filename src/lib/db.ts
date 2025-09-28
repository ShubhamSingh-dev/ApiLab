import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const db =
  globalThis.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn", "info"],
  });

if (process.env.NODE_ENV === "development") globalThis.prisma = db;

export default db;
