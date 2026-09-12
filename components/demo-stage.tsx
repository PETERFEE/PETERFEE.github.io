"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/components/motion";
import { LiveDemo } from "@/components/live-demo";
import { withBasePath } from "@/lib/paths";

export interface DemoStageProps {
  src: string;
  title: string;
  repo: string;
}

/**
 * Full-bleed opening for a project whose demo IS the point. The page lands on
 * the demo at full viewport height; scrolling fades and recedes it while the
 * write-up rises over it, and scrolling back up brings it straight back --
 * scroll-linked transforms are positional, not one-shot, so the reversal is
 * free rather than something to script.
 *
 * The spacer is 200vh: the first 100vh is the demo at rest, the second is the
 * distance over which it hands off to the content.
 */
export function DemoStage({ src, title, repo }: DemoStageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const resolved = withBasePath(src);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Fade out over the first ~65% of the handoff, so the demo is gone before
  // the content fully arrives rather than ghosting behind it.
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.93]);
  // Once it is essentially invisible it must stop swallowing clicks and wheel
  // events, or the content below becomes unusable.
  const pointerEvents = useTransform(scrollYProgress, (v) => (v > 0.5 ? "none" : "auto"));
  // Declared here, not inline in JSX below: the early return for reduced motion
  // sits between, and a hook after a conditional return changes the hook count
  // between renders the moment that setting flips.
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  // Reduced motion: no scroll choreography at all, just the standard embed.
  if (reduce) {
    return (
      <div className="shell pt-10">
        <LiveDemo src={src} title={title} repo={repo} />
      </div>
    );
  }

  return (
    <div ref={ref} className="relative h-[200vh]" aria-label={`${title} interactive demo`}>
      <motion.div
        style={{ opacity, scale, pointerEvents }}
        className="sticky top-0 h-screen w-full origin-center overflow-hidden bg-black supports-[height:100svh]:h-[100svh]"
      >
        <iframe
          src={resolved}
          title={title}
          // An iframe paints its own background; without bg-black the default
          // white flashes a bright slab onto a near-black page while loading.
          className="block h-full w-full border-0 bg-black"
          sandbox="allow-scripts allow-same-origin"
          allow="accelerometer; gyroscope"
        />

        {/* Affordances over the stage. Kept minimal so the demo stays the view. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 to-transparent pb-6 pt-16">
          <div className="shell flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <p className="text-sm text-chalk-dim">
              Drag to rotate · scroll the frame to zoom · type below to change the message
            </p>
            <span className="pointer-events-auto flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <a
                href={resolved}
                target="_blank"
                rel="noreferrer"
                className="text-chalk-dim underline-offset-4 transition-colors hover:text-chalk hover:underline"
              >
                Open full screen ↗
              </a>
              <a
                href={repo}
                target="_blank"
                rel="noreferrer"
                className="text-chalk-dim underline-offset-4 transition-colors hover:text-chalk hover:underline"
              >
                Source ↗
              </a>
            </span>
          </div>
        </div>

        {/* Scroll cue, fading as soon as the handoff begins. */}
        <motion.div
          aria-hidden
          style={{ opacity: cueOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-24 z-20 flex justify-center"
        >
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-chalk-faint">
            Scroll for the write-up
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
