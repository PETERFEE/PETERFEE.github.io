"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE, useReducedMotion } from "@/components/motion";
import type { Accent, MediaKind, ProjectMediaSlot } from "@/types/project";

/* ------------------------------------------------------------------ */
/* Accent lookup                                                        */
/*                                                                      */
/* Tailwind's JIT scans source text for complete class names, so every  */
/* accent variant is written out in full here. Never build these with   */
/* template literals (`text-${accent}`) — they would not compile.       */
/* Shared with project-showcase.tsx and project-card.tsx.               */
/* ------------------------------------------------------------------ */

export interface AccentTheme {
  /** Solid accent text. */
  text: string;
  /** Muted accent text, for labels. */
  textSoft: string;
  /** Solid accent fill, for 1px ticks and rules. */
  bar: string;
  /** Very low-opacity accent wash. */
  bgSoft: string;
  /** Low-opacity accent border, for the awaiting-asset frame. */
  border: string;
  /** Slightly stronger accent border, for the pulsing ring. */
  borderRing: string;
  /** Hover border on a direct hover target (a link, a card). */
  hoverBorder: string;
  /** Hover text on a direct hover target. */
  hoverText: string;
  /** Hover text driven by an ancestor `.group` (a card). */
  groupText: string;
  /** Gradient stop for the soft glow behind an empty frame. */
  glow: string;
}

export const accentTheme: Record<Accent, AccentTheme> = {
  signal: {
    text: "text-signal",
    textSoft: "text-signal/75",
    bar: "bg-signal",
    bgSoft: "bg-signal/10",
    border: "border-signal/25",
    borderRing: "border-signal/45",
    hoverBorder: "hover:border-signal/60",
    hoverText: "hover:text-signal",
    groupText: "group-hover:text-signal",
    glow: "from-signal/5",
  },
  wave: {
    text: "text-wave",
    textSoft: "text-wave/75",
    bar: "bg-wave",
    bgSoft: "bg-wave/10",
    border: "border-wave/25",
    borderRing: "border-wave/45",
    hoverBorder: "hover:border-wave/60",
    hoverText: "hover:text-wave",
    groupText: "group-hover:text-wave",
    glow: "from-wave/5",
  },
  amber: {
    text: "text-amber",
    textSoft: "text-amber/75",
    bar: "bg-amber",
    bgSoft: "bg-amber/10",
    border: "border-amber/25",
    borderRing: "border-amber/45",
    hoverBorder: "hover:border-amber/60",
    hoverText: "hover:text-amber",
    groupText: "group-hover:text-amber",
    glow: "from-amber/5",
  },
};

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ */
/* Slot-kind icons — hand drawn, no icon library in this project.       */
/* All decorative: the frame is labelled in text right underneath.      */
/* ------------------------------------------------------------------ */

function MediaIcon({ kind }: { kind: MediaKind }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    className: "h-[22px] w-[22px]",
  };

  switch (kind) {
    case "screenshot":
      // Browser chrome with two dots and a couple of content rules.
      return (
        <svg {...common}>
          <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
          <path d="M2.5 8.5h19" />
          <circle cx="5.6" cy="6.25" r="0.75" fill="currentColor" stroke="none" />
          <circle cx="8.1" cy="6.25" r="0.75" fill="currentColor" stroke="none" />
          <path d="M6 12.5h7M6 16h11" opacity="0.5" />
        </svg>
      );
    case "photo":
      // Frame with a sun and two ridge lines.
      return (
        <svg {...common}>
          <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
          <circle cx="8.25" cy="9.5" r="1.6" />
          <path d="M3 16.9l4.7-4.1a1.8 1.8 0 012.4 0l3 2.7" />
          <path d="M13.2 15.6l2.3-2a1.8 1.8 0 012.4 0l3.1 2.7" opacity="0.6" />
        </svg>
      );
    case "diagram":
      // Two blocks feeding a third — a block diagram in miniature.
      return (
        <svg {...common}>
          <rect x="2" y="4" width="7" height="5.5" rx="1.25" />
          <rect x="15" y="4" width="7" height="5.5" rx="1.25" />
          <rect x="8.5" y="14.5" width="7" height="5.5" rx="1.25" />
          <path d="M9 6.75h6" />
          <path d="M5.5 9.5v3.2a1.8 1.8 0 001.8 1.8h1.2M18.5 9.5v3.2a1.8 1.8 0 01-1.8 1.8h-1.2" />
        </svg>
      );
    case "waveform":
      // A real digital timing squiggle: two levels, uneven pulse widths.
      return (
        <svg {...common}>
          <path d="M1.5 16H4V9h3.5v7H10V9h5v7h3V9h4.5" />
          <path d="M1.5 20.5h21" opacity="0.35" strokeDasharray="1.5 2.5" />
        </svg>
      );
    case "chart":
      // Four bars on a baseline.
      return (
        <svg {...common}>
          <path d="M2.5 20.25h19" opacity="0.55" />
          <rect x="4" y="12.5" width="3" height="7.75" rx="0.6" />
          <rect x="8.5" y="8.25" width="3" height="12" rx="0.6" />
          <rect x="13" y="14.75" width="3" height="5.5" rx="0.6" />
          <rect x="17.5" y="10.5" width="3" height="9.75" rx="0.6" />
        </svg>
      );
  }
}

