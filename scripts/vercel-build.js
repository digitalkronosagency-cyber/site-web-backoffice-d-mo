#!/usr/bin/env node
/**
 * Build orchestration for Vercel: resolves the Postgres connection string
 * regardless of which env var name the storage integration used (Vercel's
 * native Postgres/Neon integration has used different names over time —
 * DATABASE_URL, POSTGRES_PRISMA_URL, POSTGRES_URL...), applies pending
 * Prisma migrations, seeds demo data on first deploy only, then builds.
 *
 * If no database is configured yet, migrations/seed are skipped (with a
 * warning) so `next build` still succeeds — the app will show a clear
 * Prisma error at runtime instead of failing the deploy outright.
 */
const { execSync } = require('child_process');

function resolveDatabaseEnv() {
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED;

  const directUrl =
    process.env.DIRECT_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL_UNPOOLED ||
    url;

  return {
    ...process.env,
    ...(url ? { DATABASE_URL: url } : {}),
    ...(directUrl ? { DIRECT_URL: directUrl } : {}),
  };
}

function run(command, env) {
  console.log(`[build] ${command}`);
  execSync(command, { stdio: 'inherit', env });
}

const env = resolveDatabaseEnv();

if (!env.DATABASE_URL) {
  console.warn(
    '[build] Aucune variable de connexion PostgreSQL détectée ' +
      '(DATABASE_URL, POSTGRES_PRISMA_URL, POSTGRES_URL...).\n' +
      '[build] Créez une base de données dans Vercel -> Storage, puis redéployez. ' +
      'Le build continue sans migrations.'
  );
} else {
  run('npx prisma migrate deploy', env);
  run('npx tsx prisma/seed-if-empty.ts', env);
}

run('npx next build', env);
