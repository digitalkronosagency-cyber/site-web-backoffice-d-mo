import { PrismaClient } from '@prisma/client';
import { runSeed } from './seed-data';

// Runs automatically on every Vercel build (see scripts/vercel-build.js).
// Only seeds demo data on the very first deploy — once real data exists,
// this is a no-op, so it's safe to run on every redeploy.
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.company.count();

  if (existing > 0) {
    console.log('[seed] Données déjà présentes, aucune action.');
    return;
  }

  console.log("[seed] Base vide détectée, chargement des données de démonstration...");
  await runSeed(prisma);
}

main()
  .catch((e) => {
    // Non-fatal: a seeding hiccup should not block the deploy.
    console.error('[seed] Échec du seed automatique (non bloquant) :', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
