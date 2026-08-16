# SouqIQ

Premium Iraqi e-commerce storefront — English UI, light mode, IQD pricing, Cash on Delivery.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma ORM + PostgreSQL
- Auth.js (phone + password)
- Zustand cart, Framer Motion, Resend (optional admin emails)

## Local setup

```bash
npm install
cp .env.example .env
# Fill DATABASE_URL and AUTH_SECRET in .env
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Admin (seeded):** `07501234567` / `Admin@123456`

## Environment variables

| Name | Required | Notes |
|------|----------|--------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (`sslmode=verify-full` recommended for Prisma Postgres) |
| `AUTH_SECRET` | Yes | Long random secret for Auth.js |
| `AUTH_URL` | Production | Your live site URL, e.g. `https://souqiq.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | Recommended | Same as public site URL |
| `NEXT_PUBLIC_APP_NAME` | Optional | Defaults conceptually to SouqIQ |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Optional | Store WhatsApp |
| `RESEND_API_KEY` | Optional | Admin order emails |
| `ADMIN_NOTIFICATION_EMAIL` | Optional | Inbox for new orders |
| `EMAIL_FROM` | Optional | Resend from address |

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Add the environment variables above (Production + Preview).
4. Deploy — `npm run build` runs `prisma generate`, `prisma migrate deploy`, then `next build`.
5. After first deploy, seed once (local against production DB, or Prisma Studio):

```bash
DATABASE_URL="your-production-url" npm run db:seed
```

### Database note

Temporary Prisma Postgres URLs expire unless claimed. For production, use a permanent database (Prisma Postgres claimed project, Neon, Supabase, etc.) and put that `DATABASE_URL` in Vercel.

## Working from any computer

```bash
git clone <your-github-repo-url>
cd iqsore
npm install
cp .env.example .env   # or pull secrets from a password manager / Vercel env
npm run dev
```

Commit and push changes → Vercel redeploys automatically from `main`.
