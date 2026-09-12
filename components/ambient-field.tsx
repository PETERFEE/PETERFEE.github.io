/**
 * AmbientField — the lit canvas the whole site sits on.
 *
 * Deliberately hook-free and framer-motion-free so it stays an RSC and ships
 * zero JS: everything here is CSS, assembled from the primitives in
 * `components/decor.tsx`. That also means it costs nothing on scroll, which
 * matters because it is painted behind every section of the page.
 *
 * Colour story: violet leads from the upper right, cyan answers from the lower
 * left, and the original `signal` blue survives as a cool mid-field so the
 * palette reads as an evolution rather than a repaint. Peak alpha of any one
 * orb is under 10% — you should feel the hue, not name it.
 *
 * Reduced motion is honoured twice over: `motion-reduce:animate-none` inside
 * Orb, and the global `prefers-reduced-motion` rule in globals.css.
 */

import { GridPanel, NoiseLayer, Orb } from "@/components/decor";

/** Top sheen + corner vignette that pulls everything back to the page base. */
const VIGNETTE =
  "radial-gradient(ellipse 120% 80% at 50% 0%, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 55%)," +
  "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(5,5,6,0) 40%, rgba(5,5,6,0.78) 100%)";

/** A single cool-to-warm wash across the very top, under the nav. Almost
 *  subliminal, but it stops the top edge reading as flat black. */
const BRAND_WASH =
  "linear-gradient(110deg, rgba(139,92,246,0.10) 0%, rgba(99,102,241,0.06) 45%, rgba(6,182,212,0.09) 100%)";

export interface AmbientFieldProps {
  /** Extra classes for the fixed root layer. */
  className?: string;
}

export function AmbientField({ className }: AmbientFieldProps) {
  return (
    <div
      aria-hidden
      // -z-10 keeps it under all normal-flow content without the rest of the
      // page needing to opt into a z-index. `overflow-hidden` stops the
      // oversized orbs from ever producing a scrollbar.
      className={[
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Blueprint grid — the hardware-engineering nod. Already only 3.5%
          white in globals.css; halved again here and dissolved toward the
          bottom so it reads as texture, never as a grid. */}
      <GridPanel variant="blueprint" fade="bottom" opacity={0.5} />

      {/* Violet leads. Largest, slowest, furthest off-canvas. */}
      <Orb color="violet" size="xl" position="top-right" opacity={0.17} drift driftDuration={26} />

      {/* Cyan answers, out of phase by a negative delay so the two never sync. */}
      <Orb
        color="cyan"
        size="lg"
        position="bottom-left"
        opacity={0.15}
        drift
        driftDuration={37}
        driftDelay={-13}
      />

      {/* The original blue, now a static mid-field tie-breaker between the two
          brand hues. Static so only two layers are ever animating. */}
      <Orb color="signal" size="md" position="right" opacity={0.07} />

      {/* Brand wash across the masthead area only. */}
      <div
        className="absolute inset-x-0 top-0 h-[38vh]"
        style={{
          backgroundImage: BRAND_WASH,
          WebkitMaskImage: "linear-gradient(to bottom, #000, transparent)",
          maskImage: "linear-gradient(to bottom, #000, transparent)",
        }}
      />

      {/* Sheen + vignette, painted over the orbs. */}
      <div className="absolute inset-0" style={{ backgroundImage: VIGNETTE }} />

      {/* Grain, last, so it dithers everything beneath it. */}
      <NoiseLayer opacity={0.035} />
    </div>
  );
}

export default AmbientField;
