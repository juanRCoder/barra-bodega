# AGENTS.md

pnpm workspace with three packages: `client` (Vite + React 19), `server` (Express 5 + Prisma 7), and `packages/types` (shared TS types). `README.md` is corrupted/empty — use this file and the package manifests.

## Commands (from repo root)

- `pnpm install`
- `pnpm dev` — both apps in parallel; `pnpm dev:client` / `pnpm dev:server` for one.
- `pnpm format` / `pnpm format:check` — Prettier (single quotes, semicolons, 80 cols). Husky's pre-commit runs `format:check`, so unformatted commits fail.
- `pnpm --filter client lint` — oxlint (the only lint setup; one known fast-refresh warning in `ui/button.tsx`).
- `pnpm --filter client build` — `tsc -b && vite build`.
- `pnpm --filter server build` — `tsc && tsc-alias`.
- No tests are configured anywhere.
- Commit messages must be Conventional Commits (commitlint runs on `commit-msg`).

## Database setup

- `docker compose up -d db` starts Postgres 17; compose reads `POSTGRES_*` from the **root** `.env`.
- `server/.env` needs `DATABASE_URL`; optional `PORT` (defaults to 3000). The commented `SERVER_PORT`/`CLIENT_PORT` in `.env.example` are not read by the code.
- Run Prisma commands from `server/` (Prisma is only a server devDependency): `pnpm --filter server exec prisma generate`, `... prisma migrate dev`, `... prisma validate`.
- Config auto-loads from `server/prisma7.config.ts` (unusual filename; Prisma discovers it). Schema lives at `server/prisma/schema.prisma`.
- `server/generated/prisma` is gitignored — run `prisma generate` after clone or schema changes, or server build/typecheck fails.

## Architecture notes

- Client routes are declared centrally in `client/src/route.tsx` (lazy-loaded pages). Add pages under `src/pages` and register them there.
- Vite proxies `/api` to `http://localhost:3000` (`client/vite.config.ts`). Keep the server on 3000 or update the proxy.
- `@/*` aliases to `src` in both apps. On the server this is resolved by `tsc-alias` at build time, and imports use explicit `.js` extensions (e.g. `@/routes/route.js`).
- Server layering: `src/routes/route.ts` is the only router (mounted at `/api`); `controllers/` and `services/` are empty scaffolding — put new handlers there and wire them into `route.ts`.
- `@barra-bodega/types` is consumed directly from TS source (`main: ./src/index.ts`), with no build step. Edit `packages/types/src/index.ts` and both apps see it.
- Prisma 7 uses the `@prisma/adapter-pg` driver adapter in `src/index.ts`; the schema's `datasource` intentionally has no `url`.
- UI: Tailwind v4 CSS-first (no `tailwind.config`), shadcn `base-nova` built on `@base-ui/react`; aliases in `client/components.json`. UI components import `cn` from the `cn` package (`src/lib/utils.ts` re-exports it) — don't "fix" it to a local import.

## Gotchas

- `pnpm --filter server start` runs `dist/index.js`, but the current `rootDir: "."` makes `tsc` emit `dist/src/index.js`; production start is unreliable until reconciled. Dev uses `tsx watch`.
- `server/.agents`, `server/.claude`, and `server/.windsurf` are gitignored, Prettier-ignored copies of Prisma skills — don't edit or commit them.
- Git tracks `client/src/pages/dashboard.tsx` (lowercase) while the file and imports use `Dashboard.tsx`; avoid case-only renames, which break on case-sensitive systems.
