"use client";

import type { ReactElement } from "react";

import { GalleryTile } from "@/components/gallery-tile";
import { Reveal } from "@/components/motion";
import { SectionHeader } from "@/components/section-header";
import { gallery } from "@/data/gallery";

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * Which visual column a tile lands in at lg, given that the first tile spans
 * two of the three columns. Drives the reveal cascade, so a row lights up
 * left-to-right instead of the whole grid arriving at once.
 */
function columnOf(index: number): number {
  if (index === 0) return 0;
  return (index + 1) % 3;
}

export interface ProjectGalleryProps {
  /** Anchor target so the nav can jump straight here. */
  id?: string;
}

/**
 * The browse-everything grid: every public repo as one image and one title.
 *
 * Deliberately not filterable. The twelve tiles carry eleven distinct tags,
 * so a filter row would mostly be buttons that reduce the grid to a single
 * tile — a clean static grid reads better and stays keyboard-trivial.
 *
 * Tiles are their own links (see GalleryTile), so this component adds no
 * interactivity of its own.
 */
export function ProjectGallery({ id }: ProjectGalleryProps): ReactElement {
  return (
    <section
      id={id}
      className="relative overflow-hidden border-t border-ink-700 py-24 scroll-mt-24 sm:py-32"
    >
      {/* Ambient: one soft brand bloom behind the header. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-center"
      >
        <div className="h-[380px] w-[min(880px,90vw)] rounded-full bg-brand-grad-soft opacity-[0.09] blur-3xl" />
      </div>

      <div className="shell relative">
        <SectionHeader
          eyebrow="02 / Everything"
          title="The whole shelf, at a glance."
          description="Every public repository, one tile each. Click through to the full write-up below, or head straight out to the repo on GitHub."
        />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {gallery.map((item, index) => (
            <Reveal
              key={item.slug}
              // The first tile takes two columns at lg; GalleryTile widens its
              // own aspect ratio to match, so the row stays level.
              className={cx("h-full min-w-0", index === 0 && "lg:col-span-2")}
              y={24}
              duration={0.7}
              delay={columnOf(index) * 0.08}
            >
              <GalleryTile item={item} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
