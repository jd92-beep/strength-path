# Neon HUD Frontend Renovation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reskin the entire Strength Path frontend to a futuristic neon sci-fi HUD aesthetic, fix mobile RWD (tap targets, overflow, thumb reach), and add a pure-CSS motion layer.

**Architecture:** Design-token reskin in `src/app/globals.css` + three new shared motion primitives (`useInView`, `Reveal`, `AnimatedNumber`) + targeted TSX adoption edits per page. No app-logic changes.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4 (CSS-first), TypeScript. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-07-24-neon-hud-frontend-renovation-design.md`

## Global Constraints

- **No test suite exists.** `npm run build` is the verification gate (type-check + static export). `npm run lint` must also pass. Every task ends with build + lint + commit.
- No new npm dependencies.
- Static export must keep working: no server-only `searchParams`, no on-demand rendering.
- Never remove `grid-template-columns: minmax(0, 1fr)` from single-column stack classes in globals.css — removing it causes the recurring viewport-overflow bug.
- Bilingual EN/粵 copy untouched; this is a visual-only change, no new `UiKey`s.
- Keep the CDN media fallback pattern (`cdnIndex` / `nextCdnIndex()` in `src/lib/media.ts`) untouched.
- Keep the Gym visual attribution credit intact.
- All new animation/transition CSS must live inside `@media (prefers-reduced-motion: no-preference)`; the existing `@media (prefers-reduced-motion: reduce)` block at the end of globals.css must zero-out any new animations too.
- Tap targets: minimum 44×44px on all interactive elements.
- Commit messages: conventional commits (`feat:`, `style:`, `fix:`).

---

### Task 1: Motion primitives (useInView, Reveal, AnimatedNumber)

**Files:**
- Create: `src/hooks/useInView.ts`
- Create: `src/components/Reveal.tsx`
- Create: `src/components/AnimatedNumber.tsx`

**Interfaces:**
- Produces:
  - `useInView<T extends HTMLElement>(threshold?: number): { ref: React.RefObject<T | null>; inView: boolean }` — fires once, then disconnects.
  - `Reveal({ children, className?, delay?, as? }: { children: React.ReactNode; className?: string; delay?: number; as?: "div" | "section" | "li" }): JSX.Element` — renders a wrapper with class `reveal` + `reveal--in` when in view; `delay` (ms) becomes inline `transitionDelay`.
  - `AnimatedNumber({ value, duration?, format? }: { value: number; duration?: number; format?: (n: number) => string }): JSX.Element` — RAF count-up from 0 to `value` on mount, renders a `<span>`.

- [ ] **Step 1: Create `src/hooks/useInView.ts`**

```ts
"use client";

import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, inView]);

  return { ref, inView };
}
```

- [ ] **Step 2: Create `src/components/Reveal.tsx`**

```tsx
"use client";

import { useInView } from "@/hooks/useInView";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "reveal--in" : ""} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/AnimatedNumber.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedNumber({
  value,
  duration = 900,
  format = (n: number) => String(Math.round(n)),
}: {
  value: number;
  duration?: number;
  format?: (n: number) => string;
}) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(value * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);

  return <span>{format(display)}</span>;
}
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: build passes (files unused so far — that is fine; Next does not tree-shake errors on unused files).

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useInView.ts src/components/Reveal.tsx src/components/AnimatedNumber.tsx
git commit -m "feat: add motion primitives (useInView, Reveal, AnimatedNumber)"
```

---

### Task 2: Design tokens + HUD backdrop + core motion CSS

**Files:**
- Modify: `src/app/globals.css` (`:root` block lines 9–53; `.af-app::before` lines 155–166; append new sections at end of file)

**Interfaces:**
- Produces (CSS classes later tasks rely on): `.hud-panel`, `.hud-label`, `.reveal` / `.reveal--in`, `.btn--glow`, `.glow-edge` (gradient border), custom properties `--hud-grid`, `--scanline`, `--ease-spring`.

- [ ] **Step 1: Retune `:root` tokens**

In `src/app/globals.css`, inside `:root`, change `--bg` to `#05060a` and add after the `--ease-out` line:

