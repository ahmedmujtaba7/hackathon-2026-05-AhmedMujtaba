# Build Phases — AI Murder Mystery Detective

Phased delivery plan, mapped to the hackathon timeline (May 7-9 build, May 11 demo).

Each phase has its own document under `phases/` with: **goal → plan → done → pending → acceptance criteria**.

| # | Phase | Status | Doc |
|---|-------|--------|-----|
| 1 | Foundation — monorepo, scaffolds, DB schema | DONE | [phases/PHASE_1_foundation.md](phases/PHASE_1_foundation.md) |
| 2 | Authentication — Google OAuth, JWT, coin economy | DONE | [phases/PHASE_2_authentication.md](phases/PHASE_2_authentication.md) |
| 3 | AI integration — Groq service (`llama-3.3-70b-versatile`) + 4 prompt templates | DONE | [phases/PHASE_3_ai_integration.md](phases/PHASE_3_ai_integration.md) |
| 4 | Core game loop — case, interrogate, hint, verdict services | DONE | [phases/PHASE_4_game_loop.md](phases/PHASE_4_game_loop.md) |
| 5 | Frontend UI — pages, components, noir theme | DONE | [phases/PHASE_5_frontend_ui.md](phases/PHASE_5_frontend_ui.md) |
| 6 | Integration testing & QA | DONE | [phases/PHASE_6_qa.md](phases/PHASE_6_qa.md) |
| 7 | Polish, animations, demo prep | DONE | [phases/PHASE_7_polish.md](phases/PHASE_7_polish.md) |
| 8 | Deployment — Vercel + Railway + Postgres | DONE | [phases/PHASE_8_deployment.md](phases/PHASE_8_deployment.md) |
| 9 | Polish wave 2 — onboarding, fonts, observability, layout fixes | DONE | (this doc, see "Polish wave 2" below) |
| 10 | Polish wave 3 — bug-fix sprint + playtest tuning | DONE | (this doc, see "Polish wave 3" below) |

## Polish work completed (Phase 7 highlights — May 8)

| Feature | Status |
|---------|--------|
| Web Speech API TTS — all 5 steps | DONE |
| Gender-aware voice selection (female/male browser voices) | DONE |
| `gender` field in AI prompt schema + passed through `sanitizeCase` | DONE |
| Rain sound removed; thunder synced to canvas lightning flash | DONE |
| 55 leaves scattered all over the screen (was 32, top-only) | DONE |
| Dashboard stats panel — animated counter cards + perf bar chart | DONE |
| Landing page visual overhaul (feature cards, marquee, crime-tape) | DONE |
| Game page: ambient stops on mount, TTS voices loud and clear | DONE |
| Stats tracking in localStorage (game page saves difficulty, result page saves outcome) | DONE |
| Navbar Â~ glyph bug fixed; replaced with Fingerprint medallion + EST. 1947 wordmark | DONE |
| Dashboard redesign: 2-col viewport-fit, stat tiles, Detective Badge card with rank progress | DONE |
| Case file CoverPage redesigned as classified document (polaroid victim photo, CONFIDENTIAL stamp, metadata grid) | DONE |
| Interrogation empty state filled with sonar avatar, suggested opening lines, brass send button | DONE |
| Suspect list refined to muted noir palette; witness avatars now visible (cream-bg dicebear) | DONE |
| Case file auto-narration on open (default ON, persisted via `mm_case_file_autoplay`) | DONE |
| Voice INPUT in chat (free, Web Speech Recognition, no API key) | DONE |
| Layout architecture: body fixed to `h-[100dvh]` so only inner scrollers scroll (chat scrolls in-place; page never scrolls) | DONE |
| Background music (`mystery-thriller.mp3`) plays on landing / dashboard / `/game/new`; auto-stops on `/game/[sessionId]`; mute button pauses/resumes | DONE |
| Dashboard pixel-perfect compression — fits in single viewport at 1080p without scrollbar (compact Hero, tight padding, horizontal Detective Badge, smaller stat tile numerals) | DONE |

## Polish wave 2 — May 9 (post-deployment)

| Feature | Status |
|---------|--------|
| Background music silenced the moment the user clicks "Begin Investigation" (covers the cinematic generation overlay and the entire game session, not just `/game/[sessionId]`) | DONE |
| Difficulty cards: equal-height grid with `items-stretch`, all three CTAs use a fully-filled accent button (was outline for Easy), tighter padding (`p-5` from `p-6`), header + balance moved into a single row on desktop, `lg:overflow-hidden` so the page fits on a 720p laptop | DONE |
| Verdict reveal: backend `submitVerdict()` now returns `murdererName`, `murdererId`, `accusedName`. Result page renders a stamped *Classified* dossier card showing the actual killer regardless of win/lose, with a contextual subtitle differing by outcome | DONE |
| First-time onboarding tour: `components/onboarding/onboarding-tour.tsx` — 5-slide modal with step indicator, framer-motion staggered transitions, fully skippable, persisted via `mm_onboarded_v1` localStorage key, mounted on `/dashboard` | DONE |
| Font upgrade: Cinzel (display, Roman-inscription serif) + Cormorant Garamond (serif body, elegant editorial) + Outfit (sans/UI) + JetBrains Mono (mono kept). Wired in `layout.tsx` and `tailwind.config.ts` via CSS variables | DONE |
| PostHog analytics: 19 typed events, `phIdentify`/`phReset`, autocapture off, dev opt-out, route-aware page_view via Suspense-wrapped provider | DONE |
| Sentry error monitoring (backend): `instrument.ts` first-import, global `SentryExceptionFilter` with 4xx skip + 5xx scope (user, request, body, http.status), Express error handler hooked, `SENTRY_DSN` set on Railway | DONE |
| README.md created at repo root — judge-friendly project overview with architecture diagram, tech stack table, quick start, invariants, observability notes | DONE |

