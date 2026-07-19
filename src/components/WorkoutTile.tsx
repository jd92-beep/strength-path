import Link from "next/link";
import { gradientForKey } from "@/lib/fitness-theme";

type Props = {
  href: string;
  title: string;
  subtitle: string;
  meta?: string;
  badge?: string;
  gradientKey?: string;
  large?: boolean;
};

export function WorkoutTile({
  href,
  title,
  subtitle,
  meta,
  badge,
  gradientKey,
  large,
}: Props) {
  const bg = gradientForKey(gradientKey || title);

  return (
    <Link
      href={href}
      className={`af-tile ${large ? "af-tile--large" : ""}`.trim()}
      style={{ background: bg }}
    >
      <div className="af-tile__veil" />
      <div className="af-tile__content">
        {badge ? <span className="af-tile__badge">{badge}</span> : null}
        <h3 className="af-tile__title">{title}</h3>
        <p className="af-tile__sub">{subtitle}</p>
        {meta ? <p className="af-tile__meta">{meta}</p> : null}
      </div>
    </Link>
  );
}
