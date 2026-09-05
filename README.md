# Template Project

A simple Next.js template project with authentication support using Supabase.

**Live demo:** https://template-beta-one.vercel.app

See [DESIGN.md](./DESIGN.md) for the portfolio's shared design language —
read that before styling a new or revamped project.

## Features

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Supabase Authentication
- shadcn-style UI components (`button`, `card` in `src/components/ui/`)
  built with `class-variance-authority` + Radix primitives, following the
  shadcn conventions — there's no `components.json`/CLI setup, they're
  hand-written to match

## Getting Started

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Set up your Supabase project and update the environment variables:

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `NEXT_PUBLIC_REDIRECT_URL` | Yes | Auth redirect base URL (e.g. `http://localhost:3000`) |
| `E2E_TEST_EMAIL` | For `test:e2e` | Dedicated test account email for Playwright smoke tests |
| `E2E_TEST_PASSWORD` | For `test:e2e` | Dedicated test account password |

Authenticated E2E tests skip themselves if `E2E_TEST_EMAIL`/`E2E_TEST_PASSWORD`
aren't set. They're also needed as GitHub Actions secrets of the same names
for CI.

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

```bash
npm test          # Jest unit tests
npm run test:watch  # Jest watch mode
npm run test:e2e     # Playwright end-to-end tests
```

Unit tests use Jest with `@testing-library/react` and `jest-environment-jsdom`.
End-to-end tests use Playwright (`@playwright/test`).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---
Built by [Muhammad Taufik](https://taufik.vercel.app)
