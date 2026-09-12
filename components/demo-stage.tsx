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
 * The controls sit in their own row BELOW the frame, never overlaid on it.
 * An overlay looks tidier but collides with the demo's own UI: this demo
 * anchors its text input to the bottom of its viewport, and on a phone an
 * overlaid caption lands exactly on top of the field you are trying to type
 * into. A flex column gives the demo every pixel it is entitled to and leaves
 * the page's controls somewhere they can never overlap.
 *
 * Deliberately not scroll-choreographed either: the demo owns the wheel
 * (scrolling inside it zooms the model), so a scroll-linked fade would put two
 * meanings on one gesture. The write-up is reached by an explicit button.
 *
 * No hooks, so this stays a server component and ships no JavaScript.
 */
export function DemoStage({ src, title, repo, detailsId }: DemoStageProps) {
  const resolved = withBasePath(src);

  return (
    <section
      aria-label={`${title} — interactive demo`}
      className="flex h-screen w-full flex-col bg-black supports-[height:100svh]:h-[100svh]"
    >
      <iframe
        src={resolved}
        title={title}
        // flex-1 + min-h-0 so the frame takes the remaining height and can
        // actually shrink; without min-h-0 a flex child refuses to go below
        // its content size and pushes the control row off screen.
        className="min-h-0 w-full flex-1 border-0 bg-black"
        sandbox="allow-scripts allow-same-origin"
        allow="accelerometer; gyroscope"
      />

      <div className="shrink-0 border-t border-ink-700 bg-ink-950 pb-[max(0.875rem,env(safe-area-inset-bottom))] pt-3.5">
        <div className="shell flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
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
    </section>
  );
}