```css
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --hud-grid: rgba(120, 150, 220, 0.05);
  --glass: rgba(16, 18, 26, 0.66);
  --glass-border: rgba(140, 170, 255, 0.16);
```

- [ ] **Step 2: Replace `.af-app::before` atmosphere with HUD backdrop**

Replace the existing `.af-app::before` rule (the `background:` with three radial-gradients) with:

```css
.af-app::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(52rem 30rem at 110% -8%, rgba(61, 220, 255, 0.08), transparent 62%),
    radial-gradient(46rem 30rem at -18% 4%, rgba(255, 45, 108, 0.07), transparent 60%),
    radial-gradient(50rem 34rem at 50% 118%, rgba(138, 92, 255, 0.06), transparent 62%),
    repeating-linear-gradient(0deg, var(--hud-grid) 0 1px, transparent 1px 56px),
    repeating-linear-gradient(90deg, var(--hud-grid) 0 1px, transparent 1px 56px);
}
```

- [ ] **Step 3: Append the motion + HUD utility layer at the end of globals.css**

```css
/* =========================================================
   Neon HUD motion layer + utilities
   ========================================================= */

/* Scroll-reveal: sections/cards fade-rise when entering the viewport.
   JS adds .reveal--in once; transitionDelay comes from inline style. */
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    opacity: 0;
    transform: translateY(14px);
    transition:
      opacity 480ms var(--ease-out),
      transform 480ms var(--ease-out);
  }
  .reveal--in {
    opacity: 1;
    transform: none;
  }
}

/* HUD micro-label — uppercase readout style for eyebrows/meta */
.hud-label {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

/* Glass HUD panel — translucent glass, blur, gradient-tinted edge */
.hud-panel {
  position: relative;
  background: var(--glass);
  backdrop-filter: blur(14px) saturate(160%);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    var(--shadow-sm);
}

/* Gradient edge glow — accent-tinted border via double background */
.glow-edge {
  border: 1px solid transparent;
  background:
    linear-gradient(var(--glass), var(--glass)) padding-box,
    linear-gradient(135deg,
      color-mix(in srgb, var(--a, var(--ring-exercise)) 55%, transparent),
      transparent 40%,
      transparent 60%,
      color-mix(in srgb, var(--a, var(--ring-exercise)) 30%, transparent)) border-box;
}

/* Primary CTA glow + press spring + ripple */
.btn--glow {
  box-shadow: var(--glow-green), inset 0 1px 0 rgba(255, 255, 255, 0.22);
  transition: transform 140ms var(--ease-spring), box-shadow 200ms var(--ease-out);
}
.btn--glow:active {
  transform: scale(0.96);
}
@media (hover: hover) {
  .btn--glow:hover {
    box-shadow: 0 0 28px rgba(52, 232, 96, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.22);
  }
}

/* Card edge-glow sweep on hover (desktop) / active (touch) */
@media (hover: hover) {
  .hud-hover {
    transition: transform 200ms var(--ease-out), box-shadow 240ms var(--ease-out);
  }
  .hud-hover:hover {
    transform: translateY(-3px);
    box-shadow:
      0 16px 36px rgba(0, 0, 0, 0.5),
      0 0 24px color-mix(in srgb, var(--a, var(--ring-exercise)) 24%, transparent);
  }
}
.hud-hover:active {
  transform: scale(0.985);
}

/* Ring completion pulse */
@media (prefers-reduced-motion: no-preference) {
  @keyframes ring-complete-pulse {
    0% { filter: drop-shadow(0 0 0 rgba(52, 232, 96, 0)); }
    40% { filter: drop-shadow(0 0 18px rgba(52, 232, 96, 0.55)); }
    100% { filter: drop-shadow(0 0 0 rgba(52, 232, 96, 0)); }
  }
  .ring-complete {
    animation: ring-complete-pulse 900ms var(--ease-out);
  }
}

/* Global press physics on buttons */
@media (prefers-reduced-motion: no-preference) {
  button, .btn, [role="button"] {
    transition: transform 140ms var(--ease-spring);
  }
  button:active, .btn:active, [role="button"]:active {
    transform: scale(0.97);
  }
}

/* Reduced motion: kill the new layer too */
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
  .ring-complete { animation: none; }
}
```

