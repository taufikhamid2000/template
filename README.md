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

### Setting the Supabase Production env vars in one command

Every app in this portfolio shares one Supabase project (`master_db`). Instead
of manually pasting `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
/ `SUPABASE_SERVICE_ROLE_KEY` into the Vercel dashboard for every new project
(the Supabase↔Vercel Marketplace integration only syncs Preview env vars, not
Production — a real limitation on the Hobby plan, not a config mistake),
there's a script for this: `C:\Users\Taufik\project\scripts\setup-supabase-env.mjs`.

One-time setup:
1. Create a Vercel access token: https://vercel.com/account/tokens
2. Persist it: `[Environment]::SetEnvironmentVariable("VERCEL_TOKEN", "...", "User")`
   (PowerShell), then open a new terminal window.

Then, for any project — including a brand new one — one line sets its
Production Supabase vars:

```powershell
node C:\Users\Taufik\project\scripts\setup-supabase-env.mjs <vercel-project-name>
```

It reads the real values out of `duitduit/.env.local` (a repo that already has
working ones) and pushes them straight to the named project's Production
environment via Vercel's REST API — no dashboard clicking. Trigger a redeploy
afterward for it to take effect.

### Creating a new app from this template (with Claude + connectors)

How JomSookan was spun up end to end. With the GitHub, Supabase and Vercel
connectors attached to a Claude Code session, no dashboard clicking is needed:

1. **Repo:** create an empty repo on GitHub (the session's GitHub access can't
   create repos), attach it to the session, then copy this template into it
   (without `.git`/`node_modules`) and push to `main`.
2. **Database:** reuse `master_db` with a dedicated schema per app
   (`create schema <app>`; usage grants; RLS on every table; grants to
   `authenticated`/`service_role`, none to `anon`). Add the schema to the
   exposed Data API schemas (`alter role authenticator set pgrst.db_schemas = '…, <app>'`
   then `notify pgrst, 'reload config'`) and scope the Supabase clients with
   `db: { schema: "<app>" }`. `auth.users` is shared, so don't add triggers on
   it — create profiles from an RPC instead. Apply SQL in small chunks (large
   batches time out); skip `drop policy if exists` on first create, it triggers
   a confirmation prompt.
3. **Vercel:** `create_git_project` (`deploy: false`) → `create_project_env`
   for `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from the
   Supabase connector) and `NEXT_PUBLIC_REDIRECT_URL` → `create_deployment`
   (`target: production`, `projectSettings.framework: nextjs`,
   `skipAutoDetectionConfirmation=1`). `vercel.json` already pins `sin1`.
4. New projects get Vercel's default deployment protection (SSO); turn it off
   if the app should be public.

This replaces the PowerShell env-var script above for new projects.

---
Built by [Muhammad Taufik](https://taufik.vercel.app)
