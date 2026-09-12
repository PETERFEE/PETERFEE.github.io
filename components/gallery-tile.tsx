"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactElement } from "react";

import { EASE, useReducedMotion } from "@/components/motion";
import { accentTheme } from "@/components/project-media";
import type { GalleryItem } from "@/data/gallery";
import type { Accent } from "@/types/project";

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950";

/* ------------------------------------------------------------------ */
/* Placeholder palette                                                  */
/*                                                                      */
/* accentTheme (project-media.tsx) covers the shared roles — hover      */
/* border, hover text. The generated placeholder needs a few stops that */
/* nothing else on the site uses, so they live here. Same rule applies: */
/* every class is written out in full, never assembled from a template  */
/* literal, or Tailwind's JIT would never see it.                       */
/* ------------------------------------------------------------------ */

interface TilePalette {
  /** Corner-to-corner accent wash over the texture. */
  wash: string;
  /** Blurred bloom sitting behind the motif. */
  bloom: string;
  /** Motif stroke colour. */
  motif: string;
  /** Ghost initials under the motif. */
  initials: string;
  /** Thin drawn frame inset from the tile edge. */
  hairline: string;
  /** Accent-tinted drop shadow on hover. */
  shadow: string;
}

const TILE_PALETTE: Record<Accent, TilePalette> = {
  signal: {
    wash: "from-signal/30 via-signal/5 to-transparent",
    bloom: "bg-signal/20",
    motif: "text-signal/80",
    initials: "text-signal/25",
    hairline: "border-signal/15",
    shadow: "group-hover:shadow-[0_20px_50px_-22px_rgba(41,151,255,0.6)]",
  },
  wave: {
    wash: "from-wave/25 via-wave/5 to-transparent",
    bloom: "bg-wave/20",
    motif: "text-wave/80",
    initials: "text-wave/25",
    hairline: "border-wave/15",
    shadow: "group-hover:shadow-[0_20px_50px_-22px_rgba(74,222,128,0.5)]",
  },
  amber: {
    wash: "from-amber/25 via-amber/5 to-transparent",
    bloom: "bg-amber/20",
    motif: "text-amber/80",
    initials: "text-amber/25",
    hairline: "border-amber/15",
    shadow: "group-hover:shadow-[0_20px_50px_-22px_rgba(245,165,36,0.5)]",
  },
};

/* ------------------------------------------------------------------ */
/* Hand-drawn motifs                                                    */
/*                                                                      */
/* No icon library in this project. Six line drawings, picked by index, */
/* crossed with three accents — twelve tiles, no two that read alike.   */
/* All decorative: the tile is labelled in text right below.            */
/* ------------------------------------------------------------------ */

interface MotifProps {
  /** False under reduced motion — the one rotating part holds still. */
  spin: boolean;
}

const SVG = {
  viewBox: "0 0 64 64",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.15,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
  className: "h-full w-full",
};

