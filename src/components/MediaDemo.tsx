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
 * Inline-only form player — never navigates, never opens another page.
 * Still + GIF layered in a fixed square, centered in the shell.
 * No dark overlays, no mix-blend, no dimming on play.
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

  const togglePlay = useCallback((e?: { preventDefault?: () => void; stopPropagation?: () => void }) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
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
  // Hide still once GIF is fully ready so layers never multiply/darken
  const showStill = !failed && stillReady && !(playing && gifReady);
  const showGif = playing && !gifFailed;

  return (
    <div
      className={`${sizeClass[size]} ${className}`.trim()}
      data-playing={playing ? "true" : "false"}
      data-loaded={stillReady || gifReady ? "true" : "false"}
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
          onClick={(e) => togglePlay(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              togglePlay(e);
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
                style={{
                  opacity: showStill || (!playing && stillReady) ? 1 : stillReady && playing && !gifReady ? 1 : 0,
                  visibility: stillFailed ? "hidden" : "visible",
                }}
              />
              {showGif ? (
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

        {playing && gifReady ? (
          <span className="media-demo__live" aria-hidden>
            Live
          </span>
        ) : null}

        {showControls && size !== "sm" && !failed ? (
          <button
            type="button"
            className="media-demo__orb"
            aria-label={playing ? (locale?.tr("pause") ?? "Pause") : (locale?.tr("play") ?? "Play")}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              togglePlay(e);
            }}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <rect x="6" y="5" width="4" height="14" rx="1.2" />
                <rect x="14" y="5" width="4" height="14" rx="1.2" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5.5v13a1 1 0 0 0 1.52.86l10.2-6.5a1 1 0 0 0 0-1.72L9.52 4.64A1 1 0 0 0 8 5.5z" />
              </svg>
            )}
          </button>
        ) : null}
      </div>

      {caption ? (
        <p className="media-demo__caption">
          {playing ? (locale?.tr("playingTap") ?? caption) : caption}
        </p>
      ) : null}
      <span id={uid} className="sr-only">
        {playing ? "Animation playing" : "Static form photo"}
      </span>
    </div>
  );
}
