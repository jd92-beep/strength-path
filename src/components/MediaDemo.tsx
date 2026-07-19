"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { gifUrl, nextCdnIndex, thumbUrl } from "@/lib/media";

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
 * Dual-layer player: still always mounted; GIF only while playing (unmount = stop).
 * Tap stage to play/pause. Fixed frame never expands the page.
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
  const [playing, setPlaying] = useState(autoPlay);
  const [cdn, setCdn] = useState(0);
  const [loadedStill, setLoadedStill] = useState<string | null>(null);
  const [loadedGif, setLoadedGif] = useState<string | null>(null);
  const [failedStill, setFailedStill] = useState<string | null>(null);
  const [failedGif, setFailedGif] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  const stillSrc = thumbUrl(imagePath, cdn);
  const animSrc = gifUrl(gifPath, cdn);

  const stillReady = loadedStill === stillSrc;
  const gifReady = loadedGif === animSrc;
  const stillFailed = failedStill === stillSrc;
  const gifFailed = failedGif === animSrc;

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [fullscreen]);

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
    <>
      <div
        className={`${sizeClass[size]} ${className}`.trim()}
        data-playing={playing}
        data-loaded={stillReady || gifReady}
      >
        <div className="media-demo__stage">
          <button
            type="button"
            className="media-demo__hit"
            onClick={togglePlay}
            aria-pressed={playing}
            aria-label={playing ? "Pause form demo" : "Play form demo"}
            aria-controls={uid}
          >
            <div className="media-demo__canvas" aria-busy={showSkeleton}>
              {showSkeleton ? <div className="media-demo__skeleton" aria-hidden /> : null}

              {failed ? (
                <div
                  className="media-demo__fallback"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  role="presentation"
                >
                  <span>Demo unavailable</span>
                  <span className="faint">Could not load form media</span>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ marginTop: "0.5rem" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCdn(0);
                      setFailedStill(null);
                      setFailedGif(null);
                      setLoadedStill(null);
                      setLoadedGif(null);
                    }}
                  >
                    Retry
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
                    style={{ opacity: stillReady ? 1 : 0 }}
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

            {showControls && !failed ? (
              <div className="media-demo__chrome" aria-hidden>
                <div className="media-demo__badges">
                  <span className="media-badge">
                    {playing ? "Playing · tap to pause" : "Photo · tap to play"}
                  </span>
                </div>
                <div className="media-demo__play-orb media-demo__play-orb--overlay">
                  {playing ? (
                    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden>
                      <rect x="6" y="5" width="4" height="14" rx="1" />
                      <rect x="14" y="5" width="4" height="14" rx="1" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden>
                      <path d="M9 7.2v9.6L17.5 12 9 7.2z" />
                    </svg>
                  )}
                </div>
              </div>
            ) : null}
          </button>

          {showControls && size !== "sm" && !failed ? (
            <div className="media-demo__toolbar">
              <button type="button" className="media-ctrl" onClick={togglePlay}>
                {playing ? "Pause" : "Play"}
              </button>
              <button type="button" className="media-ctrl" onClick={() => setFullscreen(true)}>
                Expand
              </button>
            </div>
          ) : null}
        </div>

        {caption ? <p className="media-demo__caption">{caption}</p> : null}
        <span id={uid} className="sr-only">
          {playing ? "Animation playing" : "Static form photo"}
        </span>
      </div>

      {fullscreen ? (
        <div className="media-fs" role="dialog" aria-modal="true" aria-label={`${alt} full screen`}>
          <div className="media-fs__bar">
            <p className="media-fs__title">{alt}</p>
            <div className="media-fs__bar-actions">
              <button type="button" className="media-ctrl" onClick={togglePlay}>
                {playing ? "Pause" : "Play"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setFullscreen(false)}>
                Close
              </button>
            </div>
          </div>
          <div className="media-fs__stage">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={stillSrc} alt={alt} className="media-fs__img" />
            {playing && !gifFailed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={animSrc} alt="" className="media-fs__img media-fs__img--gif" />
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
