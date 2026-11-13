# AGENTS.md

pnpm workspace with three packages: `client` (Vite + React 19), `server` (Express 5 + Prisma 7), and `packages/types` (shared TS types). `README.md` is corrupted/empty - use this file and the package manifests.

## Commands (from repo root)

- `pnpm install`
- `pnpm dev` - both apps in parallel; `pnpm dev:client` / `pnpm dev:server` for one.
- `pnpm format` / `pnpm format:check` - Prettier (single quotes, semicolons, 80 cols). Husky's pre-commit runs `format:check`, so unformatted commits fail.
- `pnpm --filter client lint` - oxlint (the only lint setup; one known fast-refresh warning in `ui/button.tsx`).
- `pnpm --filter client build` - `tsc -b && vite build`.
- `pnpm --filter server build` - `tsc && tsc-alias`.
- No tests are configured anywhere.
- Commit messages must be Conventional Commits (commitlint runs on `commit-msg`).

## Environment and database

- Root `.env` supplies `POSTGRES_*` to compose; `docker compose up -d db` starts Postgres 17 on 5432.
- `server/.env` needs `DATABASE_URL`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET`. Optional: `PORT` (3000) and `CLIENT_ORIGIN` (CORS allowlist, comma-separated, default `http://localhost:5173`).
- `JWT_ACCESS_EXPIRES_IN` must be exactly `30m` and `JWT_REFRESH_EXPIRES_IN` exactly `7d`; `src/lib/auth-config.ts` throws at boot for any other value or equal secrets.
- Run Prisma via `pnpm --filter server exec prisma generate|migrate dev|validate`. Config is `server/prisma7.config.ts` (unusual filename, auto-discovered); schema is `server/prisma/schema.prisma`.
- `server/generated/prisma` is gitignored - run `prisma generate` after clone or schema changes or server build/typecheck fails. Server code imports it relatively (`../../generated/prisma/client.js`), not from `@prisma/client`.
- Prisma 7 uses the `@prisma/adapter-pg` driver adapter in `src/lib/prisma.ts`; the schema's `datasource` intentionally has no `url`.

## Architecture

- Server layering: `src/index.ts` boots the app, mounts the router at `/api`, and owns the central error handler (`AppError` -> its status, `ZodError` -> 400 with field errors). Each feature has `routes/<x>.route.ts` -> `controllers/<x>.controller.ts` -> `services/<x>.service.ts` (Zod parse + Prisma), with validators in `schemas/<x>.schema.ts`. Controllers are async with no try/catch - Express 5 forwards rejected promises to the error handler.
- All feature routes use `requireAdmin` from `middleware/auth.middleware.ts`, which validates the Bearer access token and sets `res.locals.adminId`.
- Auth: the 30-minute access token is returned in JSON and kept in client module memory; the refresh token is an HttpOnly cookie scoped to `/api/auth`. Client `apiFetch` in `services/auth.service.ts` adds the Bearer header and retries once after a refresh on 401; `useAuthSession` refreshes every 29 minutes. Do not store the access token in localStorage.
- Multi-tenant data: every service query filters by `admin_id` from `res.locals.adminId`. Products are a global `Product` plus per-admin `ProductsAdmin` (price/stock). Orders are `PENDING` when an account is set and `PAID` otherwise; manual line items use `manual_name` with a null `product_admin_id`.
- Client data flow: `services/<x>.service.ts` (fetch) -> `hooks/use<X>.ts` (TanStack Query keys and mutations) -> pages/components; zod form schemas live in `schemas/`. Follow this pattern for new features.
- Client routes are declared centrally and lazy-loaded in `client/src/route.tsx`; protected pages are wrapped by `pages/ProtectedRoute.tsx`. Add pages under `src/pages` and register them there.
- Vite proxies `/api` to `http://localhost:3000` (`client/vite.config.ts`). Keep the server on 3000 or update the proxy.
- `@/*` aliases to `src` in both apps. On the server this is resolved by `tsc-alias` at build time, and imports use explicit `.js` extensions (e.g. `@/routes/route.js`).
- `@barra-bodega/types` is consumed directly from TS source (`main: ./src/index.ts`), with no build step. Edit `packages/types/src/index.ts` and both apps see it.
- UI: Tailwind v4 CSS-first (no `tailwind.config`), shadcn `base-nova` built on `@base-ui/react`; aliases in `client/components.json`. UI components import `cn` from the `cn` package (`src/lib/utils.ts` re-exports it) - don't "fix" it to a local import.

## Repo context

- `us/001-*.md` through `us/005-*.md` are numbered feature specs/plans (Spanish). Read the relevant one before implementing a feature.
- `server/.agents`, `server/.claude`, and `server/.windsurf` are gitignored, Prettier-ignored copies of Prisma skills - don't edit or commit them.
