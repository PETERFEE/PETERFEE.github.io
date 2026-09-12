/**
 * decor.tsx — the site's decorative vocabulary, in one place.
 *
 * Every export here is purely presentational: no hooks, no framer-motion, no
 * "use client". That is deliberate — `ambient-field.tsx` is a server component
 * that must ship zero JS, and it is built entirely out of these primitives.
 * Anything that needs scroll-linked motion does it with CSS, never rAF.
 *
 * Two house rules are enforced throughout:
 *   1. Tailwind class names are only ever whole literal strings, resolved
 *      through static lookup maps. The JIT cannot see a template literal.
 *   2. Everything is `aria-hidden` + `pointer-events-none`. Decoration is
 *      never announced and never intercepts a click.
 *
 * Placement contract: these are absolutely positioned and frequently larger
 * than the viewport. Always render them inside a `relative overflow-hidden`
 * parent, or they will widen the page.
 */

import type { CSSProperties } from "react";

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ */
/* Orb — a soft radial bloom.                                          */
/* ------------------------------------------------------------------ */

export type OrbColor = "violet" | "cyan" | "signal" | "amber";
export type OrbSize = "sm" | "md" | "lg" | "xl";
export type OrbPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "left"
  | "center"
  | "right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

/**
 * Painted as a radial-gradient rather than a blurred disc: `filter: blur()`
 * on a 90vmax element is a genuinely expensive raster, a gradient is free.
 * Alphas here are the *shape* of the falloff; the `opacity` prop scales the
 * whole thing, so the defaults look correct at ~0.16.
 */
const ORB_COLOR: Record<OrbColor, string> = {
  violet:
    "radial-gradient(closest-side, rgba(139,92,246,0.55) 0%, rgba(139,92,246,0.24) 38%, rgba(139,92,246,0) 72%)",
  cyan:
    "radial-gradient(closest-side, rgba(6,182,212,0.55) 0%, rgba(6,182,212,0.22) 38%, rgba(6,182,212,0) 72%)",
  signal:
    "radial-gradient(closest-side, rgba(41,151,255,0.5) 0%, rgba(41,151,255,0.2) 38%, rgba(41,151,255,0) 72%)",
  amber:
    "radial-gradient(closest-side, rgba(245,165,36,0.42) 0%, rgba(245,165,36,0.16) 38%, rgba(245,165,36,0) 72%)",
};

/** vmax so an orb is proportional to the larger viewport axis on every device. */
const ORB_SIZE: Record<OrbSize, string> = {
  sm: "h-[34vmax] w-[34vmax]",
  md: "h-[52vmax] w-[52vmax]",
  lg: "h-[72vmax] w-[72vmax]",
  xl: "h-[92vmax] w-[92vmax]",
};

const ORB_POSITION: Record<OrbPosition, string> = {
  "top-left": "-top-[20vmax] -left-[16vmax]",
  "top-center": "-top-[26vmax] left-1/2 -translate-x-1/2",
  "top-right": "-top-[20vmax] -right-[16vmax]",
  left: "top-1/2 -left-[22vmax] -translate-y-1/2",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  right: "top-1/2 -right-[22vmax] -translate-y-1/2",
  "bottom-left": "-bottom-[20vmax] -left-[16vmax]",
  "bottom-center": "-bottom-[26vmax] left-1/2 -translate-x-1/2",
  "bottom-right": "-bottom-[20vmax] -right-[16vmax]",
};

export interface OrbProps {
  color?: OrbColor;
  size?: OrbSize;
  position?: OrbPosition;
  /** 0–1, multiplied into the falloff above. Keep it low; these are big. */
  opacity?: number;
  /** Slow parallax-free wander using the shared `drift` keyframe. */
  drift?: boolean;
  /** Seconds. Give each drifting orb its own so they never visibly sync. */
  driftDuration?: number;
  /** Seconds; negative values start the cycle mid-way. */
  driftDelay?: number;
  /** Extra positioning classes. Literal strings only. */
  className?: string;
}

