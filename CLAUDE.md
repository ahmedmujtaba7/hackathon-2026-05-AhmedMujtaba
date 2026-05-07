# AI Murder Mystery Detective

## Stack
- Language: TypeScript 5.4
- Frontend framework: Next.js 15 App Router
- Backend framework: NestJS 10 (Node 22) — lives in `backend/`
- DB: Postgres 16 via Sequelize ORM + Sequelize migrations
- Package manager: pnpm 9 (workspaces: `frontend/`, `backend/`)
- Auth: Google OAuth — handled by backend; JWT issued to frontend
- AI: Gemini free tier (Google Generative AI SDK)
- UI: Tailwind CSS + shadcn/ui (dark noir theme)
- Deploy: Vercel (frontend) + Railway / Render (backend)

## Architecture (1 paragraph)
Frontend is a Next.js App Router SPA that talks exclusively to the Express backend over REST. The backend owns all business logic: Google OAuth callback issues a JWT, four AI-backed endpoints handle case generation, suspect interrogation, hint delivery, and verdict reveal. The full case JSON (including suspect private truths and the murderer's identity) is stored in Postgres per active session and **never sent to the frontend**. Coin state is transactional — all reads and writes go through `CoinService`. The countdown timer lives client-side; on expiry the frontend POSTs to `/api/verdict` which treats it as a loss. The 5 most important files are: `backend/src/routes/case.ts`, `backend/src/routes/interrogate.ts`, `backend/src/services/CaseService.ts`, `backend/src/services/CoinService.ts`, `backend/src/db/models/`.

## Directory map
```
frontend/                   — Next.js App Router SPA
  app/                      — Pages and layouts (no API routes)
  components/               — UI components using shadcn primitives
  lib/api.ts                — Typed fetch wrapper for backend calls

backend/
  src/
    case/                   — CaseModule: controller + service + DTOs
    interrogate/            — InterrogateModule: controller + service + DTOs
    hint/                   — HintModule: controller + service + DTOs
    verdict/                — VerdictModule: controller + service + DTOs
    coin/                   — CoinModule: service only (shared, no routes)
    auth/                   — AuthModule: Google OAuth strategy, JWT guard
    ai/                     — AiModule: Gemini prompt templates + SDK wrapper
    db/
      models/               — Sequelize model definitions
      migrations/           — Generated migration files (never edit by hand)
    common/
      errors/               — Typed exception classes (extend HttpException)
      logger/               — NestJS logger wrapper
    app.module.ts           — Root module
    main.ts                 — Bootstrap entry point
```

## Conventions
- Errors: throw typed exceptions from `backend/src/common/errors/`. Extend `HttpException`. Never throw raw strings.
- Logging: use NestJS `Logger` from `backend/src/common/logger/`. Never `console.log`.
- DB access: only inside feature services (e.g. `CaseService`). Controllers call services, never Sequelize directly.
- AI calls: only inside `AiService` (`backend/src/ai/`). Feature services call `AiService`, not the Gemini SDK directly.
- Structure: every feature is a NestJS module (`<feature>.module.ts`, `<feature>.controller.ts`, `<feature>.service.ts`). Register in `AppModule`.
- DTOs: every request body has a DTO class with `class-validator` decorators. Enable `ValidationPipe` globally in `main.ts`.
- Naming: services are `<Domain>Service`, controllers are `<Domain>Controller`. DB tables are snake_case plural.
- Coin writes: always go through `CoinService.deduct()` / `CoinService.award()` — inject `CoinService`, never update coins inline.
- Frontend API calls: always go through `frontend/lib/api.ts` — never raw `fetch` in components.
- CORS: configured in `main.ts` via `app.enableCors()`, allowing only the frontend origin.

## Build / test / deploy commands
- Install all: `pnpm install` (from repo root — installs both workspaces)
- Dev (both): `pnpm dev` (root script runs frontend + backend concurrently)
- Dev frontend only: `pnpm --filter frontend dev`
- Dev backend only: `pnpm --filter backend dev` (runs `nest start --watch`)
- Test: `pnpm --filter backend test`
- Test e2e: `pnpm --filter backend test:e2e`
- Lint: `pnpm lint`
- Build frontend: `pnpm --filter frontend build`
- Build backend: `pnpm --filter backend build` (runs `nest build`)
- Generate NestJS module: `cd backend && npx nest g module <name>`
- DB migrate: `pnpm --filter backend db:migrate`
- DB migration create: `pnpm --filter backend db:migration:create --name <name>`
- Deploy frontend: `vercel --prod` (from `frontend/`)
- Deploy backend: push to Railway / Render (auto-deploys from `backend/`)

## Things to NEVER do
- Never send suspect `private_truth`, `alibi_is_true`, or `will_crack_if` fields to the frontend.
- Never let coins drop below 0. `CoinService.deduct()` must throw `InsufficientCoinsError` if balance would go negative.
- Never write Sequelize queries outside `backend/src/services/`.
- Never use raw SQL strings. Use Sequelize model methods.
- Never call the Gemini SDK outside `backend/src/ai/`.
- Never add API routes to the Next.js `app/api/` folder — all API logic lives in the NestJS backend.
- Never commit secrets. Use `.env` in each workspace (gitignored). Production secrets go in Railway / Vercel env vars.
- Never edit `backend/src/db/migrations/` by hand. Generate via `pnpm --filter backend db:migration:create`.

## Game rules (encode as invariants, not just docs)
- One hint per case. `HintService.requestHint()` must throw `HintAlreadyUsedError` if a hint was already issued for this game session.
- Coin costs: Easy = 50, Medium = 100, Hard = 200. Deducted at case start before generation.
- Coin rewards on win: same as cost × 2 (net gain = cost). On loss: no reward, cost already deducted.
- Timer: Easy = 15 min, Medium = 25 min, Hard = 45 min. Auto-submit on expiry counts as a loss.
- Starter balance: 1 000 coins granted on first Google login only.

## Open questions / known weirdness
- Crime scene image generation is async and may be slow — the UI shows a placeholder while it loads. This is intentional; do not add a blocking await.
- Hint phrasing must always be first-person ("Something about X doesn't sit right..."). If Claude returns a third-person hint, retry once then log a warning.

## Useful sub-files
- `SPEC.md`         — full project spec, acceptance criteria, demo plan
- `PROMPT_LOG.md`   — prompts that worked, prompts that didn't, workflow patterns
- `COST_LOG.md`     — daily spend tracking
- `DEMO_SCRIPT.md`  — 5-minute demo run-of-show
- `frontend/.env.example`  — required frontend env vars
- `backend/.env.example`   — required backend env vars
