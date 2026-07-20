"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { WorkoutTile } from "@/components/WorkoutTile";
import { ExercisePhoto } from "@/components/ExercisePhoto";
import { ScrollRail } from "@/components/ScrollRail";
import { BodyMap } from "@/components/BodyMap";
import { ExerciseCard } from "@/components/ExerciseCard";
import { useLocale } from "@/lib/locale";
import type { Program, Session, Exercise } from "@/lib/types";
import {
  levelLabel,
  localizedPattern,
  localizedProgram,
  localizedSession,
  stageBadge,
} from "@/lib/localize";
import type { MovementPattern } from "@/lib/teaching";
import { BODY_PARTS } from "@/lib/body-parts";

const BODY_YUE: Record<string, string> = {
  chest: "胸",
  back: "背",
  "upper legs": "腿",
  shoulders: "膊頭",
  "upper arms": "手臂",
  waist: "核心",
  "lower legs": "小腿",
  "lower arms": "前臂",
  cardio: "心肺",
  neck: "頸",
};

export function PathPageClient({ programs }: { programs: Program[] }) {
  const { tr, mode } = useLocale();
  return (
    <AppShell title={tr("workouts")} backHref="/">
      <div className="af-stack">
        <div>
          <p className="af-eyebrow">{mode === "yue" ? "計劃" : mode === "both" ? "Programs · 計劃" : "Programs"}</p>
          <h1 className="af-large-title" style={{ fontSize: "1.85rem" }}>
            {tr("strengthPath")}
          </h1>
          <p className="af-caption" style={{ marginTop: "0.45rem" }}>
            {mode === "yue"
              ? "由打好基礎 → 啞鈴力量 → 槓鈴四大項，一步一步上。每個階段都有引導課堂。"
              : mode === "both"
                ? "Climb Foundation → Dumbbell → Barbell. 由打好基礎 → 啞鈴 → 槓鈴。"
                : "Climb Foundation → Dumbbell → Barbell. Each stage is a guided multi-session plan."}
          </p>
        </div>
        <div className="af-tile-stack">
          {programs.map((program, i) => {
            const p = localizedProgram(program, mode);
            return (
              <WorkoutTile
                key={program.id}
                large={i === 0}
                href={`/path/${program.id}`}
                title={p.title}
                subtitle={p.tagline}
                meta={`${program.sessions.length} ${tr("workoutsCount")} · ${program.weeks}${mode === "yue" ? " 星期" : " weeks"} · ${p.equipment}`}
                badge={stageBadge(i, program.level, mode)}
                accent={program.color}
                stage={i + 1}
              />
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

export function ProgramPageClient({
  program,
  sessionsWithMoves,
}: {
  program: Program;
  sessionsWithMoves: { session: Session; moves: Exercise[] }[];
}) {
  const { tr, mode } = useLocale();
  const p = localizedProgram(program, mode);

  return (
    <AppShell title={p.title} backHref="/path">
      <div className="af-stack">
        <section
          className="af-tile af-tile--large"
          style={{ ["--a" as string]: program.color, minHeight: "11rem" }}
        >
          <div className="af-tile__content">
            <span className="af-tile__badge">{levelLabel(program.level, mode)}</span>
            <h1 className="af-tile__title" style={{ fontSize: "1.85rem" }}>
              {p.title}
            </h1>
            <p className="af-tile__sub">{p.tagline}</p>
            <p className="af-tile__meta">
              {program.weeks}
              {mode === "yue" ? " 星期" : " weeks"} · {program.sessions.length}{" "}
              {tr("sessions")} · {p.equipment}
            </p>
          </div>
        </section>

        <p className="muted" style={{ margin: 0, fontSize: "0.95rem", whiteSpace: "pre-line" }}>
          {p.description}
        </p>

        <section>
          <div className="af-section-head">
            <h2>{mode === "yue" ? "課堂" : mode === "both" ? "Sessions · 課堂" : "Sessions"}</h2>
          </div>
          <div className="af-stack-sm">
            {sessionsWithMoves.map(({ session, moves }, idx) => {
              const s = localizedSession(program.id, session, mode);
              return (
                <article
                  key={session.id}
                  className="surface"
                  style={{ padding: "1rem", borderRadius: "18px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                      marginBottom: "0.35rem",
                    }}
                  >
                    <span className="faint" style={{ fontWeight: 700, fontSize: "0.78rem" }}>
                      {mode === "yue" ? `訓練 ${idx + 1}` : `WORKOUT ${idx + 1}`}
                    </span>
                    <span className="muted" style={{ fontSize: "0.8rem" }}>
                      {session.durationMin} {mode === "yue" ? "分鐘" : "MIN"}
                    </span>
                  </div>
                  <h3 className="display" style={{ margin: "0 0 0.3rem", fontSize: "1.2rem" }}>
                    {s.title}
                  </h3>
                  <p className="muted" style={{ margin: "0 0 0.85rem", fontSize: "0.9rem" }}>
                    {s.focus}
                  </p>
                  <ScrollRail style={{ marginBottom: "0.85rem" }}>
                    {moves.map((m) => (
                      <Link
                        key={m.id}
                        href={`/exercise/${m.id}`}
                        style={{ flex: "0 0 auto", width: "4.5rem", textAlign: "center" }}
                      >
                        <div
                          style={{
                            width: "4.5rem",
                            height: "4.5rem",
                            borderRadius: "14px",
                            overflow: "hidden",
                            background: "#111",
                            marginBottom: "0.3rem",
                          }}
                        >
                          <ExercisePhoto
                            imagePath={m.image}
                            bodyPart={m.body_part}
                            alt=""
                            width={72}
                            height={72}
                            className="ex-thumb"
                          />
                        </div>
                        <span
                          className="faint"
                          style={{
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {m.name}
                        </span>
                      </Link>
                    ))}
                  </ScrollRail>
                  <Link href={`/workout/${session.id}`} className="btn btn-primary btn-block btn-lg">
                    {tr("letsGo")}
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

export function LearnPageClient({
  items,
}: {
  items: { id: string; label: string; skillFocus: string; color: string; count: number }[];
}) {
  const { tr, mode } = useLocale();
  return (
    <AppShell title={tr("library")} backHref="/">
      <div className="af-stack">
        <div>
          <p className="af-eyebrow">{tr("formLibrary")}</p>
          <h1 className="af-large-title" style={{ fontSize: "1.85rem" }}>
            {tr("patterns")}
          </h1>
          <p className="af-caption" style={{ marginTop: "0.45rem" }}>
            {mode === "yue"
              ? "好似教練咁學：睇示範、鎖死要點、改錯，再升級。"
              : mode === "both"
                ? "Learn like a coach. 好似教練咁學：睇示範、要點、改錯、升級。"
                : "Learn like a coach: watch the demo, lock setup cues, fix mistakes, then level up."}
          </p>
        </div>
        <div className="af-tile-stack">
          {items.map((p) => {
            const loc = localizedPattern(
              p.id as MovementPattern,
              p.label,
              p.skillFocus,
              mode,
            );
            return (
              <WorkoutTile
                key={p.id}
                href={`/learn/${p.id}`}
                title={loc.label}
                subtitle={loc.skillFocus}
                meta={`${p.count} ${mode === "yue" ? "個示範" : "demos"}`}
                badge={mode === "yue" ? "模式" : "Pattern"}
                accent={p.color}
              />
            );
          })}
        </div>
        <Link href="/library" className="btn btn-ghost btn-block">
          {mode === "yue" ? "搜尋全部動作" : mode === "both" ? "Search all · 搜尋全部" : "Search all exercises"}
        </Link>
      </div>
    </AppShell>
  );
}

export function BodyPageClient({ counts }: { counts: Record<string, number> }) {
  const { tr, mode } = useLocale();
  return (
    <AppShell title={tr("byBody")} backHref="/">
      <div className="stack-md">
        <p className="muted" style={{ margin: 0 }}>
          {mode === "yue"
            ? "撳一個部位。每頁教你點練，再列出示範 GIF。"
            : mode === "both"
              ? "Tap a region. 撳部位睇教學同示範。"
              : "Tap a region. Each page teaches how to train it, then lists demos with form GIFs."}
        </p>
        <BodyMap counts={counts} />
      </div>
    </AppShell>
  );
}

export function LibraryPageClient({
  results,
  q,
  body,
  equipment,
  target,
  equipmentOptions,
  targetOptions,
}: {
  results: Exercise[];
  q: string;
  body: string;
  equipment: string;
  target: string;
  equipmentOptions: string[];
  targetOptions: string[];
}) {
  const { tr, mode } = useLocale();
  return (
    <AppShell title={tr("search")} backHref="/">
      <div className="stack-md">
        <p className="muted" style={{ margin: 0, fontSize: "0.92rem" }}>
          {mode === "yue"
            ? "搜尋成個 1,324 動作庫。用部位、器材、目標肌篩選。"
            : "Search the full 1,324-exercise catalog. Filter by body part, equipment, or target."}
        </p>
        <form action="/library" method="get" className="stack">
          <input
            id="q"
            name="q"
            className="field"
            defaultValue={q}
            placeholder={mode === "yue" ? "搜動作名、肌肉、器材…" : "Search name, muscle, equipment…"}
          />
          <div className="library-filter-grid">
            <label className="library-filter-label">
              {tr("bodyPart")}
              <select name="body" defaultValue={body} className="select-field">
                <option value="">{tr("all")}</option>
                {BODY_PARTS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {mode === "yue" ? BODY_YUE[b.id] || b.label : b.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="library-filter-label">
              {tr("equipment")}
              <select name="equipment" defaultValue={equipment} className="select-field">
                <option value="">{tr("all")}</option>
                {equipmentOptions.map((eq) => (
                  <option key={eq} value={eq}>
                    {eq}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label style={{ display: "grid", gap: "0.25rem", fontSize: "0.78rem", color: "var(--ink-muted)" }}>
            {tr("targetMuscle")}
            <select name="target" defaultValue={target} className="select-field">
              <option value="">{tr("all")}</option>
              {targetOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn btn-primary btn-block btn-lg">
            {tr("filterDemos")}
          </button>
        </form>
        {(q || body || equipment || target) && (
          <p className="muted" style={{ margin: 0, fontSize: "0.88rem" }}>
            {results.length} ·{" "}
            <Link href="/library" className="section-link">
              {tr("clear")}
            </Link>
          </p>
        )}
        <div className="stack">
          {results.map((ex, i) => (
            <ExerciseCard key={ex.id} exercise={ex} featured={i === 0 && !q && !body} />
          ))}
        </div>
        {!results.length ? (
          <div className="surface" style={{ padding: "1.35rem", textAlign: "center" }}>
            <p className="display">{tr("noMatches")}</p>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