export function Orb({
  color = "violet",
  size = "lg",
  position = "top-right",
  opacity = 0.16,
  drift = false,
  driftDuration,
  driftDelay,
  className,
}: OrbProps) {
  const style: CSSProperties = { backgroundImage: ORB_COLOR[color], opacity };

  // Longhands, not the `animation` shorthand: the class supplies the keyframe
  // name (which is also what makes Tailwind emit @keyframes drift at all), and
  // the global prefers-reduced-motion rule can still win with !important.
  if (drift && driftDuration !== undefined) style.animationDuration = `${driftDuration}s`;
  if (drift && driftDelay !== undefined) style.animationDelay = `${driftDelay}s`;

  // Two boxes on purpose: the outer one owns the placement (which often needs
  // a centring translate), the inner one owns the animation (whose keyframes
  // set `transform` and would otherwise clobber that translate).
  return (
    <div
      aria-hidden
      className={cx("pointer-events-none absolute", ORB_SIZE[size], ORB_POSITION[position], className)}
    >
      <div
        className={cx(
          "h-full w-full rounded-full",
          drift && "animate-drift will-transform motion-reduce:animate-none"
        )}
        style={style}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* GridPanel — masked dot / blueprint texture.                         */
/* ------------------------------------------------------------------ */

export type GridVariant = "dot" | "blueprint";
export type GridFade = "bottom" | "top" | "edges" | "radial" | "none";

const GRID_VARIANT: Record<GridVariant, string> = {
  dot: "dot-grid",
  blueprint: "blueprint-grid",
};

/** Applied inline so one code path covers every direction, including the
 *  top fade that has no utility in globals.css. */
const GRID_MASK: Record<GridFade, string | null> = {
  bottom: "linear-gradient(to bottom, #000 55%, transparent 100%)",
  top: "linear-gradient(to top, #000 55%, transparent 100%)",
  edges: "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
  radial: "radial-gradient(ellipse at center, #000 35%, transparent 72%)",
  none: null,
};

export interface GridPanelProps {
  variant?: GridVariant;
  fade?: GridFade;
  opacity?: number;
  /** Owns the box: inset / size / breakpoint classes. Defaults to a full fill. */
  className?: string;
}

export function GridPanel({
  variant = "dot",
  fade = "radial",
  opacity = 0.6,
  className = "inset-0",
}: GridPanelProps) {
  const mask = GRID_MASK[fade];
  const style: CSSProperties = { opacity };
  if (mask !== null) {
    style.WebkitMaskImage = mask;
    style.maskImage = mask;
  }

  return (
    <div
      aria-hidden
      className={cx("pointer-events-none absolute", GRID_VARIANT[variant], className)}
      style={style}
    />
  );
}

/* ------------------------------------------------------------------ */
/* GradientRule — the brand signature as a hairline.                   */
/* ------------------------------------------------------------------ */

export type RuleOrigin = "left" | "center" | "right";

const RULE_ORIGIN: Record<RuleOrigin, string> = {
  left: "origin-left",
  center: "origin-center",
  right: "origin-right",
};

const RULE_GRADIENT =
  "linear-gradient(90deg, rgba(139,92,246,0) 0%, rgba(139,92,246,0.9) 22%, rgba(99,102,241,0.95) 50%, rgba(6,182,212,0.9) 78%, rgba(6,182,212,0) 100%)";

/**
 * The optional draw-in. A scroll-linked animation with no JS at all: a CSS
 * view() timeline, behind @supports so non-Chromium browsers simply get the
 * finished rule, and behind a no-preference query so reduced-motion users get
 * the finished rule too (the element is never left at scaleX(0)).
 *
 * Emitted per animated rule. Identical @keyframes blocks are idempotent, and
 * it is a few hundred bytes — the alternative is a client component, which
 * would pull ambient-field off the server.
 */
export interface GradientRuleProps {
  /** Owns the box: width, margins, absolute placement. */
  className?: string;
  opacity?: number;
  origin?: RuleOrigin;
  /** Draw itself in as it scrolls into view. Degrades to a static rule. */
  animate?: boolean;
}

export function GradientRule({
  className,
  opacity = 0.8,
  origin = "left",
  animate = false,
}: GradientRuleProps) {
  return (
    <div aria-hidden className={cx("pointer-events-none h-px w-full", className)}>
      <span
        data-decor-rule={animate ? "draw" : undefined}
        className={cx("block h-px w-full", RULE_ORIGIN[origin])}
        style={{ backgroundImage: RULE_GRADIENT, opacity }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* NoiseLayer — the anti-banding plate.                                */
/* ------------------------------------------------------------------ */

/**
 * Dark gradients band badly on 8-bit panels; a ~3% grain plate dithers the
 * steps away and is the single cheapest thing that makes a near-black page
 * look expensive rather than muddy. Encoded once at module scope so server
 * and client always render byte-identical markup.
 */
const GRAIN_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">' +
  '<filter id="grain" x="0" y="0" width="100%" height="100%">' +
  '<feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch"/>' +
  '<feColorMatrix type="saturate" values="0"/>' +
  "</filter>" +
  '<rect width="100%" height="100%" filter="url(#grain)"/>' +
  "</svg>";

const GRAIN_URL = `url("data:image/svg+xml;utf8,${encodeURIComponent(GRAIN_SVG)}")`;

export interface NoiseLayerProps {
  /** ~0.03–0.05 is the useful band. Above that it reads as dirt. */
  opacity?: number;
  /** Tile size in px. Larger tiles repeat less visibly. */
  tile?: number;
  className?: string;
}

export function NoiseLayer({ opacity = 0.035, tile = 180, className = "inset-0" }: NoiseLayerProps) {
  return (
    <div
      aria-hidden
      className={cx("pointer-events-none absolute", className)}
      style={{
        backgroundImage: GRAIN_URL,
        backgroundRepeat: "repeat",
        backgroundSize: `${tile}px ${tile}px`,
        opacity,
      }}
    />
  );
}
