# Gesta project guidelines

## Build, test, and lint

- Use Node.js `>=22.14.0` (Node 24 LTS is recommended).
- From the repository root, install and initialize a local development database with:
  `npm ci` then `npm run setup`.
- Run both applications with `npm run dev`: the API is on `http://localhost:3000` and
  the Vite frontend is on `http://localhost:5173`.
- Run the complete validation gate with `npm run check`. It runs lint, TypeScript
  checks, Vitest, and both builds.
- Run individual checks with `npm run lint`, `npm run typecheck`, `npm test`, or
  `npm run build`.
- Run one backend test file with
  `npm run test -w backend -- tests/offers.test.ts`, or one frontend test file with
  `npm run test -w frontend -- tests/OffersPage.test.tsx`.
- Run a single Vitest test by adding `-t "test name"` after the workspace test
  command, for example:
  `npm run test -w backend -- tests/permissions.test.ts -t "..."`.
- Use `npm run db:init` to apply migrations and seed an empty database. Use
  `npm run db:reset` only after stopping the dev server; it deletes and recreates the
  local database.

See [README.md](../README.md), [docs/architecture.md](../docs/architecture.md), and
[backend/API.md](../backend/API.md) for the authoritative setup, architecture, and
API details.

## Architecture

This is an npm-workspaces monorepo with two independently built TypeScript applications:

- `backend/` is an Express API backed by SQLite through `better-sqlite3`.
  `main.ts` loads configuration and initializes the database; `app.ts` assembles
  middleware and routers. The request path is controllers (HTTP validation) ->
  services (business rules) -> repositories (SQL) -> SQLite. Mappers convert database
  rows into domain/API response objects.
- Authentication is assembled in the backend middleware. The token contains only
  `{ kind, id }`; every protected request re-reads the account, roles, and companies
  from SQLite. `authorize(...)` and named rules in
  `backend/src/services/permissions.ts` enforce access on the server.
- `frontend/` is a React/Vite application. `App.tsx` owns the single `useAuth()`
  session and routes. Pages compose hooks, hooks manage display state, services call
  the API, and models/type guards validate API data. Vite proxies `/api/...` to the
  backend and removes the `/api` prefix.
- Backend tests use Vitest and Supertest against an in-memory SQLite database created
  by `backend/tests/helpers/testDatabase.ts`; they must not depend on
  `backend/data/gesta.db`. Frontend tests use Vitest, jsdom, and Testing Library with
  mocked fetch responses.

## Conventions

- Keep backend layers separate: controllers may handle `Request`/`Response`;
  services must not depend on Express; repositories contain SQL; use mappers at the
  database/API boundary.
- Report expected API failures by throwing `HttpError(status, code, message)`.
  Let the centralized error handler return the documented JSON shape
  `{ "error": { "code", "message" } }`; do not create ad-hoc error responses.
- Keep authorization in backend services/middleware. Frontend permission helpers only
  control navigation and visibility and are never a security boundary.
- The `Authorization` header carries the raw token without a `Bearer` prefix.
  A 401 from the API should cause frontend hooks to call `onUnauthorized` and return
  to login.
- Backend relative imports use the `.ts` extension because TypeScript rewrites them
  to `.js` during compilation. Follow the existing TypeScript and Oxlint settings.
- Add schema changes as a new, numerically ordered SQL file under
  `backend/src/db/migrations/` (for example `002_description.sql`); do not edit an
  already-applied migration. Update seed data and database tests when the schema or
  seeded relationships change.
- Store status and role values as the existing English codes in the backend/database;
  translate them for display in the frontend through the existing labels/helpers.
- The development API port is `API_PORT`, not the generic `PORT`. Keep the Vite proxy
  and `backend/.env` behavior consistent when changing ports.
- Demo authentication is development-only. Do not weaken the startup guard that rejects
  `DEMO_AUTH_ENABLED=true` in production.
- When changing an endpoint, update `backend/API.md` and the corresponding
  `backend/http/*.http` request examples. Add coverage for success and relevant
  authorization/error statuses.
- Follow the repository pull request template, including its API documentation,
  migration, browser-testing, permission, and conversation-export checklist items.
