import { PrismaClient } from "@prisma/client";

const HOSTINGER_DB_URL =
  "mysql://u624428023_admin:Hermanos_2001@srv755.hstgr.io:3306/u624428023_anida";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = HOSTINGER_DB_URL;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || HOSTINGER_DB_URL,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
