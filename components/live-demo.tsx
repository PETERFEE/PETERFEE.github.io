"use client";

import { withBasePath } from "@/lib/paths";

export interface LiveDemoProps {
  /** Path under /public, or an absolute URL, to a self-contained HTML demo. */
  src: string;
  title: string;
  /** Short line describing how to interact with it. */
  hint?: string;
  repo: string;
}

/**
 * The demo embedded live — the project IS the interface, so hiding it behind a
 * poster would be hiding the work itself.
 *
 * Sizing: the heart is a tall shape, so this is height-driven rather than a
 * fixed aspect — 78vh capped at 900px, floored at 420px. That gives a tall
 * canvas on phones and a generous one on desktop without ever pushing the rest
 * of the page off screen.
 */
export function LiveDemo({ src, title, hint, repo }: LiveDemoProps) {
  const resolved = withBasePath(src);

  return (
    <figure className="not-prose my-10">
      <div className="relative overflow-hidden rounded-2xl border border-ink-600 bg-black">
        {/* A quiet brand hairline along the top edge, so the frame reads as part
            of the page rather than a bare cutout. */}
        <div aria-hidden className="absolute inset-x-0 top-0 z-10 h-px bg-brand-grad opacity-60" />
        <iframe
          src={resolved}
          title={title}
          // bg-black matters: an iframe paints its own background, so while it
          // loads (or if the demo host is unreachable) the default white would
          // flash a bright slab onto a near-black page.
          className="block h-[min(78vh,900px)] min-h-[420px] w-full border-0 bg-black"
          loading="lazy"
          // First-party, but scoped anyway: enough for WebGL and its own input
          // handling, nothing that reaches navigation, downloads or popups.
          sandbox="allow-scripts allow-same-origin"
          allow="accelerometer; gyroscope"
        />
      </div>

      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm text-chalk-faint">
        <span>{hint ?? "Interactive — running live in the page"}</span>
        <span className="flex flex-wrap items-center gap-x-5 gap-y-1">
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
            Source on GitHub ↗
          </a>
        </span>
      </figcaption>
    </figure>
  );
}
