"use client";

import { useState } from "react";
import { withBasePath } from "@/lib/paths";

export interface LiveDemoProps {
  /** Path under /public to a self-contained HTML file. */
  src: string;
  title: string;
  /** Shown on the poster before the demo is loaded. */
  hint?: string;
  repo: string;
}

/**
 * Click-to-load embed. Deliberately NOT auto-loading: the demo pulls Three.js
 * and builds a few thousand particles, which is rude to do unprompted on a
 * page someone is only scrolling past. It also means a missing demo file shows
 * this poster rather than a host's 404 page rendered inside the frame.
 */
export function LiveDemo({ src, title, hint, repo }: LiveDemoProps) {
  const [live, setLive] = useState(false);
  const resolved = withBasePath(src);

  return (
    <figure className="not-prose my-10">
      <div className="relative overflow-hidden rounded-2xl border border-ink-600 bg-ink-850">
        <div className="aspect-[16/10] w-full">
          {live ? (
            <iframe
              src={resolved}
              title={title}
              className="h-full w-full border-0"
              loading="lazy"
              // The demo is first-party but sandboxed anyway: scripts and same-origin
              // only, so it can run WebGL without reaching navigation or storage APIs.
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <button
              type="button"
              onClick={() => setLive(true)}
              className="group relative flex h-full w-full flex-col items-center justify-center gap-4 blueprint-grid transition-colors duration-500 ease-apple-out hover:bg-ink-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-soft focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
              aria-label={`Load the interactive demo: ${title}`}
            >
              <span
                aria-hidden
                className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-grad shadow-lg shadow-violet/30 transition-transform duration-500 ease-apple-out group-hover:scale-110"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-0.5 fill-white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="text-lg font-medium text-chalk">Run it here</span>
              {hint ? (
                <span className="max-w-sm px-6 text-center text-sm text-chalk-dim">{hint}</span>
              ) : null}
            </button>
          )}
        </div>
      </div>

      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-chalk-faint">
        <span>
          {live ? "Drag to rotate · scroll to zoom · type to change the message" : "Interactive — runs in the page"}
        </span>
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
