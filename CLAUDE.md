# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install --ignore-scripts   # install (skip postinstall scripts)
npm run dev                    # dev server at http://localhost:3000
npm run build                  # production build (also the type-check gate)
npm run lint                   # eslint
```

There is no test suite. `npm run build` is the verification step — run it before considering a change done.

## What this is

Mobile-first (phone-first RWD) guided strength training web app. Next.js 16 App Router + TypeScript + Tailwind v4. **No backend**: all exercise data is a static JSON (`src/data/exercises.json`, ~1,300 exercises) and media (GIFs/thumbnails) is loaded from CDN.

## Architecture

### Data layer (static, server-safe)
- `src/lib/exercises.ts` — loads `exercises.json` into memory, `Map` lookup by id, filter helpers. All exercise references elsewhere are **dataset exercise IDs**.
- `src/lib/programs.ts` — hand-curated progressive programs (Foundation → Dumbbell → Barbell) whose sessions reference exercise IDs. `src/lib/teaching.ts` — movement-pattern lessons.
- `src/lib/media.ts` — builds media URLs with a **CDN fallback chain** (raw.githubusercontent → jsDelivr). Components track a `cdnIndex` and call `nextCdnIndex()` on image error; keep that pattern when rendering dataset media.

### Client state pattern (important)
Client-side state (progress, language mode, nav stack) lives in `localStorage`/`sessionStorage` and is consumed via `useSyncExternalStore` with a **module-level cached snapshot** (`cachedRaw`/`cachedState`) so snapshots stay referentially stable — breaking that causes infinite re-render loops (this was a real bug, see commit e995807). Cross-component updates are broadcast with custom `window` events. Follow this pattern for any new persisted client state:
- `src/lib/progress.ts` — completed sessions/exercises.
- `src/lib/log.ts` — per-set workout log (reps/weight), powers `/history` stats + CSV/JSON export.
- `src/lib/locale.tsx` — language mode context.

Back navigation is **hierarchical, not history-based**: `BackButton` is a plain link to the page's structural parent (`backHref` on `AppShell`). Don't reintroduce history stacks.

The build is a **full static export** (`output: "export"` in next.config.ts; all dynamic routes pre-render every param with `dynamicParams = false`). Keep new pages static-exportable — no server-only `searchParams`, no on-demand rendering — so the `out/` folder can drop into a Capacitor iOS/Android shell unchanged. The library page filters client-side for this reason.

Grid gotcha: every single-column stack class in globals.css uses `grid-template-columns: minmax(0, 1fr)`. Without it the implicit auto track inherits the max-content width of horizontal scroll rails and blows the page wider than the viewport (this was the recurring "viewport overflow" bug).

Health-app note: Apple Health / Health Connect (Google, Samsung, OnePlus, Honor) are native-SDK-only; a web app cannot write to them. The supported path is the `/history` export (CSV/JSON).

### Bilingual EN / Cantonese (粵語)
The app has three language modes: `en`, `yue`, `both` (`AppLangMode` in `src/lib/ui-strings.ts`). Cantonese content is stored in parallel modules (`programs-yue.ts`, `teaching-yue.ts`) and merged at render time via `src/lib/localize.ts` (`pickLang`, `showEn`, `showYue`) and the `Bilingual` component. Any new user-facing copy needs both an English and a Cantonese variant plus a `UiKey` in `ui-strings.ts`.

### Pages
Routes under `src/app/` are mostly thin server components that delegate to `*Client.tsx` / `*PageClient.tsx` components in `src/components/`, because nearly everything depends on client state (locale, progress). Dynamic routes: `exercise/[id]`, `workout/[sessionId]`, `path/[programId]`, `body/[part]`, `learn/[pattern]`.

## Constraints

- Out of scope (per PRODUCT.md): accounts, social, nutrition, paid programs, offline/PWA.
- Attribution: exercise data from hasaneyldrm/exercises-dataset, media © Gym visual — keep the credit intact.
- UI is dark, Apple Fitness–inspired (activity rings, gradient tiles — see `fitness-theme.ts`, `ActivityRings.tsx`). Viewport overflow on phones has been a recurring regression; verify new layouts at mobile widths.
