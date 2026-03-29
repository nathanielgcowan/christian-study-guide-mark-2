This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Production checklist (PR-ready)

1. auth & authorization
   - [ ] Add NextAuth provider (Google/GitHub/Auth0/Clerk/Supabase)
   - [ ] Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXTAUTH_SECRET` in `.env.local`
   - [ ] Remove the `localStorage` admin gate in `app/admin/analytics/page.tsx`
   - [ ] Add RBAC to API: `app/api/admin/analytics/route.ts`
2. database & persistence
   - [ ] Add Prisma or ORM + migrations
   - [ ] Create tables: `users`, `sessions`, `analytics_events`, `prayer_entries`
   - [ ] Implement real analytics API (no mock data)
   - [ ] Seed admin user and optional test users
3. routing & UI
   - [ ] Add protected admin middleware or server route checking role
   - [ ] Add `404`, `500` custom pages
   - [ ] Add or improve mobile responsive layout
4. testing
   - [ ] Add unit tests (Vitest/Jest) for components and helpers
   - [ ] Add API integration tests for auth and admin endpoints
   - [ ] Add E2E tests (Playwright/Cypress) for admin login path
5. security & compliance
   - [ ] Use HTTPS, CSP, secure cookies
   - [ ] Add rate limiting for login endpoints
   - [ ] Add privacy policy and data deletion flow (GDPR/CCPA)
   - [ ] Run dependency audit (`npm audit`, `npm audit fix`)
6. CI / deployment
   - [ ] Add GitHub Actions config: lint, test, build
   - [ ] Configure staging and production branches
   - [ ] Deploy to Vercel (or chosen host)
   - [ ] Add monitoring/alerts (Sentry/Datadog)

### commands

- `npm install`
- `npm run lint`
- `npm run build`
- `npm run dev`

# christian_study_guide