## Polish wave 3 — May 9 (bug-fix sprint + playtest tuning)

| Feature | Status |
|---------|--------|
| **Timer-start endpoint** (`POST /case/:sessionId/begin`) — resets `expiresAt = now + difficulty_ms` so reading the case file doesn't burn play budget. Idempotency via `startedAt` vs `createdAt` comparison (5 s tolerance) so re-clicks don't extend. Frontend `handleBeginInvestigation` is now async and awaits the call; falls back to `session.expiresAt` on network failure | DONE |
| **Hard reward fix** — `COIN_REWARDS.hard` 200 → 600 (+400 net, flat 3× return matching Easy/Medium). Was zero net profit before (broken UX). `DIFFICULTY_INFO.hard.reward` synced on the frontend | DONE |
| **Dashboard bottom-right fill** — Investigation Protocol text scaled up (16→22 px step number, 11→13 px body, padding p-3 → px-5 py-4). New `DetectivesNotebook` component with a daily-rotating noir quote (deterministic by date, never empty), gold rule decorations, attribution + entry counter | DONE |
| **Auto-narration default OFF** — `mm_case_file_autoplay` localStorage default flipped from `'1'` to `'0'`. Auto-narration now opt-in via the Auto toggle in the case file's top bar. Returning players get a quiet case file by default | DONE |
| **TTS stops on Begin Investigation** — `handleBeginInvestigation` calls `stopTTS()` so any in-flight narration is killed when the player commits to gameplay | DONE |
| **Case generation diversity** — Settings pool 24 → 48 (added research vessels, Bollywood film sets, Norwegian fjord cabins, Himalayan base camps, Moroccan riad weddings, etc.). New 12-entry `DEATH_SEEDS` pool (model picks one as the basis, stops defaulting to "blunt force trauma"). Random entropy token (`Math.random + Date.now`) injected into both prompts. Case temp 0.8 → 1.15, `top_p: 0.95`. Hint temp 0.7 → 1.0, `top_p: 0.95`. New 10-entry `HINT_OPENERS` pool. Explicit anti-cliché list (no twins, no missing wills, no reusing common past names) | DONE |
| **Dashboard vertical-balance on big screens** — `flex-1` removed from `DetectiveBadge` and `DetectivesNotebook`. Content wrapper changed `flex-1 min-h-0` → `my-auto` so dashboard centres vertically on tall monitors. Columns row uses `lg:items-start` so each column sits at its natural content height. No regression on laptop layout | DONE |
| **Narration speed** — `NARRATOR_VOICE.rate` 1.10 → 0.88 (slowed for comprehension), `STORY_VOICE.rate` 1.00 → 0.85. Players can now follow the briefing while reading without rewinding | DONE |
| **Easy difficulty rewrite** — Strict new rules: murderer's `why_suspect` must be glaring on its own, alibi has obvious internal contradiction, both witnesses volunteer the contradiction without prompting, ≥3 initial evidence items with ≥2 pointing at the murderer, motive is simplest possible, 0 red herrings, no partially-true alibi, no multi-clue motives. Heuristic at the bottom: *"a child detective could solve this with 2 questions"*. Medium and Hard untouched | DONE |
| Notion documentation tree (13 pages: PRD + Execution Plan + Visual PRD with 15 mermaid diagrams + Hackathon Checklist + Frontend section ×5 + Backend section ×5) created via Notion MCP | DONE |

## How to use this

- Phases 1-5 are reference docs — they record what already exists in the repo and where to find it.
- Phases 6-8 are the working plan — pick the next task from there.
- Update each doc's **Done** section as you complete tasks. Keep **Pending** tight.
- One phase in flight at a time.

## Deployment work completed (Phase 8 partial — May 9)

| Task | Status |
|------|--------|
| Frontend deployed to Vercel via CLI (`--archive=tgz`, temp dir outside git) | DONE |
| `package-lock.json` stub bug identified and fixed (813-line stub → 6,759-line real lockfile) | DONE |
| Next.js CVE-2025-66478 resolved: upgraded `15.0.3` → `^16.2.6` | DONE |
| React 19 peer-dep conflict: added `frontend/.npmrc` with `legacy-peer-deps=true` | DONE |
| Root `vercel.json` with monorepo-aware `buildCommand` + `outputDirectory` | DONE |
| `frontend/vercel.json` with `{"framework":"nextjs"}` | DONE |
| Frontend live URL: `https://mm-deploy-1778312687-d9336mvqa-ahmed-mujtaba-1361.vercel.app` | DONE |
| `.gitignore` files created for root, `frontend/`, and `backend/` | DONE |
| `.claude/settings.local.json` untracked from git index | DONE |
| Backend deployment (Railway) | PENDING |
| Production smoke test | PENDING |
| Google OAuth redirect URI update for prod | PENDING |

## Timeline mapping

| Date | Phases active |
|------|---------------|
| May 7 (Day 1) | 1, 2, 3, 4 (backend foundation done in one push) |
| May 8 (Day 2) | 5, 6, 7 (frontend wired + audio/voice/polish wave) |
| May 9 (Day 3) | 7, 8 (polish final + Vercel deployment) |
| May 10 (rest) | Buffer / break |
| May 11 (demo) | Live presentation |