/** Orbit — rings with one slowly rotating dashed track. */
function OrbitMotif({ spin }: MotifProps): ReactElement {
  return (
    <svg {...SVG}>
      <circle cx="32" cy="32" r="26" opacity="0.3" />
      <g className={spin ? "origin-center animate-spin-slow" : undefined}>
        <circle cx="32" cy="32" r="19" strokeDasharray="3 5" opacity="0.75" />
        <circle cx="32" cy="13" r="2.4" fill="currentColor" stroke="none" />
      </g>
      <circle cx="32" cy="32" r="7" opacity="0.9" />
      <circle cx="32" cy="32" r="1.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Timing diagram — two levels, uneven pulse widths. */
function PulseMotif(): ReactElement {
  return (
    <svg {...SVG}>
      <path d="M4 44h8V20h9v24h8V20h10v24h8V20h9" opacity="0.9" />
      <path d="M4 53h56" strokeDasharray="2 4" opacity="0.3" />
      <path d="M4 11h56" strokeDasharray="2 4" opacity="0.18" />
    </svg>
  );
}

/** Block diagram — two blocks feeding a third. */
function BlockMotif(): ReactElement {
  return (
    <svg {...SVG}>
      <rect x="5" y="9" width="21" height="15" rx="3.5" opacity="0.9" />
      <rect x="38" y="9" width="21" height="15" rx="3.5" opacity="0.5" />
      <rect x="21.5" y="40" width="21" height="15" rx="3.5" opacity="0.9" />
      <path d="M26 16.5h12" opacity="0.6" />
      <path d="M15.5 24v11a5 5 0 005 5h1" opacity="0.6" />
      <path d="M48.5 24v11a5 5 0 01-5 5h-1" opacity="0.45" />
    </svg>
  );
}

/** Layers — an isometric stack seen edge-on. */
function StackMotif(): ReactElement {
  return (
    <svg {...SVG}>
      <path d="M32 7 57 19 32 31 7 19z" opacity="0.9" />
      <path d="M7 28.5 32 40.5 57 28.5" opacity="0.55" />
      <path d="M7 38 32 50 57 38" opacity="0.3" />
    </svg>
  );
}

/** Fabric — a die on a lattice, FPGA-ish. */
function LatticeMotif(): ReactElement {
  return (
    <svg {...SVG}>
      <rect x="9" y="9" width="46" height="46" rx="7" opacity="0.3" />
      <path d="M32 14 50 32 32 50 14 32z" opacity="0.9" />
      <path d="M22 22 42 42M42 22 22 42" opacity="0.28" />
      <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" opacity="0.85" />
    </svg>
  );
}

/** Scope trace — a sine with a measurement cursor. */
function TraceMotif(): ReactElement {
  return (
    <svg {...SVG}>
      <path d="M4 32q7.5-18 15 0t15 0t15 0" opacity="0.9" />
      <path d="M2 32h60" strokeDasharray="2 4" opacity="0.25" />
      <path d="M34 9v46" opacity="0.3" />
      <circle cx="34" cy="32" r="2.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

const MOTIFS: Array<(props: MotifProps) => ReactElement> = [
  OrbitMotif,
  PulseMotif,
  BlockMotif,
  StackMotif,
  LatticeMotif,
  TraceMotif,
];

/** Texture + wash alternate so neighbouring tiles never twin. */
const TEXTURE = ["dot-grid", "blueprint-grid"] as const;
const WASH_DIRECTION = ["bg-gradient-to-br", "bg-gradient-to-tr"] as const;

const SKIP_WORDS = new Set([
  "a", "an", "and", "for", "in", "my", "of", "on", "the", "to", "with", "your",
]);

/**
 * Initials for the placeholder mark: up to three leading letters from the
 * significant words of the title ("APB UART Verification" -> AUV), or the
 * first two letters when the title is a single word ("Devotee" -> DE).
 */
function initialsOf(title: string): string {
  const words = title
    .split(/[^A-Za-z0-9]+/)
    .filter((word) => /^[A-Za-z]/.test(word))
    .filter((word) => !SKIP_WORDS.has(word.toLowerCase()));

  if (words.length === 0) return title.slice(0, 2).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return words
    .slice(0, 3)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

/* ------------------------------------------------------------------ */
/* Icons                                                                */
/* ------------------------------------------------------------------ */

function ArrowUpRight({ className }: { className?: string }): ReactElement {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      className={cx("h-3.5 w-3.5 shrink-0", className)}
    >
      <path d="M4.5 11.5 11.5 4.5" />
      <path d="M5.75 4.5h5.75v5.75" />
    </svg>
  );
}

function ArrowRight({ className }: { className?: string }): ReactElement {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      className={cx("h-3.5 w-3.5 shrink-0", className)}
    >
      <path d="M3 8h9.5" />
      <path d="M8.75 4.25 12.5 8l-3.75 3.75" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* GalleryTile                                                          */
/* ------------------------------------------------------------------ */

type Status = "loading" | "loaded" | "missing";

export interface GalleryTileProps {
  item: GalleryItem;
  /** Position in the grid. Drives the placeholder variant and the wide first tile. */
  index: number;
}

/**
 * One image-forward tile in the browse-everything grid.
 *
 * Artwork convention: `item.image` is a path under /public, so the file for
 * the first tile lives at `public/projects/packet-fifo-uvm/architecture.png`.
 * Dropping the file in is the whole job — no manifest, no code change.
 *
 * Like ProjectMedia this renders a plain <img> rather than next/image: under
 * `output: "export"` next/image resolves files at build time and hard-fails on
 * a missing one, which would turn every not-yet-supplied image into a build
 * error. A plain <img> just fires `onError`, and we swap in a generated mark —
 * accent wash, texture, hand-drawn motif, project initials — that is meant to
 * be looked at, not apologised for.
 *
 * The whole tile is a single anchor, so nothing interactive may go inside it.
 */
export function GalleryTile({ item, index }: GalleryTileProps): ReactElement {
  const [status, setStatus] = useState<Status>("loading");
  const imgRef = useRef<HTMLImageElement | null>(null);
  const reduce = useReducedMotion();

  const t = accentTheme[item.accent];
  const p = TILE_PALETTE[item.accent];
  const Motif = MOTIFS[index % MOTIFS.length];
  const texture = TEXTURE[index % TEXTURE.length];
  const washDirection = WASH_DIRECTION[index % WASH_DIRECTION.length];

  /**
   * The first tile spans two columns at lg (ProjectGallery sets the span), so
   * it also takes a ~2x wider ratio — that keeps its height equal to the
   * single-column tile beside it and the grid row dead level.
   * 36/13 = 2.77 is (2 columns + one gap) / (column x 3/4) across the whole lg
   * range; any residual pixel or two is absorbed by `h-full`.
   */
  const featured = index === 0;

  // Statically exported pages can finish (or fail) the request before React
  // hydrates, in which case neither onLoad nor onError ever fires. Settle from
  // the element itself once on mount: `complete` with zero naturalWidth is
  // exactly the "file is not there yet" case.
  useEffect(() => {
    const node = imgRef.current;
    if (!node || !node.complete) return;
    setStatus(node.naturalWidth > 0 ? "loaded" : "missing");
  }, []);

  const external = !item.internal;
  const loaded = status === "loaded";
  const initials = initialsOf(item.title);
  const label = external
    ? `${item.title} — ${item.blurb}. Opens the repository in a new tab.`
    : `${item.title} — ${item.blurb}`;

  return (
    <motion.a
      href={item.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      aria-label={label}
      className={cx(
        "group relative block h-full w-full overflow-hidden rounded-[1.5rem] border border-ink-600/70",
        "bg-ink-900 transition-[border-color,box-shadow] duration-500 ease-apple-out",
        featured ? "aspect-[4/3] lg:aspect-[36/13]" : "aspect-[4/3]",
        t.hoverBorder,
        p.shadow,
        FOCUS_RING
      )}
      // Weighty, not snappy: the whole tile lifts while the art scales inside it.
      whileHover={reduce ? undefined : { y: -6 }}
      whileFocus={reduce ? undefined : { y: -6 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {/* Art layer. The frame stays put; only this scales. */}
      <div
        className={cx(
          "absolute inset-0 transition-transform duration-500 ease-apple-out",
          !reduce && "group-hover:scale-[1.06] group-focus-visible:scale-[1.06]"
        )}
      >
        {/* Generated placeholder — visible until (and unless) the file lands. */}
        <div
          aria-hidden
          className={cx(
            "absolute inset-0 transition-opacity duration-700 ease-apple-out",
            loaded ? "opacity-0" : "opacity-100"
          )}
        >
          <div className={cx("absolute inset-0 opacity-70", texture)} />
          <div className={cx("absolute inset-0", washDirection, p.wash)} />
          <div className="absolute inset-0 bg-gradient-to-tl from-violet/10 via-transparent to-transparent" />
          <div className={cx("absolute inset-3 rounded-[1.15rem] border", p.hairline)} />

          {/* The mark sits in the clear band between the chip row and the
              caption. Columns are shortest at sm, so it only grows at lg. */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pb-[22%] lg:pb-[10%]">
            <div className="relative">
              <div className={cx("absolute -inset-6 rounded-full blur-2xl", p.bloom)} />
              <div className={cx("relative h-11 w-11 lg:h-14 lg:w-14", p.motif)}>
                <Motif spin={!reduce} />
              </div>
            </div>
            <span
              className={cx(
                "font-mono text-[1.375rem] font-semibold leading-none tracking-[0.14em] lg:text-[1.75rem]",
                p.initials
              )}
            >
              {initials}
            </span>
          </div>
        </div>

        {status === "missing" ? null : (
          /* eslint-disable-next-line @next/next/no-img-element -- deliberate:
             next/image resolves files at build time under `output: "export"`
             and hard-fails on a missing one, which is the normal state here. */
          <img
            ref={imgRef}
            src={item.image}
            alt={item.title}
            loading={index < 3 ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("missing")}
            className={cx(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-apple-out",
              loaded ? "opacity-100" : "opacity-0"
            )}
          />
        )}
      </div>

      {/* Sheen sweep on hover — same trick as .btn-brand. */}
      {reduce ? null : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-sheen opacity-60 group-hover:animate-sheen"
        />
      )}

      {/* Corner markers. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 sm:p-4">
        <span className="chip border-ink-600/70 bg-ink-950/60 text-[0.625rem] text-chalk-dim backdrop-blur-md">
          {item.tag}
        </span>

        <span className="flex items-center gap-2">
          {item.badge ? (
            <span className="rounded-full border border-ink-600/50 bg-ink-950/45 px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-chalk-faint backdrop-blur-md">
              {item.badge}
            </span>
          ) : null}
          {external ? (
            <span
              className={cx(
                "inline-flex h-7 w-7 items-center justify-center rounded-full border border-ink-600/50 bg-ink-950/45 text-chalk-dim backdrop-blur-md transition-colors duration-500 ease-apple-out",
                t.groupText
              )}
            >
              <ArrowUpRight
                className={cx(
                  "transition-transform duration-500 ease-apple-out",
                  !reduce && "group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                )}
              />
            </span>
          ) : null}
        </span>
      </div>

      {/* Caption. Sits over the art in its own scrim. */}
      <div className="absolute inset-x-0 bottom-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[190%] bg-gradient-to-t from-ink-950 via-ink-950/80 to-transparent"
        />

        <div className="relative p-4 sm:p-5">
          <h3
            className={cx(
              "text-balance text-[1.0625rem] font-semibold leading-snug tracking-[-0.01em] text-chalk transition-colors duration-500 ease-apple-out sm:text-[1.125rem]",
              t.groupText
            )}
          >
            {item.title}
          </h3>

          {/* The reveal, as a real slide: the row collapses to 0fr at lg, so
              the tile is title-only at rest and the blurb pushes it up on
              hover. Below lg there is no hover to speak of, so the hook is
              simply shown — and so is the whole grid under reduced motion. */}
          <div
            className={cx(
              "grid grid-rows-[1fr]",
              !reduce &&
                "transition-[grid-template-rows] duration-500 ease-apple-out lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] lg:group-focus-visible:grid-rows-[1fr]"
            )}
          >
            <div
              className={cx(
                "min-h-0 overflow-hidden transition-opacity duration-500 ease-apple-out",
                !reduce && "lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100"
              )}
            >
              <p className="mt-2 line-clamp-2 text-pretty text-[0.8125rem] leading-relaxed text-chalk-dim">
                {item.blurb}
              </p>
              {/* Hover affordance, so it only exists where hover does. */}
              <span
                className={cx(
                  "mt-3 hidden items-center gap-1.5 text-[0.8125rem] font-medium text-chalk transition-colors duration-500 ease-apple-out lg:inline-flex",
                  t.groupText
                )}
              >
                {external ? "View repo" : "View project"}
                {external ? <ArrowUpRight /> : <ArrowRight />}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.a>
  );
}
