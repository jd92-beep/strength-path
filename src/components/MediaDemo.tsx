"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { gifUrl, thumbUrl } from "@/lib/media";

type Size = "sm" | "md" | "lg" | "hero";

type Props = {
  gifPath: string;
  imagePath: string;
  alt: string;
  /** Autoplay animation when mounted (detail / workout). Cards default off. */
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
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const staticSrc = thumbUrl(imagePath);
  const animSrc = gifUrl(gifPath);
  const src = playing ? animSrc : staticSrc;

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [src, gifPath, imagePath]);

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

  const stage = (
    <div
      className={`${sizeClass[size]} ${className}`.trim()}
      data-playing={playing}
      data-loaded={loaded}
      data-failed={failed}
    >
      <div className="media-demo__stage">
        <div className="media-demo__canvas" aria-busy={!loaded && !failed}>
          {!loaded && !failed ? <div className="media-demo__skeleton" aria-hidden /> : null}
          {failed ? (
            <div className="media-demo__fallback">
              <span>Demo unavailable</span>
              <span className="faint">Check connection and retry</span>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt={alt}
              decoding="async"
              loading={size === "sm" ? "lazy" : "eager"}
              onLoad={() => setLoaded(true)}
              onError={() => {
                setFailed(true);
                setLoaded(true);
              }}
              className="media-demo__img"
              style={{ opacity: loaded ? 1 : 0 }}
            />
          )}
        </div>

        {showControls && !failed ? (
          <div className="media-demo__chrome">
            <div className="media-demo__badges">
              <span className="media-badge">{playing ? "Playing demo" : "Form still"}</span>
              {playing ? <span className="media-badge media-badge--pulse">Loop</span> : null}
            </div>
            <div className="media-demo__actions">
              <button
                type="button"
                className="media-ctrl"
                onClick={togglePlay}
                aria-pressed={playing}
                aria-controls={uid}
                aria-label={playing ? "Pause animation" : "Play form demo"}
              >
                {playing ? (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
                    <rect x="6" y="5" width="4" height="14" rx="1" />
                    <rect x="14" y="5" width="4" height="14" rx="1" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
                    <path d="M8 5.5v13l11-6.5L8 5.5z" />
                  </svg>
                )}
              </button>
              {size !== "sm" ? (
                <button
                  type="button"
                  className="media-ctrl"
                  onClick={() => setFullscreen(true)}
                  aria-label="Expand demo"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" strokeLinecap="round" />
                  </svg>
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {!playing && showControls && !failed && size !== "sm" ? (
          <button
            type="button"
            className="media-demo__play-cta"
            onClick={() => setPlaying(true)}
            aria-label="Play form demo"
          >
            <span className="media-demo__play-orb">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden>
                <path d="M9 7.2v9.6L17.5 12 9 7.2z" />
              </svg>
            </span>
            <span>Watch form</span>
          </button>
        ) : null}
      </div>

      {caption ? <p className="media-demo__caption">{caption}</p> : null}
      <span id={uid} className="sr-only">
        {playing ? "Animation playing" : "Static form image"}
      </span>
    </div>
  );

  return (
    <>
      {stage}
      {fullscreen ? (
        <div
          className="media-fs"
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} full screen demo`}
        >
          <div className="media-fs__bar">
            <p className="media-fs__title">{alt}</p>
            <div className="media-fs__bar-actions">
              <button type="button" className="media-ctrl" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
                {playing ? "Pause" : "Play"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setFullscreen(false)}>
                Close
              </button>
            </div>
          </div>
          <div className="media-fs__stage">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className="media-fs__img" />
          </div>
        </div>
      ) : null}
    </>
  );
}
