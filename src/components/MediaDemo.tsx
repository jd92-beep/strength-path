"use client";

import { useCallback, useId, useState } from "react";
import { gifUrl, nextCdnIndex, thumbUrl } from "@/lib/media";
import { useLocaleOptional } from "@/lib/locale";

type Size = "sm" | "md" | "lg" | "hero";

type Props = {
  gifPath: string;
  imagePath: string;
  alt: string;
  autoPlay?: boolean;
  size?: Size;
  className?: string;
  showControls?: boolean;
  caption?: string;
};

const sizeClass: Record<Size, string> = {
  sm: "media-demo media-demo--sm",
  md: "media-demo media-demo--md",
  lg: "media-demo media-demo--lg",
  hero: "media-demo media-demo--hero",
};

/**
 * Inline-only player (no separate fullscreen page).
 * Still + GIF in a fixed square box, centered, no darkening overlays.
 * Tap image or Play/Pause to toggle. Unmounting GIF truly stops it.
 */
export function MediaDemo({
  gifPath,
  imagePath,
  alt,
  autoPlay = false,
  size = "md",
  className = "",
  showControls = true,
  caption,
}: Props) {
  const uid = useId();
  const locale = useLocaleOptional();
  const [playing, setPlaying] = useState(autoPlay);
  const [cdn, setCdn] = useState(0);
  const [loadedStill, setLoadedStill] = useState<string | null>(null);
  const [loadedGif, setLoadedGif] = useState<string | null>(null);
  const [failedStill, setFailedStill] = useState<string | null>(null);
  const [failedGif, setFailedGif] = useState<string | null>(null);

  const stillSrc = thumbUrl(imagePath, cdn);
  const animSrc = gifUrl(gifPath, cdn);
  const stillReady = loadedStill === stillSrc;
  const gifReady = loadedGif === animSrc;
  const stillFailed = failedStill === stillSrc;
  const gifFailed = failedGif === animSrc;

  const togglePlay = useCallback(() => {
    setPlaying((p) => !p);
  }, []);

  function onStillError() {
    const next = nextCdnIndex(cdn);
    if (next !== null) {
      setCdn(next);
      return;
    }
    setFailedStill(stillSrc);
  }

  function onGifError() {
    const next = nextCdnIndex(cdn);
    if (next !== null) {
      setCdn(next);
      return;
    }
    setFailedGif(animSrc);
    setPlaying(false);
  }

  const showSkeleton = !stillReady && !stillFailed;
  const failed = stillFailed && (!playing || gifFailed);

  return (
    <div
      className={`${sizeClass[size]} ${className}`.trim()}
      data-playing={playing}
      data-loaded={stillReady || gifReady}
    >
      <div className="media-demo__stage">
        <div
          className="media-demo__canvas"
          aria-busy={showSkeleton}
          role="button"
          tabIndex={0}
          aria-pressed={playing}
          aria-label={playing ? (locale?.tr("pause") ?? "Pause") : (locale?.tr("play") ?? "Play")}
          aria-controls={uid}
          onClick={togglePlay}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              togglePlay();
            }
          }}
        >
          {showSkeleton ? <div className="media-demo__skeleton" aria-hidden /> : null}

          {failed ? (
            <div
              className="media-demo__fallback"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <span>Demo unavailable</span>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ marginTop: "0.5rem" }}
                onClick={() => {
                  setCdn(0);
                  setFailedStill(null);
                  setFailedGif(null);
                  setLoadedStill(null);
                  setLoadedGif(null);
                }}
              >
                {locale?.tr("tryAgain") ?? "Retry"}
              </button>
            </div>
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={`still-${stillSrc}`}
                src={stillSrc}
                alt={alt}
                decoding="async"
                loading={size === "sm" ? "lazy" : "eager"}
                draggable={false}
                onLoad={() => setLoadedStill(stillSrc)}
                onError={onStillError}
                className="media-demo__img media-demo__img--still"
                style={{ opacity: stillReady && !(playing && gifReady) ? 1 : playing && !gifReady ? 1 : stillReady ? 1 : 0 }}
              />
              {playing && !gifFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`gif-${animSrc}`}
                  src={animSrc}
                  alt=""
                  decoding="async"
                  draggable={false}
                  onLoad={() => setLoadedGif(animSrc)}
                  onError={onGifError}
                  className="media-demo__img media-demo__img--gif"
                  style={{ opacity: gifReady ? 1 : 0 }}
                />
              ) : null}
            </>
          )}
        </div>

        {showControls && size !== "sm" && !failed ? (
          <div className="media-demo__toolbar">
            <button
              type="button"
              className="media-ctrl media-ctrl--solid"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
            >
              {playing
                ? (locale?.tr("pause") ?? "Pause")
                : (locale?.tr("play") ?? "Play")}
            </button>
          </div>
        ) : null}
      </div>

      {caption ? <p className="media-demo__caption">{caption}</p> : null}
      <span id={uid} className="sr-only">
        {playing ? "Animation playing" : "Static form photo"}
      </span>
    </div>
  );
}
