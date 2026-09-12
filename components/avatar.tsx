"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { EASE, useReducedMotion } from "@/components/motion";

/* ------------------------------------------------------------------ */
/* Avatar                                                              */
/*                                                                     */
/* A portrait that is allowed to be missing. Same reasoning as          */
/* project-media.tsx: under `output: "export"` next/image resolves and  */
/* measures the file at build time and hard-fails when it is not there, */
/* which would make "no photo yet" a build error. A plain <img> just    */
/* fires onError, and we swap in a monogram that looks like a decision  */
/* rather than a broken image.                                          */
/* ------------------------------------------------------------------ */

export interface AvatarProps {
  /** Public-root path, e.g. "/profile/avatar.jpg". */
  src: string;
  /** Monogram shown until (or unless) the photo loads, e.g. "PF". */
  initials: string;
  /** Real alt text — also the accessible name of the monogram fallback. */
  alt: string;
  /** Sizing lands here; the portrait is always square inside it. */
  className?: string;
}

type Status = "loading" | "loaded" | "missing";

/**
 * The rotating ring. A conic sweep that fades out at 0deg/360deg so the seam
 * is invisible while it turns — a hard stop there would strobe once a cycle.
 */
const RING_GRADIENT =
  "conic-gradient(from 0deg, rgba(139,92,246,0) 0deg, #8b5cf6 65deg, #6366f1 155deg, #06b6d4 235deg, #22d3ee 300deg, rgba(139,92,246,0) 360deg)";

/** Ambient violet bloom behind the whole portrait. */
const GLOW =
  "radial-gradient(circle at 50% 42%, rgba(139,92,246,0.34), rgba(99,102,241,0.16) 42%, rgba(6,182,212,0.10) 62%, transparent 76%)";

/** Two-point wash under the monogram so the fallback is not a flat disc. */
const MONOGRAM_WASH =
  "radial-gradient(circle at 28% 22%, rgba(139,92,246,0.32), transparent 58%), radial-gradient(circle at 78% 82%, rgba(6,182,212,0.22), transparent 55%)";

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function Avatar({ src, initials, alt, className }: AvatarProps) {
  const [status, setStatus] = useState<Status>("loading");
  const imgRef = useRef<HTMLImageElement | null>(null);
  const reduce = useReducedMotion();

  // The page is statically exported, so the request can finish (or fail)
  // before React hydrates — in which case neither onLoad nor onError ever
  // fires. Settle from the element's own state once on mount: `complete`
  // with a zero naturalWidth is exactly the "no photo yet" case.
  useEffect(() => {
    const node = imgRef.current;
    if (!node || !node.complete) return;
    setStatus(node.naturalWidth > 0 ? "loaded" : "missing");
  }, []);

  const missing = status === "missing";
  // Opacity is tied to the load, not to the motion preference: revealing an
  // unloaded <img> would flash the browser's broken-image glyph over the
  // monogram for a frame. Reduced motion drops the fade, not the gate.
  const loaded = status === "loaded";
  const dropPath = src.startsWith("/") ? `public${src}` : src;

  return (
    <div className={cx("relative", className)}>
      {/* Ambient bloom. Sits outside the disc and behind everything. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 rounded-full blur-2xl"
        style={{ backgroundImage: GLOW }}
      />

      <div className="relative aspect-square w-full">
        {/* Rotating gradient ring — the one showy moment. 14s per turn. */}
        <div
          aria-hidden
          className={cx(
            "pointer-events-none absolute inset-0 rounded-full",
            reduce ? "" : "animate-spin-slow"
          )}
          style={{ backgroundImage: RING_GRADIENT }}
        />
        {/* A constant hairline underneath, so the ring never fully vanishes
            at the gradient's transparent stop. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/[0.12]"
        />

        {/* The portrait, masked over the ring: only ~3px of gradient shows. */}
        <div className="absolute inset-[3px] overflow-hidden rounded-full bg-ink-900">
          {/* Monogram — visible while loading, and permanently if missing.
              It only claims the accessible name when it is the real content;
              otherwise the <img> below carries it and this is decoration. */}
          <div
            role={missing ? "img" : undefined}
            aria-label={missing ? alt : undefined}
            aria-hidden={missing ? undefined : true}
            title={missing ? `Profile photo not found — drop one at ${dropPath}` : undefined}
            className={cx(
              "absolute inset-0 grid place-items-center transition-opacity duration-700 ease-apple-out",
              loaded ? "opacity-0" : "opacity-100"
            )}
          >
            <div aria-hidden className="dot-grid absolute inset-0 opacity-70" />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ backgroundImage: MONOGRAM_WASH }}
            />
            <span className="relative select-none text-[clamp(2.25rem,6vw,3.5rem)] font-semibold leading-none tracking-[-0.07em] text-chalk/90">
              {initials}
            </span>
          </div>

          {missing ? null : (
            <motion.img
              ref={imgRef}
              src={src}
              alt={alt}
              width={600}
              height={600}
              decoding="async"
              draggable={false}
              onLoad={() => setStatus("loaded")}
              onError={() => setStatus("missing")}
              className="absolute inset-0 h-full w-full rounded-full object-cover"
              initial={reduce ? false : { opacity: 0, scale: 1.04 }}
              animate={loaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
              transition={reduce ? { duration: 0 } : { duration: 0.6, ease: EASE }}
            />
          )}

          {/* Inner vignette — keeps the photo edge from fighting the ring. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-ink-950/50"
          />
        </div>
      </div>

      {/* Discreet, but it tells the owner exactly what to do. */}
      {missing ? (
        <p className="mt-3 text-center font-mono text-[0.625rem] leading-relaxed text-chalk-faint/70">
          Photo goes at <span className="select-all break-all">{dropPath}</span>
        </p>
      ) : null}
    </div>
  );
}

export default Avatar;
