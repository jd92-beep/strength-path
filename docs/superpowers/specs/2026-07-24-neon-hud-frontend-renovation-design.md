# Neon HUD Frontend Renovation — Design Spec

Date: 2026-07-24
Status: Approved by user (direction + scope + tech)

## Goal

Renovate the entire Strength Path frontend to a futuristic "neon sci-fi HUD" aesthetic, fix mobile RWD problems, and add a rich pure-CSS motion layer. No new dependencies. Static export (`output: "export"`), bilingual EN/粵, and the CDN media fallback chain must remain intact.

## User-approved decisions

- **Style:** Neon sci-fi HUD — holographic glass panels, glowing edges, grid/scanline texture, animated energy lines. Keep the existing neon ring triad so data viz stays coherent.
- **Mobile pain points to fix (all four):** cramped layout & tiny tap targets; too static/flat; overflow/cutoff bugs; generally not impressive.
- **Scope:** Full app renovation — every page.
- **Animation tech:** Pure CSS keyframes/transitions + tiny IntersectionObserver/RAF hooks. No framer-motion or other deps.

## Approach

Design-token reskin + shared motion layer. Rewrite the design system in `src/app/globals.css`, add a small set of new shared components/hooks, and make targeted TSX edits per page to adopt them. App logic (progress, log, locale, media fallback, static export) is untouched.

Rejected alternatives: a from-scratch `components/ui/` kit (too large a diff, touches all page logic); bespoke per-page redesigns (inconsistent).

## 1. Visual language

- **Canvas:** deeper space-black (`--bg` shifted toward `#05060a`) with a fixed, GPU-cheap HUD backdrop: faint blueprint grid (repeating linear gradients), very subtle scanline shimmer, plus the existing neon corner washes (kept, retuned).
- **Panels — glass HUD:** translucent dark glass + `backdrop-filter` blur; 1px gradient border tinted by the per-entity accent variable `--a` (pattern already used by `.af-tile`); corner-notch detail on hero-level cards via `clip-path`.
- **Color system:** keep `--ring-move #ff2d6c`, `--ring-exercise #34e860`, `--ring-stand #3ddcff`, `--violet #8a5cff`. Glow shadows remain reserved for active states, primary CTAs, and rings.
- **Typography:** uppercase micro-labels with wide letter-spacing (HUD readout feel) for eyebrows/meta; `font-variant-numeric: tabular-nums` on all stats; larger fluid `clamp()` titles. Font stack unchanged (system SF stack — no webfont downloads, keeps static export lean).

## 2. Motion system (pure CSS + small hooks)

New shared primitives:

- `src/hooks/useInView.ts` — IntersectionObserver hook, fires once, returns `ref` + `inView`.
- `src/components/Reveal.tsx` — wrapper that applies staggered fade-rise (`--reveal-delay` custom property per child index) when scrolled into view.
- `src/components/AnimatedNumber.tsx` — RAF count-up for stats (hero chips, history totals, workout numbers), respects reduced motion.

CSS motion layer in `globals.css`:

- Page enter upgraded: fade + 8px rise + subtle scale (replaces current plain `page-in`).
- Button press springs (`transform: scale(0.97)` fast, ease-out return).
- Card edge-glow sweep on hover (`@media (hover: hover)`) and `:active` glow on touch.
- Ripple on primary CTAs (pseudo-element scale-out).
- Tab-bar icon pop on active change.
- Ring sweep kept; rings add a brief glow pulse when a ring completes.
- **Everything wrapped in `@media (prefers-reduced-motion: no-preference)`**; a reduced-motion fallback kills all animation/transition.

## 3. Mobile RWD fixes

- **Tap targets ≥ 44px** everywhere: tab bar items, chips, list rows, language switcher segments, back button.
- **Bottom tab bar → floating glass pill:** margin from screen edges, rounded-full, backdrop blur, larger icons + labels, safe-area aware.
- **Fluid spacing:** section gaps and paddings use `clamp()` so 320px screens don't feel cramped and 430px doesn't sprawl.
- **Overflow/cutoff audit** at 320 / 375 / 430px: keep the `grid-template-columns: minmax(0, 1fr)` rule on every single-column stack (recurring regression per CLAUDE.md), audit long bilingual titles and horizontal scroll rails.
- **Thumb reach:** on workout/quick-session screens the primary action (done set / start / next) is anchored to the bottom of the viewport above the tab bar.

## 4. Page-by-page upgrades

- **Home (`HomeClient.tsx`):** hero with activity rings + `AnimatedNumber` stat chips; section reveals with stagger; program tiles get glass HUD treatment + corner notches.
- **Path (`/path`, `/path/[programId]`):** glass program cards, stage numerals kept, reveal stagger.
- **Library (`LibraryClient.tsx`):** filter chips ≥44px, exercise cards glass with edge glow, list reveal.
- **Body (`/body`, `/body/[part]`, `BodyMap.tsx`):** body-part cards glass HUD, icon pop.
- **Learn (`/learn`, `/learn/[pattern]`, `TeachStudio.tsx`):** step guide gets numbered HUD rail styling.
- **Exercise detail (`exercise/[id]`):** media frame with HUD corner brackets, meta chips, sticky bottom CTA.
- **Workout / Quick session (`WorkoutClient.tsx`, `WorkoutSessionClient.tsx`, `QuickSessionClient.tsx`):** larger set controls (≥44px), glowing rest ring, bottom-anchored primary action, animated set/progress numbers.
- **History (`HistoryClient.tsx`):** animated stat totals, glass cards for entries.
- **Equipment (`/equipment`):** glass tiles, keep existing horizontal drag/snap/fade/scrollbar rail behavior.
- **Desktop (≥1024px):** sidebar nav kept, same tokens applied; multi-column grids get reveal stagger too.

## 5. New/changed files (planned)

- New: `src/hooks/useInView.ts`, `src/components/Reveal.tsx`, `src/components/AnimatedNumber.tsx`.
- Rewritten: `src/app/globals.css` (design tokens + component classes + motion layer; the file stays the single source of truth, expected to grow modestly, not shrink).
- Edited (adoption only, no logic changes): the page/client components listed in §4, `src/components/AppShell.tsx`, `src/components/BottomNav.tsx`, `src/components/ExerciseCard.tsx`, `src/components/WorkoutTile.tsx`, `src/components/ActivityRings.tsx` (completion pulse).

## 6. Constraints & non-goals

- No new npm dependencies.
- Static export must keep working (`npm run build` is the gate); no server-only features.
- Bilingual EN/粵 copy untouched; no new user-facing strings (purely visual change, so no new `UiKey`s expected).
- Keep CDN fallback chain pattern (`cdnIndex` / `nextCdnIndex`) untouched.
- Keep attribution credit intact.
- Out of scope: accounts, social, nutrition, PWA — per PRODUCT.md.
- No changes to the data layer (`src/lib/*` business logic, `fitness-theme.ts` color values).

## 7. Verification

- `npm run build` passes (type-check gate).
- `npm run lint` passes.
- Manual visual check via `npm run dev` at 320px, 375px, 430px, and ≥1024px for: viewport overflow, tap-target sizes, reveal animations, tab bar, workout bottom CTA.
- Confirm `prefers-reduced-motion` disables animations (emulated in devtools).