- [ ] **Step 4: Extend the existing reduced-motion block**

Find the existing `@media (prefers-reduced-motion: reduce)` block (near end of file) and ensure it sets `animation: none !important; transition: none !important;` broadly — if it already does, no change needed.

- [ ] **Step 5: Verify**

Run: `npm run build && npm run lint`
Expected: both pass.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css
git commit -m "style: neon HUD tokens, grid backdrop, motion utility layer"
```

---

### Task 3: App chrome — floating pill tab bar, HUD header, page transition

**Files:**
- Modify: `src/app/globals.css` (`.af-tabbar`, `.af-tabbar__inner`, `.af-tab`, `.af-header`, `.af-shell` page-in, desktop `@media (min-width: 1024px)` tab-bar rules)

**Interfaces:**
- Consumes: `--glass`, `--glass-border`, `--ease-spring` from Task 2.
- Produces: no new interfaces; restyles existing chrome classes.

- [ ] **Step 1: Floating pill tab bar**

Replace the `.af-tabbar, .bottom-nav` rule with a floating glass pill (mobile only — desktop sidebar rules live in the `@media (min-width: 1024px)` block and must keep their layout; read that block before editing and confine the pill styling to the base/mobile rules):

```css
.af-tabbar,
.bottom-nav {
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: var(--z-nav);
  padding: 0.5rem 0.75rem calc(0.6rem + var(--safe-b));
  background: transparent;
  border-top: none;
  pointer-events: none; /* pill re-enables events */
}