/* ------------------------------------------------------------------ */
/* ProjectMedia                                                         */
/* ------------------------------------------------------------------ */

export interface ProjectMediaProps {
  slot: ProjectMediaSlot;
  slug: string;
  accent: Accent;
  /** Load eagerly — use for the lead image of the first showcase. */
  priority?: boolean;
  /** Lands on the <figure>. */
  className?: string;
}

type Status = "loading" | "loaded" | "missing";

/**
 * Drop-in media frame.
 *
 * Convention: the file lives at `public/projects/<slug>/<slot.file>`, which
 * serves as `/projects/<slug>/<slot.file>`. Adding artwork is a file drop —
 * there is no manifest and no code change.
 *
 * That is why this renders a plain <img> rather than next/image: under
 * `output: "export"` next/image resolves and measures files at build time and
 * hard-fails on a missing one, which would make every not-yet-supplied slot a
 * build error. A plain <img> simply fires `onError`, and we swap in a labelled
 * placeholder that tells you exactly what to shoot and where to put it.
 */
export function ProjectMedia({
  slot,
  slug,
  accent,
  priority = false,
  className,
}: ProjectMediaProps) {
  const [status, setStatus] = useState<Status>("loading");
  const imgRef = useRef<HTMLImageElement | null>(null);
  const reduce = useReducedMotion();
  const t = accentTheme[accent];

  // The page is statically exported, so the browser can finish (or fail) this
  // request before React hydrates — in which case neither onLoad nor onError
  // ever fires and the frame would sit at opacity 0 forever. Settle from the
  // element's own state once on mount instead: `complete` with a zero
  // naturalWidth is exactly the "file is not there yet" case.
  useEffect(() => {
    const node = imgRef.current;
    if (!node || !node.complete) return;
    setStatus(node.naturalWidth > 0 ? "loaded" : "missing");
  }, []);

  const src = `/projects/${slug}/${slot.file}`;
  const dropPath = `public/projects/${slug}/${slot.file}`;
  const missing = status === "missing";
  // Under reduced motion the image is simply present — no fade, no settle.
  const revealed = reduce || status === "loaded";

  return (
    <figure className={cx("min-w-0", className)}>
      <div
        className={cx(
          "glass relative w-full overflow-hidden rounded-2xl",
          missing && cx("border-dashed", t.border)
        )}
        style={{
          // Slots declare their own aspect, so dropping the real file in
          // changes nothing about the layout around it.
          aspectRatio: slot.aspect ?? "16 / 9",
          // …except that a short 16/9 slot in a narrow column can be under
          // 160px tall, which would clip the label. While the asset is still
          // missing the frame is allowed to outgrow its ratio; once the image
          // lands this constraint disappears and the ratio is exact again.
          minHeight: missing ? "14rem" : undefined,
        }}
      >
        {/* Blueprint texture — reads as "drawing not yet developed". */}
        <div
          aria-hidden
          className={cx(
            "blueprint-grid pointer-events-none absolute inset-0 transition-opacity duration-700 ease-apple-out",
            status === "loaded" ? "opacity-0" : "opacity-70"
          )}
        />

        {missing ? (
          <>
            {/* Soft accent wash from the bottom, so the frame is not flat. */}
            <div
              aria-hidden
              className={cx(
                "pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent",
                t.glow
              )}
            />
            {/* Slow breathing dashed ring: "awaiting asset", not "broken". */}
            <div
              aria-hidden
              className={cx(
                "pointer-events-none absolute inset-0 rounded-2xl border border-dashed animate-pulse-soft",
                t.borderRing
              )}
            />

            <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 p-4 text-center">
              {/* Icon and kind sit on one row: a stacked icon costs ~40px of
                  height that the shortest frames simply do not have. */}
              <span
                className={cx(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border py-1 pl-2.5 pr-3",
                  t.border,
                  t.bgSoft
                )}
              >
                <span className={cx("inline-flex", t.text)}>
                  <MediaIcon kind={slot.kind} />
                </span>
                <span className={cx("eyebrow", t.textSoft)}>{slot.kind}</span>
              </span>

              <p className="max-w-[42ch] text-pretty text-[0.8125rem] leading-relaxed text-chalk-dim">
                {slot.hint}
              </p>

              {/* The exact drop path, selectable.
                  `relative z-10` keeps it above a card's stretched-link
                  overlay so it stays selectable inside ProjectCard. */}
              <code className="relative z-10 max-w-full select-all break-all rounded-md border border-ink-700 bg-ink-900/70 px-2 py-1 font-mono text-[0.625rem] leading-relaxed text-chalk-faint sm:text-[0.6875rem]">
                {dropPath}
              </code>
            </div>
          </>
        ) : (
          <motion.img
            ref={imgRef}
            src={src}
            alt={slot.alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("missing")}
            className="absolute inset-0 h-full w-full rounded-2xl object-cover"
            initial={reduce ? false : { opacity: 0, scale: 1.04 }}
            animate={
              revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 }
            }
            transition={reduce ? { duration: 0 } : { duration: 0.6, ease: EASE }}
          />
        )}
      </div>

      {slot.caption ? (
        <figcaption className="mt-3 max-w-prose text-pretty text-[0.8125rem] leading-relaxed text-chalk-faint">
          {slot.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
