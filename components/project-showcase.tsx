"use client";

import { Parallax, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ProjectMedia, accentTheme } from "@/components/project-media";
import type { Project, ProjectMediaSlot } from "@/types/project";

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950";

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

export interface ProjectShowcaseProps {
  project: Project;
  /** Zero-based position among featured projects; drives the big index mark. */
  index: number;
}

/**
 * Full-bleed section for a `featured: true` project.
 *
 * The desktop mechanic is the Apple product-page split: the left column is
 * `position: sticky` so the project's identity stays pinned while the right
 * column — summary, media, metrics, features — streams past it. Two things
 * make that work and are easy to break:
 *   1. `lg:self-start`, so the grid item is not stretched to the row height.
 *      A stretched item is exactly as tall as its track and has nowhere to
 *      stick to.
 *   2. no `overflow-hidden` on any ancestor of the sticky element, which is
 *      why the section wrapper deliberately does not clip.
 * Below `lg` the grid collapses to one column and the column is static.
 */
export function ProjectShowcase({ project, index }: ProjectShowcaseProps) {
  const t = accentTheme[project.accent];
  const titleId = `${project.slug}-title`;
  const number = String(index + 1).padStart(2, "0");

  // One slot may be marked `lead`; fall back to the first slot so a project
  // that forgets the flag still gets a hero image rather than nothing.
  const lead: ProjectMediaSlot | undefined =
    project.media.find((slot) => slot.lead) ?? project.media[0];
  const rest = project.media.filter((slot) => slot !== lead);

  return (
    <section
      id={project.slug}
      aria-labelledby={titleId}
      className="relative scroll-mt-24"
    >
      {/* Full-width hairline between consecutive showcases. */}
      {index > 0 ? <div aria-hidden className="hairline w-full" /> : null}

      <div className="shell grid grid-cols-1 gap-x-12 gap-y-12 py-20 sm:py-28 lg:grid-cols-12 lg:gap-x-16 lg:py-32">
        {/* ---------------------------------------------------------- */}
        {/* Sticky identity column                                      */}
        {/* ---------------------------------------------------------- */}
        <header className="min-w-0 lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
          <Reveal y={20}>
            {/* Quiet structural marker — deliberately near-invisible. */}
            <div
              aria-hidden
              className="font-mono text-[clamp(3rem,6vw,4.75rem)] font-medium leading-none tracking-[-0.05em] text-chalk-faint/30"
            >
              {number}
            </div>

            <p className="eyebrow mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span>{project.category}</span>
              <span
                aria-hidden
                className="inline-block h-[3px] w-[3px] rounded-full bg-chalk-faint/70"
              />
              <span>{project.year}</span>
            </p>

            <h2
              id={titleId}
              className="mt-4 text-balance text-headline text-chalk"
            >
              {project.title}
            </h2>

            <p className="mt-5 max-w-[34ch] text-pretty text-lede text-chalk-dim">
              {project.tagline}
            </p>

            {/* Honesty note about forked/extended work — modest, not hidden. */}
            {project.origin ? (
              <p className="mt-5 max-w-[40ch] text-pretty text-[0.8125rem] italic leading-relaxed text-chalk-faint">
                {project.origin}
              </p>
            ) : null}

            <ul className="mt-7 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-ink-700 px-2.5 py-1 font-mono text-[0.6875rem] leading-5 text-chalk-dim"
                >
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className={cx(
                  "group inline-flex items-center gap-2 rounded-full border border-ink-600 px-4 py-2 text-sm text-chalk transition-colors duration-500 ease-apple-out",
                  t.hoverBorder,
                  t.hoverText,
                  FOCUS_RING
                )}
              >
                View repository
                <ArrowUpRight />
              </a>

              {project.demo ? (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  className={cx(
                    "group inline-flex items-center gap-1.5 rounded-full text-sm text-chalk-dim transition-colors duration-500 ease-apple-out hover:text-chalk",
                    FOCUS_RING
                  )}
                >
                  Live demo
                  <ArrowUpRight />
                </a>
              ) : null}
            </div>
          </Reveal>
        </header>

        {/* ---------------------------------------------------------- */}
        {/* Scrolling detail column                                     */}
        {/* ---------------------------------------------------------- */}
        <div className="min-w-0 lg:col-span-7">
          <Reveal y={20}>
            <p className="max-w-prose text-pretty text-lede text-chalk-dim">
              {project.summary}
            </p>
          </Reveal>

          {lead ? (
            <Reveal className="mt-12" y={32} duration={1}>
              {/* Depth: the hero frame drifts slightly against the scroll. */}
              <Parallax distance={22}>
                <ProjectMedia
                  slot={lead}
                  slug={project.slug}
                  accent={project.accent}
                  priority={index === 0}
                />
              </Parallax>
            </Reveal>
          ) : null}

          {project.metrics && project.metrics.length > 0 ? (
            <div className="mt-14">
              <div aria-hidden className="hairline mb-8" />
              <Stagger className="grid grid-cols-2 gap-y-9 sm:grid-cols-4 sm:gap-y-0">
                {project.metrics.map((metric) => (
                  <StaggerItem
                    key={metric.label}
                    className="min-w-0 border-l border-ink-700 pl-4 sm:pl-5"
                  >
                    {/* Values are strings, not always numerals ("Cyclone V",
                        "36.3 KB"), so this wraps rather than assuming digits. */}
                    <div className="break-words text-[clamp(1.35rem,2.6vw,1.85rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-chalk">
                      {metric.value}
                    </div>
                    <div className="eyebrow mt-3 leading-relaxed tracking-[0.12em]">
                      {metric.label}
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          ) : null}

          <Stagger className="mt-16">
            <ol className="border-l border-ink-700">
              {project.features.map((feature, i) => (
                <li key={feature.title} className="relative py-6 pl-6 sm:pl-8">
                  {/* Accent tick painted over the rule — one per item. */}
                  <span
                    aria-hidden
                    className={cx("absolute -left-px top-6 h-7 w-px", t.bar)}
                  />
                  <StaggerItem>
                    <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-2.5 text-balance text-[1.0625rem] font-medium tracking-[-0.01em] text-chalk sm:text-lg">
                      {feature.title}
                    </h3>
                    <p className="mt-2.5 max-w-prose text-pretty text-[0.9375rem] leading-relaxed text-chalk-dim">
                      {feature.detail}
                    </p>
                  </StaggerItem>
                </li>
              ))}
            </ol>
          </Stagger>

          {rest.length > 0 ? (
            <Stagger
              className={cx(
                "mt-14 grid grid-cols-1 gap-6",
                rest.length > 1 && "sm:grid-cols-2"
              )}
            >
              {rest.map((slot) => (
                <StaggerItem key={slot.file} className="min-w-0">
                  <ProjectMedia
                    slot={slot}
                    slug={project.slug}
                    accent={project.accent}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          ) : null}
        </div>
      </div>
    </section>
  );
}
