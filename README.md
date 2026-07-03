# Électricité Dumont — Site vitrine + Backoffice

Démo commerciale d'un site web complet pour artisan électricien : vitrine publique, formulaire de devis, authentification admin par email (magic link), backoffice de gestion des devis/factures, et personnalisation du contenu du site — le tout pensé pour être **dupliqué facilement pour d'autres artisans** sans modification de code.

## Stack technique

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS**
- **PostgreSQL** (Neon ou Vercel Postgres) via **Prisma**
- **Vercel Blob** pour le stockage des photos et des PDF générés
- **Resend** pour l'envoi d'emails transactionnels
- **@react-pdf/renderer** pour la génération de devis/factures PDF (compatible serverless)
- **Vercel Cron Jobs** pour les relances automatiques de devis

Aucun stockage fichier local, aucune base SQLite : tout est compatible avec un déploiement Vercel serverless.

## Prérequis

- Node.js 18+
- Un compte [Vercel](https://vercel.com)
- Un compte [Neon](https://neon.tech) (ou Vercel Postgres)
- Un compte [Resend](https://resend.com)

## 1. Créer la base de données

### Option A — Neon (recommandé)

1. Créez un projet sur [neon.tech](https://neon.tech).
2. Dans l'onglet "Connection Details", récupérez :
   - la **chaîne de connexion poolée** (avec `-pooler` dans le hostname) → `DATABASE_URL`
   - la **chaîne de connexion directe** (sans pooler) → `DIRECT_URL`

### Option B — Vercel Postgres

1. Dans votre projet Vercel → **Storage** → **Create Database** → **Postgres**.
2. Vercel génère automatiquement les variables `POSTGRES_PRISMA_URL` et `POSTGRES_URL_NON_POOLING` : reportez-les respectivement dans `DATABASE_URL` et `DIRECT_URL`.

## 2. Créer un compte Resend

1. Créez un compte sur [resend.com](https://resend.com).
2. Vérifiez un domaine d'envoi (ou utilisez le domaine de test `onboarding@resend.dev` pour la démo).
3. Générez une clé API → `RESEND_API_KEY`.
4. Définissez `RESEND_FROM_EMAIL` (ex : `Électricité Dumont <contact@votredomaine.fr>`).

## 3. Créer un store Vercel Blob

1. Dans votre projet Vercel → **Storage** → **Create Database** → **Blob**.
2. Copiez le token généré → `BLOB_READ_WRITE_TOKEN`.

## 4. Configuration locale

```bash
cp .env.example .env
# Renseignez toutes les valeurs dans .env
npm install
```

Variables à renseigner (voir `.env.example` pour la liste complète et commentée) :

| Variable | Description |
|---|---|
| `DATABASE_URL` | Connexion Postgres poolée |
| `DIRECT_URL` | Connexion Postgres directe (migrations) |
| `ADMIN_EMAIL` | Email autorisé à se connecter au backoffice |
| `AUTH_SECRET` | Secret de signature des sessions (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_BASE_URL` | URL publique du site (`http://localhost:3000` en local) |
| `RESEND_API_KEY` | Clé API Resend |
| `RESEND_FROM_EMAIL` | Adresse d'expédition des emails |
| `BLOB_READ_WRITE_TOKEN` | Token Vercel Blob |
| `CRON_SECRET` | Secret de sécurisation de la route cron (`openssl rand -hex 24`) |

## 5. Créer le schéma et charger les données de démo

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

Le script de seed (`prisma/seed.ts`) crée : les informations de l'entreprise, 6 services, 5 avis clients, quelques photos de démo, et 8-10 devis avec des statuts et dates variés (dont des factures générées automatiquement pour les devis signés) — pour que le tableau de bord et le site public soient immédiatement démonstratifs.

## 6. Lancer en local

```bash
npm run dev
```

Checklist de test :
1. Ouvrir `http://localhost:3000` : la vitrine publique doit afficher les services, avis, zone d'intervention.
2. Soumettre le formulaire de devis.
3. Aller sur `/admin`, saisir l'email correspondant à `ADMIN_EMAIL`, cliquer sur le lien reçu par email (ou consulter les logs Resend en mode test).
4. Vérifier la redirection vers `/backoffice` et explorer le tableau de bord, les devis, les factures, le contenu du site.
5. Sur un devis "Nouveau", ajouter des lignes de prestation et cliquer sur "Envoyer le devis" (génère un PDF et un email).
6. Marquer un devis "Signé" : une facture est automatiquement créée.

## 7. Déployer sur Vercel

1. Poussez le repo sur GitHub et importez-le dans Vercel.
2. Dans **Project Settings → Environment Variables**, ajoutez toutes les variables listées dans `.env.example`.
3. Le build Vercel exécute `npm run build`, qui lance `prisma generate` (via `postinstall`) puis `next build`. Après le premier déploiement, exécutez les migrations sur la base de production :
   ```bash
   npx prisma migrate deploy
   npx prisma db seed   # optionnel : uniquement pour peupler une démo
   ```
   (à exécuter localement avec le `DATABASE_URL`/`DIRECT_URL` de production, ou via `vercel env pull`).
4. Vérifiez que le Cron Job apparaît dans **Project → Cron Jobs** (configuré via `vercel.json`, exécution quotidienne à 8h UTC pour les relances de devis).

## 8. Dupliquer ce projet pour un nouveau client artisan

Ce projet est conçu pour ne nécessiter **aucune modification de code** lors d'une réutilisation pour un autre artisan. Trois surfaces à personnaliser :

1. **Variables d'environnement** (nouvelle base de données, nouvel email admin, nouvelles clés Resend/Blob) — voir tableau ci-dessus.
2. **Contenu métier**, entièrement modifiable depuis le backoffice (`Contenu du site`) : nom, téléphone, adresse, SIRET, villes couvertes, description, services, avis clients, photos. Rien n'est en dur dans le code.
3. **Palette de couleurs** : modifiez les tokens `brand` / `accent` dans `tailwind.config.ts`. Tous les composants utilisent ces classes sémantiques, jamais de couleurs codées en dur.

## Architecture (résumé)

- `src/app` — routes App Router (site public, `/admin`, `/backoffice/*`, routes API)
- `src/components/public` — composants de la vitrine
- `src/components/backoffice` — composants du backoffice
- `src/components/ui` — primitives UI partagées
- `src/lib` — Prisma, auth (JWT via `jose`, compatible Edge middleware), emails (Resend), PDF (`@react-pdf/renderer`), Blob
- `src/middleware.ts` — protection des routes `/backoffice/*` (vérifie le cookie de session, sans appel base de données, compatible Edge)
- `prisma/schema.prisma` — modèle de données
- `prisma/seed.ts` — données de démonstration

### Authentification admin

Pas de mot de passe : un email valide déclenche l'envoi d'un lien de connexion à usage unique (valable 15 minutes, jeton stocké haché en base). Une fois validé, une session JWT (signée avec `AUTH_SECRET`, via la librairie `jose` compatible Edge) est posée dans un cookie `httpOnly`. Le middleware vérifie ce cookie sur toutes les routes `/backoffice/*` sans toucher la base de données.

## Dépannage

- **Erreur Prisma au build** : vérifiez que `DIRECT_URL` pointe bien vers une connexion non-poolée (nécessaire pour les migrations).
- **Emails non reçus** : en l'absence de domaine vérifié sur Resend, seul l'email associé au compte Resend peut recevoir des emails de test.
- **Cron non déclenché en local** : la route `/api/cron/relances` peut être testée manuellement avec `curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/relances`.
- **Photos non affichées** : vérifiez que `BLOB_READ_WRITE_TOKEN` est bien configuré et que le store Blob est actif.
