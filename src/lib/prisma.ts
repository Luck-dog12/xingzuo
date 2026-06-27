import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export function hasDatabaseUrl() {
  if (process.env.DISABLE_DATABASE === "1") {
    return false;
  }
  return Boolean(process.env.DATABASE_URL);
}

export function getPrisma() {
  if (!hasDatabaseUrl()) {
    return null;
  }

  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    globalForPrisma.prisma = new PrismaClient({
      adapter,
    });
  }

  return globalForPrisma.prisma;
}

export function getRequiredPrisma() {
  const prisma = getPrisma();
  if (!prisma) {
    throw new Error("DATABASE_URL is required for this operation.");
  }
  return prisma;
}
