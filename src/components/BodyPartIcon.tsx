import { bodyPartIcon } from "@/lib/media";

/** Always shows the AI-generated body-part icon (never falls back away from it). */
export function BodyPartIcon({
  bodyPart,
  size = 40,
  className = "",
  alt = "",
}: {
  bodyPart: string;
  size?: number;
  className?: string;
  alt?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={bodyPartIcon(bodyPart)}
      alt={alt}
      width={size}
      height={size}
      className={`bp-icon ${className}`.trim()}
      draggable={false}
      loading="lazy"
    />
  );
}
