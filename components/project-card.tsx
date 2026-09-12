"use client";

import { motion } from "framer-motion";
import { EASE, Reveal, useReducedMotion } from "@/components/motion";
import { ProjectMedia, accentTheme } from "@/components/project-media";
import type { Project, ProjectMediaSlot } from "@/types/project";

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950";

/** How many stack tags fit before the card starts to look like a list. */
const STACK_LIMIT = 5;

function ArrowUpRight() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      className="h-3.5 w-3.5 shrink-0 transition-transform duration-500 ease-apple-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    >
      <path d="M4.5 11.5 11.5 4.5" />
      <path d="M5.75 4.5h5.75v5.75" />
    </svg>
  );
}

export interface ProjectCardProps {
  project: Project;
  /** Position in the grid; drives the reveal cascade only. */
  index: number;
}

/**
 * Compact card for a `featured: false` project.
 *
 * Accessibility note on the hover target: the whole card reacts to hover, but
 * there is exactly one anchor in it. The repo link stretches itself over the
 * card with an `after:` pseudo-element (the "stretched link" pattern) instead
 * of wrapping the card in an <a> — that keeps the heading, the list and the
 * selectable drop-path out of the link's accessible name and avoids nesting
 * interactive elements.
 */
export function ProjectCard({ project, index }: ProjectCardProps) {
  const reduce = useReducedMotion();
  const t = accentTheme[project.accent];

  // One slot may be marked `lead`; fall back to the first so the card always
  // has a frame to show.
  const lead: ProjectMediaSlot | undefined =
    project.media.find((slot) => slot.lead) ?? project.media[0];

  const shown = project.stack.slice(0, STACK_LIMIT);
  const overflow = project.stack.length - shown.length;

  return (
    // `min-w-0` is load-bearing. The missing-asset media frame carries
    // `aspect-ratio: 16/9` with a 14rem min-height, and that height transfers
    // back through the ratio into a ~398px minimum *width* contribution. An
    // `auto` grid track floors at its items' minimum contribution, so without
    // this the column locks to 424px and the card spills past the viewport on
    // every phone width. The gallery grid sets it on its items for the same
    // reason.
    <Reveal className="h-full min-w-0" y={24} delay={(index % 3) * 0.08}>
      <motion.article
        id={project.slug}
        className={cx(
          "group glass relative flex h-full flex-col rounded-[1.75rem] p-3 scroll-mt-28 transition-colors duration-500 ease-apple-out",
          t.hoverBorder
        )}
        // Lift on hover. Gated on the OS setting like every other motion here.
        whileHover={reduce ? undefined : { y: -4 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {lead ? (
          // Clip locally so the media can scale inside its own frame without
          // pushing the card's corners around.
          <div className="overflow-hidden rounded-2xl">
            <ProjectMedia
              slot={lead}
              slug={project.slug}
              accent={project.accent}
              className="transition-transform duration-500 ease-apple-out group-hover:scale-[1.03]"
            />
          </div>
        ) : null}

        <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
          <p className="eyebrow flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span>{project.category}</span>
            <span
              aria-hidden
              className="inline-block h-[3px] w-[3px] rounded-full bg-chalk-faint/70"
            />
            <span>{project.year}</span>
          </p>

          <h3 className="mt-3 text-balance text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] text-chalk">
            {project.title}
          </h3>

          <p className="mt-2.5 line-clamp-2 text-pretty text-[0.9375rem] leading-relaxed text-chalk-dim">
            {project.tagline}
          </p>

          <p className="mt-3 line-clamp-3 text-pretty text-[0.8125rem] leading-relaxed text-chalk-faint">
            {project.summary}
          </p>

          <ul className="mt-5 flex flex-wrap gap-1.5">
            {shown.map((item) => (
              <li
                key={item}
                className="rounded-full border border-ink-700 px-2 py-0.5 font-mono text-[0.625rem] leading-5 text-chalk-dim"
              >
                {item}
              </li>
            ))}
            {overflow > 0 ? (
              <li
                className="rounded-full border border-ink-700/60 px-2 py-0.5 font-mono text-[0.625rem] leading-5 text-chalk-faint"
                title={project.stack.slice(STACK_LIMIT).join(", ")}
              >
                {`+${overflow}`}
              </li>
            ) : null}
          </ul>

          {/* mt-auto pins the link to the bottom so cards in a row line up. */}
          <div className="mt-auto pt-6">
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              aria-label={`View repository: ${project.title}`}
              className={cx(
                "inline-flex items-center gap-2 text-sm text-chalk-dim transition-colors duration-500 ease-apple-out",
                t.groupText,
                FOCUS_RING,
                // Stretched link: covers the card so the whole thing is
                // clickable, while staying a single real anchor.
                "after:absolute after:inset-0 after:rounded-[1.75rem] after:content-['']"
              )}
            >
              View repository
              <ArrowUpRight />
            </a>
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}
