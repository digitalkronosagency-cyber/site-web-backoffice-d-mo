import { PrismaClient } from '@prisma/client';

// Resolve the pooled connection string regardless of which env var name the
// storage integration used (Vercel's native Postgres/Neon integration has
// used different names over time). Runs once per cold start, before the
// client reads DATABASE_URL.
if (!process.env.DATABASE_URL) {
  const fallback =
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED;

  if (fallback) {
    process.env.DATABASE_URL = fallback;
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
