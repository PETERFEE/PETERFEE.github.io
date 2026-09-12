"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { GradientRule, GridPanel } from "@/components/decor";
import { EASE, Reveal, WordReveal, useReducedMotion } from "@/components/motion";
import { site } from "@/data/site";

/** Opening beat map, in seconds. Slow on purpose — the page should feel like
 *  it is being presented, not loaded. */
const T = {
  eyebrow: 0,
  line1: 0.16,
  line2: 0.52,
  lede: 0.98,
  pills: 1.14,
  actions: 1.32,
} as const;

function ArrowOut({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden focusable="false" className={className}>
      <path d="M3.5 8.5 8.5 3.5M4.25 3.5H8.5V7.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export interface HeroProps {
  className?: string;
}

export function Hero({ className }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // 0 -> 1 over exactly the hero's own scroll-out (top of section reaching top
  // of viewport, through bottom of section reaching top of viewport).
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // The signature move: the hero does not scroll away, it *recedes*. Shrinking
  // a hair while blurring and dimming reads as depth — the next section arrives
  // in front of the hero rather than after it. The small downward y makes the
  // content lag the scroll, which sells the parallax depth cue; opacity is
  // spent early (done by 62%) so the hero is gone well before its box is.
  //
  // Opacity and blur hold flat for the first 12%: on a narrow screen the hero
  // is taller than the viewport, so the first ~100px of scroll is the reader
  // reaching the lede and the buttons, not leaving. Fading there would dim copy
  // they have not read yet.
  const opacity = useTransform(scrollYProgress, [0.12, 0.62], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const blurPx = useTransform(scrollYProgress, [0.12, 1], [0, 6]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;
  // Invisible content must stop intercepting clicks meant for the section below.
  const pointerEvents = useTransform(opacity, (v) => (v < 0.05 ? "none" : "auto"));
  // The cue is the first casualty: any real scroll at all and it is gone.
  const cueOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className={[
        "relative flex min-h-screen items-center overflow-hidden pb-24 pt-24 supports-[min-height:100svh]:min-h-[100svh] sm:pb-32 sm:pt-32",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Hero-local decoration. A sibling of the content rather than a child:
          the content layer carries a scroll-linked blur filter, and stacking
          decoration inside it would put this texture through that filter for
          no visual gain and real raster cost. First in DOM order, and both
          layers are z-auto, so it paints underneath. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <GridPanel
          variant="dot"
          fade="radial"
          opacity={0.5}
          className="animate-float motion-reduce:animate-none right-8 top-28 hidden h-64 w-64 sm:block lg:right-16 lg:h-80 lg:w-80"
        />
        {/* Gives the hero a floor, so the section below arrives against an
            edge instead of drifting up out of nothing. */}
        <GradientRule className="absolute inset-x-0 bottom-0" opacity={0.45} origin="center" />
      </div>

      <motion.div
        className="shell relative w-full"
        style={reduce ? undefined : { opacity, scale, y, filter, pointerEvents }}
      >
        <Reveal delay={T.eyebrow} y={14} duration={0.8}>
          <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1">
            <span aria-hidden className="inline-flex items-center">
              {/* Brand gradient, at 6px. The smallest possible statement of it. */}
              <span className="animate-pulse-soft motion-reduce:animate-none block h-1.5 w-1.5 rounded-full bg-brand-grad shadow-[0_0_12px_rgba(139,92,246,0.75)]" />
            </span>
            <span className="text-chalk-dim">{site.role}</span>
            <span aria-hidden className="text-ink-600">
              /
            </span>
            <span>Design, Verification &amp; Embedded</span>
          </p>
        </Reveal>

        {/* text-display ships a 0.95 line-height; WordReveal clips each word with
            overflow-hidden, so it is loosened here to keep descenders (the "p" in
            "prove") inside the clip box. */}
        <h1 className="mt-6 text-display font-semibold leading-[1.12] text-chalk sm:mt-7">
          <WordReveal text={site.headline[0]} className="block text-balance" delay={T.line1} />
          {/* The one large gradient moment in this viewport: the closing line
              resolves into the brand instead of receding to grey. */}
          <WordReveal text={site.headline[1]} className="brand-text block text-balance" delay={T.line2} />
        </h1>

        <Reveal delay={T.lede} y={20}>
          <p className="mt-6 max-w-prose text-lede text-pretty text-chalk-dim sm:mt-8">{site.lede}</p>
        </Reveal>

        <ul className="mt-8 flex flex-wrap gap-2 sm:mt-10">
          {site.disciplines.map((discipline, i) => (
            <Reveal
              as="li"
              key={discipline}
              y={12}
              duration={0.7}
              delay={T.pills + i * 0.06}
              className="eyebrow rounded-full border border-ink-600 px-3 py-1.5 text-chalk-dim transition duration-300 ease-apple hover:-translate-y-px hover:border-violet/50 hover:text-chalk hover:shadow-[0_0_22px_-8px_rgba(139,92,246,0.9)]"
            >
              {discipline}
            </Reveal>
          ))}
        </ul>

        <Reveal delay={T.actions} y={18}>
          <div className="mt-10 flex flex-wrap items-center gap-3 sm:mt-12">
            <a href="#gallery" className="btn-brand">
              View the work
            </a>
            <a href={site.links.github} target="_blank" rel="noreferrer" className="btn-glass group">
              GitHub
              <ArrowOut className="h-3 w-3 text-chalk-dim transition-colors duration-500 ease-apple-out group-hover:text-chalk" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </Reveal>
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center sm:bottom-10"
        style={reduce ? undefined : { opacity: cueOpacity }}
      >
        {/* Hairline rail with a highlight that falls down it — the quietest
            possible "there is more below". The rail itself now fades at both
            ends and the highlight carries the brand hue. */}
        <span className="relative block h-14 w-px overflow-hidden rounded-full bg-gradient-to-b from-transparent via-ink-600 to-transparent">
          {reduce ? null : (
            <motion.span
              className="absolute inset-x-0 top-0 block h-1/2 bg-gradient-to-b from-transparent via-violet-soft to-cyan-soft"
              initial={{ y: "-110%" }}
              animate={{ y: "220%" }}
              transition={{ duration: 2.4, ease: EASE, repeat: Infinity, repeatDelay: 0.45 }}
            />
          )}
        </span>
      </motion.div>
    </section>
  );
}

export default Hero;
