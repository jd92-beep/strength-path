"use client";

import { useState } from "react";
import { bodyPartIcon, nextCdnIndex, thumbUrl } from "@/lib/media";

/** Still photo for an exercise with CDN fallback + body-part illustrated icon fallback. */
export function ExercisePhoto({
  imagePath,
  bodyPart,
  alt,
  className = "",
  width,
  height,
}: {
  imagePath: string;
  bodyPart: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  const [cdn, setCdn] = useState(0);
  const [useIcon, setUseIcon] = useState(false);
  const src = useIcon ? bodyPartIcon(bodyPart) : thumbUrl(imagePath, cdn);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={className}
      draggable={false}
      onError={() => {
        if (useIcon) return;
        const next = nextCdnIndex(cdn);
        if (next !== null) setCdn(next);
        else setUseIcon(true);
      }}
    />
  );
}
