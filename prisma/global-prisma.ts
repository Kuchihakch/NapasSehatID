/**
 * Global Prisma Client for NapasSehat Palembang.
 *
 * Uses the standard PrismaClient (v7) initialised with the PrismaPg driver
 * adapter backed by a pg.Pool for efficient connection pooling.
 *
 * The `globalThis` singleton pattern prevents duplicate client instances
 * during Next.js Hot Module Replacement (HMR) in development, and ensures
 * a single pool is re-used across serverless invocations in production.
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// ── Connection pool factory ────────────────────────────────────────────────────
function createPool(): Pool {
  const connectionString = process.env['DATABASE_URL'];
  if (!connectionString) {
    throw new Error(
      '[NapasSehat] DATABASE_URL is not set. Copy .env.example → .env and fill in the values.',
    );
  }
  return new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });
}

// ── Client factory ─────────────────────────────────────────────────────────────
function createPrismaClient(): PrismaClient {
  const pool = createPool();
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
}

// ── Singleton management ───────────────────────────────────────────────────────
declare global {
  // eslint-disable-next-line no-var
  var __napassehat_prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  process.env['NODE_ENV'] === 'production'
    ? createPrismaClient()
    : (globalThis.__napassehat_prisma ??= createPrismaClient());
