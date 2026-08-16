# Testing (Playwright)

`e2e/smoke.spec.ts` visits every public page unconditionally, plus `/dashboard` while
authenticated if `E2E_TEST_EMAIL`/`E2E_TEST_PASSWORD` are set (skips cleanly otherwise —
see `e2e/login.ts`). It fails on any thrown render error or the app's own error boundary.
It exists to catch bugs `next build`'s type check can't — specifically Server Component ->
Client Component prop violations (e.g. passing a non-serializable value as a prop), which
only surface once React actually renders the page. Runs in CI on every push to `master`
(`.github/workflows/e2e.yml`).

When you add a new page under `src/app`: add its path to `PUBLIC_PAGES` in
`e2e/smoke.spec.ts` (or a new authenticated test, if it needs a session) — this repo has no
central page registry to read from automatically, unlike some of this author's other repos.

When you add a new Client Component that receives props from a Server Component, or
otherwise touches the server/client boundary in a new way: run `npm run test:e2e` locally
before pushing, not just `npm run build`. The build passing is not sufficient evidence the
page still renders — that's exactly the gap this suite exists to close.

Needs `E2E_TEST_EMAIL`/`E2E_TEST_PASSWORD` in `.env.local` (a dedicated test account, not
your own) to exercise the authenticated `/dashboard` test locally; without them it's
skipped, not failed.
