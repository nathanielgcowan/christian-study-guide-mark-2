This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

✅ **Authentication & Authorization**

- NextAuth with JWT sessions
- User registration + password hashing (bcryptjs)
- Admin role-based access control
- Protected routes with middleware

✅ **User Engagement Features**

- **User Profiles** — customize name, bio, avatar
- **Bookmarks/Favorites** — save verses, blog posts, resources
- **Progress Tracking** — track reading plans, devotional completion
- **Prayer Requests Feed** — submit and view community prayer requests
- **Email Preferences** — subscribe to daily devotionals, newsletters

✅ **Admin Dashboard**

- Real-time analytics + user metrics
- Protected `/admin/analytics` with role-based gating
- Aggregate user activity (sessions, prayers, page visits)

✅ **Email Integration** (optional)

- Daily devotional email scheduler
- Resend or SendGrid provider support
- Customizable email templates

✅ **Bible API** (optional)

- Fetch scripture verses
- Search Bible by keyword
- Mock fallback for development

✅ **Analytics**

- Event tracking API (`/api/analytics/event`)
- User activity logging (sessions, prayers, page views)
- Google Analytics integration

✅ **Bible Verse Image Generator**

- Create beautiful shareable verse images (1200x630px)
- Customize colors with presets or custom colors
- Download as PNG for social media
- Generate OpenGraph-optimized shareable links
- Perfect for Instagram, Twitter, Facebook, Pinterest

## Getting Started

### 1. Clone & Install

```bash
git clone <repo>
cd christian-study-guide
npm install
npx prisma generate
```

### 2. Setup Database

```bash
# SQLite (development)
DATABASE_URL="file:./prisma/dev.db" npx prisma migrate dev --name init

# Or PostgreSQL (production)
# Update DATABASE_URL in .env.local, then:
# npx prisma migrate deploy
```

### 3. Setup Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

- `NEXTAUTH_SECRET` — generate with `openssl rand -hex 32`
- `ADMIN_EMAIL` and `ADMIN_PASSWORD` for initial admin
- Optional: `RESEND_API_KEY`, `SENDGRID_API_KEY`, `BIBLE_API_KEY`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Routes

### User Features

- `POST /api/auth/register` — create account
- `GET/POST /api/user/profile` — view/update profile
- `GET/POST/DELETE /api/user/bookmarks` — manage bookmarks
- `GET/POST /api/user/progress` — track reading progress
- `GET/POST /api/user/prayer-requests` — prayer request feed
- `GET/POST /api/user/email-prefs` — email subscriptions

### Verse Sharing

- `POST /api/verse/generate-image` — generate verse image (returns PNG)
- `GET /api/og/verse` — OpenGraph verse image endpoint (query params)

### Admin

- `GET /api/admin/analytics` — user analytics (admin only)

### Cron Jobs

- `POST /api/cron/daily-devotional` — trigger email (requires `CRON_SECRET`)

## Pages

- `/` — Home
- `/auth/signin` — Login
- `/auth/register` — Sign up
- `/user/profile` — User profile
- `/user/bookmarks` — Saved content
- `/user/prayer-requests` — Prayer requests feed
- `/user/settings` — Email preferences
- `/user/verse-generator` — Create shareable verse images
- `/share/verse` — Shareable verse page with OpenGraph metadata
- `/admin/analytics` — Admin dashboard

## Database Schema

- **User** — authentication + profile (name, bio, avatar, role)
- **Bookmark** — saved verses/resources per user
- **Progress** — reading plan + devotional completion tracking
- **PrayerRequest** — community prayer requests
- **EmailPreference** — email subscription settings
- **Session** — NextAuth sessions
- **AnalyticsEvent** — user activity events

## Production Checklist

- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Setup actual auth provider (Google/GitHub/Auth0/Clerk/Supabase)
- [ ] Configure email provider (Resend/SendGrid) + `EMAIL_FROM`
- [ ] Setup Bible API key (optional)
- [ ] Configure cron scheduler (EasyCron, GitHub Actions, etc.)
- [ ] Add tests (Vitest/Jest for units, Playwright for E2E)
- [ ] Deploy to Vercel, AWS, or your host
- [ ] Setup monitoring (Sentry, Datadog)
- [ ] Add privacy policy, TOS
- [ ] Enable HTTPS + secure headers (CSP)

## Deploy

```bash
# Vercel (easiest for Next.js)
npm install -g vercel
vercel

# Or manually:
npm run build
npm run start


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
```
