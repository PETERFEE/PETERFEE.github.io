import { withBasePath } from "@/lib/paths";

export interface DemoStageProps {
  src: string;
  title: string;
  repo: string;
  /** Element id of the write-up, used by the jump button. */
  detailsId: string;
}

/**
 * Full-viewport opening for a project whose demo IS the point.
 *
 * Deliberately NOT scroll-choreographed. The demo owns the wheel — inside the
 * frame, scrolling zooms the heart — so any scroll-linked fade would put two
 * meanings on one gesture and lose both: the page would fight the model, and
 * the reader would never be sure which they were driving. The write-up is
 * reached by an explicit button instead, which is unambiguous and also works
 * for keyboard and touch.
 *
 * No hooks, so this stays a server component and ships no JavaScript.
 */
export function DemoStage({ src, title, repo, detailsId }: DemoStageProps) {
  const resolved = withBasePath(src);

  return (
    <section
      aria-label={`${title} — interactive demo`}
      className="relative h-screen w-full overflow-hidden bg-black supports-[height:100svh]:h-[100svh]"
    >
      <iframe
        src={resolved}
        title={title}
        // An iframe paints its own background; without bg-black the browser
        // default flashes a white slab onto a near-black page while loading.
        className="block h-full w-full border-0 bg-black"
        sandbox="allow-scripts allow-same-origin"
        allow="accelerometer; gyroscope"
      />

      {/* Controls sit in a strip below the canvas so they never cover the model
          and never intercept a drag meant for it. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent pb-7 pt-20">
        <div className="shell flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:justify-between">
          <p className="order-2 text-center text-sm text-chalk-dim sm:order-1 sm:text-left">
            Drag to rotate · scroll inside the frame to zoom · type to change the message
          </p>

          <div className="pointer-events-auto order-1 flex flex-wrap items-center justify-center gap-3 sm:order-2">
            <a href={`#${detailsId}`} className="btn-brand">
              Read the write-up
              <span aria-hidden>↓</span>
            </a>
            <a href={resolved} target="_blank" rel="noreferrer" className="btn-glass">
              Full screen
              <span aria-hidden>↗</span>
            </a>
            <a href={repo} target="_blank" rel="noreferrer" className="btn-glass">
              Source
              <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
