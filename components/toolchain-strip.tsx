"use client";

import { Stagger, StaggerItem, useReducedMotion } from "@/components/motion";
import { SectionHeader } from "@/components/section-header";
import { toolchain } from "@/data/site";

export interface ToolchainStripProps {
  id?: string;
}

interface ToolGroup {
  readonly group: string;
  readonly items: readonly string[];
}

/**
 * `toolchain` is declared `as const`, so it arrives as a readonly tuple of
 * readonly tuples. Widening it once here keeps every `.map()` below off the
 * "union of tuple signatures" cliff without any casting.
 */
const GROUPS: readonly ToolGroup[] = toolchain;

/** Every tool name in order, flattened, for the marquee ribbon. */
const ALL_TOOLS: readonly string[] = GROUPS.flatMap((group): readonly string[] => group.items);

/**
 * One pass of the ribbon. Each item carries its own trailing dot with
 * symmetric margins, so the gap across the seam between the two copies is
 * identical to the gap inside a copy and the loop reads as continuous.
 */
function MarqueeTrack({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={duplicate || undefined}>
      {ALL_TOOLS.map((tool, index) => (
        <li key={`${tool}-${index}`} className="flex shrink-0 items-center">
          <span className="whitespace-nowrap font-mono text-sm text-chalk-faint transition-colors duration-500 ease-apple hover:text-chalk sm:text-base">
            {tool}
          </span>
          <span aria-hidden className="mx-6 h-1 w-1 shrink-0 rounded-full bg-signal/40 sm:mx-9" />
        </li>
      ))}
    </ul>
  );
}

/**
 * The "what I actually work in" section: an infinite ribbon of every tool,
 * then the same tools organised into their five groups.
 */
export function ToolchainStrip({ id }: ToolchainStripProps) {
  const reduce = useReducedMotion();

  return (
    <section id={id} className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="shell">
        <SectionHeader
          eyebrow="Toolchain"
          title="What I actually work in."
          description="Languages, simulators and boards I reach for by default — the ones I've taped a project out with, not the ones I've only read about."
        />
      </div>

      {/*
        Full-bleed marquee. The track holds the item list twice and
        `animate-marquee` translates it -50%: exactly one copy's width, so the
        instant it snaps back the second copy is already sitting where the
        first one was. `overflow-hidden` here is what keeps the page from
        scrolling sideways.
      */}
      <div className="mt-14 sm:mt-20">
        {reduce ? (
          <div className="shell">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {ALL_TOOLS.map((tool) => (
                <li
                  key={tool}
                  className="font-mono text-sm text-chalk-faint transition-colors duration-500 hover:text-chalk"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="group relative mask-fade-edges overflow-hidden py-5">
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused] group-hover:[animation-play-state:paused]">
              <MarqueeTrack />
              {/* Second pass is decorative duplication — keep it off the a11y tree. */}
              <MarqueeTrack duplicate />
            </div>
          </div>
        )}
      </div>

      <div className="shell">
        <Stagger className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 sm:mt-20">
          {GROUPS.map((group) => (
            <StaggerItem key={group.group}>
              <h3 className="eyebrow">{group.group}</h3>
              <div className="hairline mt-4" />
              <ul className="mt-4">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="group/tool flex items-center gap-2 py-1.5 text-sm text-chalk-dim transition-colors duration-500 ease-apple hover:text-chalk"
                  >
                    {/* Slot is always 12px wide, so the tick can't shove the label. */}
                    <span
                      aria-hidden
                      className="h-px w-3 shrink-0 origin-left scale-x-0 bg-signal opacity-0 transition-all duration-500 ease-apple-out group-hover/tool:scale-x-100 group-hover/tool:opacity-100"
                    />
                    <span className="min-w-0">{item}</span>
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
