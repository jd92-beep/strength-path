import Link from "next/link";
import { accentForKey } from "@/lib/fitness-theme";

type Props = {
  href: string;
  title: string;
  subtitle: string;
  meta?: string;
  badge?: string;
  /** Neon accent color; falls back to a stable hash of gradientKey/title */
  accent?: string;
  gradientKey?: string;
  /** Stage number watermark — only for genuinely ordered sequences */
  stage?: number;
  large?: boolean;
};

export function WorkoutTile({
  href,
  title,
  subtitle,
  meta,
  badge,
  accent,
  gradientKey,
  stage,
  large,
}: Props) {
  const a = accent ?? accentForKey(gradientKey || title);

  return (
    <Link
      href={href}
      className={`af-tile ${large ? "af-tile--large" : ""}`.trim()}
      style={{ ["--a" as string]: a }}
    >
      {typeof stage === "number" ? (
        <span className="af-tile__num" aria-hidden>
          {String(stage).padStart(2, "0")}
        </span>
      ) : null}
      <div className="af-tile__content">
        {badge ? <span className="af-tile__badge">{badge}</span> : null}
        <h3 className="af-tile__title">{title}</h3>
        <p className="af-tile__sub">{subtitle}</p>
        {meta ? <p className="af-tile__meta">{meta}</p> : null}
      </div>
    </Link>
  );
}