.af-tabbar__inner,
.bottom-nav-inner {
  pointer-events: auto;
  width: min(100%, 430px);
  margin-inline: auto;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.15rem;
  padding: 0.35rem;
  border-radius: 999px;
  background: var(--glass);
  backdrop-filter: blur(18px) saturate(180%);
  -webkit-backdrop-filter: blur(18px) saturate(180%);
  border: 1px solid var(--glass-border);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.55);
}
```

Note: the existing base rule `.af-tabbar__inner, .bottom-nav-inner` already sets width/grid — merge rather than duplicate; remove `background`/`backdrop-filter`/`border-top` from the old `.af-tabbar` rule.

- [ ] **Step 2: Bigger tab targets + icon pop**

Update `.af-tab, .nav-link`: `min-height: 3rem` (44px+), `padding: 0.45rem 0.15rem 0.4rem`, and add inside `@media (prefers-reduced-motion: no-preference)`:

```css
.af-tab[data-active="true"] svg,
.nav-link[data-active="true"] svg {
  animation: tab-pop 260ms var(--ease-spring);
}
@keyframes tab-pop {
  from { transform: scale(0.8); }
  to { transform: scale(1.1); }
}
```

- [ ] **Step 3: HUD header**

Update `.af-header`: background `rgba(5, 6, 10, 0.7)`, keep blur, add `border-bottom: 1px solid var(--glass-border)` and a 2px accent energy line via:

```css
.af-header::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--ring-exercise) 45%, transparent), transparent);
  opacity: 0.7;
}
```

- [ ] **Step 4: Upgrade page-enter animation**

Replace `@keyframes page-in` and the `.af-shell, .shell` animation with:

```css
@media (prefers-reduced-motion: no-preference) {
  @keyframes page-in {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.995);
      filter: blur(3px);
    }
  }
  .af-shell,
  .shell {
    animation: page-in 320ms var(--ease-out) backwards;
  }
}
```

Remove the old unconditional `animation: page-in 240ms …` declaration from `.af-shell, .shell`.

- [ ] **Step 5: Desktop check**

Read the `@media (min-width: 1024px)` block (starts near line 3174). Ensure the sidebar variant still pins the tab bar to the left edge as a sidebar — the pill border-radius and blur are fine there, but `border-radius: 999px` on `.af-tabbar__inner` must be overridden to `0` inside the desktop media query if the sidebar uses a full-height column. Add whatever override is needed; keep the phone pill untouched.

- [ ] **Step 6: Verify + commit**

Run: `npm run build && npm run lint`, then:

```bash
git add src/app/globals.css
git commit -m "style: floating pill tab bar, HUD header, page transition"
```

---

### Task 4: Home page — hero, animated stats, reveal stagger

**Files:**
- Modify: `src/app/HomeClient.tsx`
- Modify: `src/app/globals.css` (`.hero-chip`, `.af-tile`, `.af-large-title` additions)

**Interfaces:**
- Consumes: `Reveal` (Task 1), `AnimatedNumber` (Task 1), `.hud-label`, `.glow-edge`, `.hud-hover` (Task 2).

- [ ] **Step 1: Read HomeClient.tsx and identify** the summary header (rings + title), hero stat chips, and each tile section. Do not change data logic.

- [ ] **Step 2: Adopt motion primitives**

- Wrap each major section in `<Reveal>` with increasing `delay` (0, 80, 160ms…).
- Replace static numbers in `.hero-chip` `<strong>` elements with `<AnimatedNumber value={n} />` (only where the value is a plain number; keep strings as-is).
- Add class `hud-label` to `.af-eyebrow` elements (or restyle `.af-eyebrow` directly in CSS: uppercase, letter-spacing 0.14em — prefer restyling `.af-eyebrow` so all pages benefit).

- [ ] **Step 3: CSS — HUD tiles**

In globals.css, upgrade `.af-tile`: add the `.glow-edge` look directly (gradient border using existing `--a`), and add corner-notch detail on `.af-tile--large`:

```css
.af-tile--large::before {
  content: "";
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  width: 1.4rem;
  height: 1.4rem;
  border-top: 2px solid color-mix(in srgb, var(--a) 65%, transparent);
  border-right: 2px solid color-mix(in srgb, var(--a) 65%, transparent);
  border-top-right-radius: 6px;
  opacity: 0.8;
  z-index: 1;
}
```

(.af-tile already has `isolation: isolate`; the existing `::after` top rail stays.)

- [ ] **Step 4: Verify + commit**

Run: `npm run build && npm run lint`; visually check home at 375px via `npm run dev`.

```bash
git add src/app/HomeClient.tsx src/app/globals.css
git commit -m "feat: home hero with animated stats, HUD tiles, reveal stagger"
```

---

### Task 5: Path pages (`/path`, `/path/[programId]`)

**Files:**
- Modify: `src/components/LocalizedPages.tsx` (whichever exported components render the path index and program detail — read first)
- Modify: `src/components/WorkoutTile.tsx`

**Interfaces:**
- Consumes: `Reveal`, `.hud-hover` from earlier tasks.

- [ ] **Step 1:** Wrap session/program lists in `<Reveal>` stagger (delay = index × 60ms, cap at 300ms).
- [ ] **Step 2:** Add `hud-hover` to `.af-tile` elements in `WorkoutTile.tsx` (className append only).
- [ ] **Step 3:** Ensure any numeric badges (session counts, week numbers) render with `tabular-nums` — add `font-variant-numeric: tabular-nums` to `.af-tile__meta` in globals.css.
- [ ] **Step 4:** Verify + commit.

Run: `npm run build && npm run lint`

```bash
git add -A src/components src/app/globals.css
git commit -m "feat: path pages reveal stagger + HUD tile hover"
```

---

### Task 6: Library page

**Files:**
- Modify: `src/components/LibraryClient.tsx`
- Modify: `src/components/ExerciseCard.tsx`
- Modify: `src/app/globals.css` (filter chips, `.ex-card`)

**Interfaces:**
- Consumes: `Reveal`, `.glow-edge`, `.hud-hover`.

- [ ] **Step 1:** Filter chips/inputs: enforce `min-height: 44px` on chip buttons and the search field (CSS, in the exercise-cards/library section of globals.css).
- [ ] **Step 2:** `.ex-card` (exercise card, section near line 1579): add glass treatment — `background: var(--glass)`, `backdrop-filter` blur, `border: 1px solid var(--glass-border)`; add `.hud-hover`-equivalent hover lift to its existing hover rule.
- [ ] **Step 3:** Wrap the results grid in `Reveal` (stagger by index × 40ms, cap 240ms) in `LibraryClient.tsx`.
- [ ] **Step 4:** Verify + commit.

Run: `npm run build && npm run lint`

```bash
git add src/components/LibraryClient.tsx src/components/ExerciseCard.tsx src/app/globals.css
git commit -m "feat: library glass cards, 44px filter targets, reveal"
```

---

### Task 7: Body map + body-part pages

**Files:**
- Modify: `src/components/BodyMap.tsx`
- Modify: `src/components/BodyPartPageClient.tsx`
- Modify: `src/app/globals.css` (`.bodymap__card`, `.home-icon-card`)

**Interfaces:**
- Consumes: `Reveal`, `.hud-hover`.

- [ ] **Step 1:** `.bodymap__card` and `.home-icon-card`: glass background + blur (same recipe as Task 6 Step 2), keep the per-region accent border (`--region`).
- [ ] **Step 2:** Add `@media (prefers-reduced-motion: no-preference)` icon pop on card active:

```css
.bodymap__card:active .bodymap__card-icon,
.home-icon-card:active .home-icon-card__img {
  transform: scale(1.06);
  transition: transform 180ms var(--ease-spring);
}
```

- [ ] **Step 3:** Wrap card grids in `Reveal` stagger in both components.
- [ ] **Step 4:** Verify + commit.

Run: `npm run build && npm run lint`

```bash
git add src/components/BodyMap.tsx src/components/BodyPartPageClient.tsx src/app/globals.css
git commit -m "feat: glass body map cards with reveal + icon pop"
```

---

### Task 8: Learn pages + TeachStudio

**Files:**
- Modify: `src/components/PatternPageClient.tsx`
- Modify: `src/components/TeachStudio.tsx`
- Modify: `src/components/StepGuide.tsx`
- Modify: `src/app/globals.css` (`.guide-block`, step list)

**Interfaces:**
- Consumes: `Reveal`, `.hud-label`.

- [ ] **Step 1:** `.guide-block`: glass panel treatment (same recipe: `var(--glass)`, blur, `--glass-border`).
- [ ] **Step 2:** StepGuide numbered steps: add a HUD rail — a vertical 1px accent line on the left of the step list with glowing number dots:

```css
.step-guide__list {
  position: relative;
  padding-left: 1.1rem;
  border-left: 1px solid color-mix(in srgb, var(--ring-exercise) 30%, transparent);
}
```

(Read `StepGuide.tsx` first and match its actual class names; add the CSS to the teaching section of globals.css.)

- [ ] **Step 3:** `Reveal` on pattern cards and teach steps (stagger 60ms).
- [ ] **Step 4:** Verify + commit.

Run: `npm run build && npm run lint`

```bash
git add src/components/PatternPageClient.tsx src/components/TeachStudio.tsx src/components/StepGuide.tsx src/app/globals.css
git commit -m "feat: learn pages HUD step rail + glass guide blocks"
```

---

### Task 9: Exercise detail page

**Files:**
- Modify: `src/components/ExercisePageChrome.tsx`
- Modify: `src/components/ExerciseMeta.tsx`
- Modify: `src/components/MediaDemo.tsx` (class adoption only — do NOT touch the CDN fallback / `cdnIndex` logic)
- Modify: `src/app/globals.css` (media frame section near line 1365)

**Interfaces:**
- Consumes: `Reveal`, `.glow-edge`.

- [ ] **Step 1:** HUD corner brackets on the media frame — add to the media frame class (read the section "Media — fixed square" near line 1365 and use its actual selector):

```css
.media-stage::after {
  content: "";
  position: absolute;
  inset: 0.5rem;
  pointer-events: none;
  background:
    linear-gradient(var(--ring-stand), var(--ring-stand)) top left / 14px 2px,
    linear-gradient(var(--ring-stand), var(--ring-stand)) top left / 2px 14px,
    linear-gradient(var(--ring-stand), var(--ring-stand)) top right / 14px 2px,
    linear-gradient(var(--ring-stand), var(--ring-stand)) top right / 2px 14px,
    linear-gradient(var(--ring-stand), var(--ring-stand)) bottom left / 14px 2px,
    linear-gradient(var(--ring-stand), var(--ring-stand)) bottom left / 2px 14px,
    linear-gradient(var(--ring-stand), var(--ring-stand)) bottom right / 14px 2px,
    linear-gradient(var(--ring-stand), var(--ring-stand)) bottom right / 2px 14px;
  background-repeat: no-repeat;
  opacity: 0.55;
}
```

- [ ] **Step 2:** Meta chips in `ExerciseMeta.tsx`: `min-height: 44px` if tappable, `hud-label` style on labels.
- [ ] **Step 3:** `Reveal` on the sections below the media (meta, steps, substitutions).
- [ ] **Step 4:** Verify + commit.

Run: `npm run build && npm run lint`

```bash
git add src/components/ExercisePageChrome.tsx src/components/ExerciseMeta.tsx src/components/MediaDemo.tsx src/app/globals.css
git commit -m "feat: exercise detail HUD media brackets + reveal"
```

---

### Task 10: Workout + Quick session players

**Files:**
- Modify: `src/components/WorkoutSessionClient.tsx`
- Modify: `src/components/QuickSessionClient.tsx`
- Modify: `src/components/WorkoutClient.tsx`
- Modify: `src/components/RestRing.tsx` (class adoption only)
- Modify: `src/app/globals.css` (set-logging section near line 2567)

**Interfaces:**
- Consumes: `AnimatedNumber`, `.btn--glow`, `.glow-edge`.

- [ ] **Step 1:** Set/reps/weight controls: all stepper buttons and the "done set" button get `min-height: 48px; min-width: 48px` (CSS in the set-logging section).
- [ ] **Step 2:** Primary action (done set / start / next): add `btn--glow`, and anchor it to the bottom on phone — a sticky footer bar above the tab bar:

```css
.workout-cta-dock {
  position: sticky;
  bottom: calc(var(--nav-h) + var(--safe-b) + 0.5rem);
  z-index: var(--z-sticky);
  padding: 0.5rem 0;
}
```

(Read the workout components; add the dock wrapper around the existing primary button without changing its handler.)

- [ ] **Step 3:** Numeric readouts (set count, rest seconds if rendered as text, total volume): wrap in `AnimatedNumber` where they are plain numbers that change between renders. If a number updates every second (rest countdown), do NOT use AnimatedNumber — leave countdowns alone.
- [ ] **Step 4:** RestRing: add class `glow-edge` styling to its container (CSS only; do not touch timer logic).
- [ ] **Step 5:** Verify + commit.

Run: `npm run build && npm run lint`

```bash
git add src/components/WorkoutSessionClient.tsx src/components/QuickSessionClient.tsx src/components/WorkoutClient.tsx src/components/RestRing.tsx src/app/globals.css
git commit -m "feat: workout player glow CTA dock, 48px controls, animated stats"
```

---

### Task 11: History page

**Files:**
- Modify: `src/components/HistoryClient.tsx`
- Modify: `src/components/SummaryRings.tsx` (class adoption only)
- Modify: `src/app/globals.css` (history sections near lines 2826, 2925)

**Interfaces:**
- Consumes: `AnimatedNumber`, `Reveal`.

- [ ] **Step 1:** Stat totals (sessions, volume, streaks — the "History charts / PRs" and "History / Log page" sections): replace plain number renders with `AnimatedNumber` (skip anything that updates live).
- [ ] **Step 2:** Entry cards/rows: glass treatment (same recipe as Task 6 Step 2).
- [ ] **Step 3:** `Reveal` stagger on stat cards and the log list (index × 50ms, cap 250ms).
- [ ] **Step 4:** Add `ring-complete` class hook: if `SummaryRings` (or `ActivityRings`) knows a ring is at ≥100%, add the `ring-complete` class to that ring's `<svg>` for the completion pulse (CSS from Task 2). If completion state is not easily available, skip — do not add logic to compute it.
- [ ] **Step 5:** Verify + commit.

Run: `npm run build && npm run lint`

```bash
git add src/components/HistoryClient.tsx src/components/SummaryRings.tsx src/app/globals.css
git commit -m "feat: history animated stats, glass log cards, ring pulse"
```

---

### Task 12: Equipment pages

**Files:**
- Modify: `src/components/EquipmentPageClient.tsx`
- Modify: `src/app/globals.css` (equipment sections near lines 1097, 1138)

**Interfaces:**
- Consumes: `Reveal`, `.hud-hover`.

- [ ] **Step 1:** Machine tiles + equipment index rows: glass treatment (same recipe as Task 6 Step 2). Keep the existing horizontal drag/snap/fade/scrollbar rail behavior (`.af-h-scroll`) untouched.
- [ ] **Step 2:** `Reveal` on rows/tiles (stagger 50ms, cap 250ms).
- [ ] **Step 3:** Verify + commit.

Run: `npm run build && npm run lint`

```bash
git add src/components/EquipmentPageClient.tsx src/app/globals.css
git commit -m "feat: equipment glass tiles + reveal"
```

---

### Task 13: Tap-target sweep + mobile RWD audit + final verification

**Files:**
- Modify: `src/app/globals.css` (any selector failing the audit)

**Interfaces:**
- Consumes: everything above.

- [ ] **Step 1: Tap-target sweep.** Grep globals.css for interactive classes (`.lang-switch__btn`, `.chip`, `.section-link`, `.af-back`, list rows) and ensure each computes to ≥44px hit height; add `min-height` / `min-width` where missing. `.lang-switch__btn` currently has `min-height: 1.85rem` (~30px) — bump to `2.75rem` and adjust padding so the segmented control still looks right.

- [ ] **Step 2: Overflow audit.** Run `npm run dev`, then at 320px, 375px, 430px widths check every route (`/`, `/path`, `/learn`, `/library`, `/history`, `/equipment`, `/body`, one exercise detail, one workout session) for horizontal scroll or clipped content. Fix any offender — remember: single-column stacks must keep `grid-template-columns: minmax(0, 1fr)`, long titles keep `overflow-wrap: anywhere`.

- [ ] **Step 3: Desktop spot-check** at ≥1024px: sidebar layout intact, grids get reveal stagger, pill override from Task 3 Step 5 correct.

- [ ] **Step 4: Reduced-motion check.** Emulate `prefers-reduced-motion: reduce` in devtools; confirm no reveal/page/ripple animations run and all content is visible (`.reveal` must default to visible without JS-added class under reduced motion — CSS from Task 2 handles this).

- [ ] **Step 5: Final gate.**

Run: `npm run build && npm run lint`
Expected: both pass.

- [ ] **Step 6: Commit**

```bash
git add -A src
git commit -m "fix: tap targets 44px+, mobile overflow audit, RWD polish"
```

---

## Self-Review Notes

- **Spec coverage:** §1 visual language → Tasks 2, 3, 4.3; §2 motion → Tasks 1, 2, 3.4; §3 RWD → Tasks 3, 6.1, 10, 13; §4 pages → Tasks 4–12; §5 files → Tasks 1–12; §6 constraints → Global Constraints; §7 verification → Task 13.
- **No test suite exists in this repo** (per CLAUDE.md), so TDD steps are replaced by the project's own gate: `npm run build && npm run lint` plus manual viewport checks. This follows the repo's documented verification convention.
- Type/name consistency: `useInView`, `Reveal` (props `children, className, delay`), `AnimatedNumber` (props `value, duration, format`), CSS classes `.reveal/.reveal--in`, `.hud-panel`, `.hud-label`, `.hud-hover`, `.glow-edge`, `.btn--glow`, `.ring-complete`, `.workout-cta-dock` are used consistently across tasks.
