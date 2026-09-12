"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, type Variants } from "framer-motion";
import { GradientRule, GridPanel, Orb } from "@/components/decor";
import { EASE, useReducedMotion } from "@/components/motion";
import { site } from "@/data/site";

/** Pixels of scroll before the bar frosts over. Matches apple.com's feel: far
 *  enough that a trackpad nudge doesn't flicker it, close enough that the bar
 *  is solid before the hero headline slides under it. */
const FROST_AT = 80;

const panelVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.4, ease: EASE, staggerChildren: 0.06, delayChildren: 0.06 },
  },
  exit: { opacity: 0, transition: { duration: 0.28, ease: EASE, when: "afterChildren" } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
  exit: { opacity: 0, y: 10, filter: "blur(4px)", transition: { duration: 0.2, ease: EASE } },
};

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden focusable="false" className={className}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

/**
 * Link label with a brand-gradient underline. It wipes in from the left on
 * hover/focus, and stays drawn while its section is the one you are reading.
 */
function NavLink({
  href,
  label,
  active = false,
  onClick,
}: {
  href: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={cx(
        "group relative inline-block rounded-sm py-1 text-sm transition-colors duration-300 ease-apple focus-visible:text-chalk",
        active ? "text-chalk" : "text-chalk-dim hover:text-chalk"
      )}
    >
      {label}
      {/* The rule itself. */}
      <span
        aria-hidden
        className={cx(
          "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-brand-grad transition-transform duration-500 ease-apple-out group-hover:scale-x-100 group-focus-visible:scale-x-100",
          active ? "scale-x-100" : "scale-x-0"
        )}
      />
      {/* A 3px bloom under it, so the underline reads as lit rather than drawn.
          Tiny box, hover-only — nothing here is expensive. */}
      <span
        aria-hidden
        className={cx(
          "absolute inset-x-0 -bottom-1 h-[3px] bg-brand-grad blur-[3px] transition-opacity duration-500 ease-apple-out group-hover:opacity-70 group-focus-visible:opacity-70",
          active ? "opacity-70" : "opacity-0"
        )}
      />
    </a>
  );
}

export interface SiteNavProps {
  className?: string;
}

export function SiteNav({ className }: SiteNavProps) {
  const [frosted, setFrosted] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string>("");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  // useMotionValueEvent keeps the scroll listener off the React render path;
  // only the boolean crossing the threshold ever causes a re-render.
  useMotionValueEvent(scrollY, "change", (v) => {
    const next = v > FROST_AT;
    setFrosted((prev) => (prev === next ? prev : next));
  });

  // Deep links and browser scroll restoration can land us mid-page on mount,
  // before any "change" event fires — seed the state from the current offset.
  useEffect(() => {
    setFrosted(scrollY.get() > FROST_AT);
  }, [scrollY]);

  // Which section is being read. IntersectionObserver rather than a scroll
  // handler, so this costs nothing per frame. The rootMargin leaves a thin
  // band ~22% down the viewport; whichever section covers that band wins, and
  // nav order breaks the tie when two overlap it during a fast scroll.
  useEffect(() => {
    const hrefs: string[] = site.nav
      .map((item) => item.href)
      .filter((href) => href.startsWith("#"));

    // Element -> href, so the observer callback never has to search.
    const byHref = new Map<Element, string>();
    for (const href of hrefs) {
      const el = document.getElementById(href.slice(1));
      if (el !== null) byHref.set(el, href);
    }
    if (byHref.size === 0) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const href = byHref.get(entry.target);
          if (href === undefined) continue;
          if (entry.isIntersecting) visible.add(href);
          else visible.delete(href);
        }
        const next = hrefs.find((href) => visible.has(href)) ?? "";
        setActiveHref((prev) => (prev === next ? prev : next));
      },
      { rootMargin: "-22% 0px -72% 0px", threshold: 0 }
    );

    byHref.forEach((_href, el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const close = useCallback(() => {
    // Release the scroll lock *synchronously*. A tap on a panel link closes the
    // panel and then lets the browser act on the hash — but the default action
    // runs before React flushes this state change and tears the lock down, and
    // `overflow: hidden` on body propagates to the viewport, so the jump would
    // land on a document that cannot scroll and be lost.
    document.body.style.overflow = "";
    setOpen(false);
  }, []);

  // Escape closes, and focus goes back to the control that opened the panel.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    // Growing past the md breakpoint while open would strand an invisible
    // overlay over the desktop layout.
    const wide = window.matchMedia("(min-width: 768px)");
    const onWide = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    wide.addEventListener("change", onWide);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  // While the overlay is up the bar rides on top of it, so it stays clear.
  const solid = frosted && !open;
  const barTransition = { duration: reduce ? 0 : 0.4, ease: EASE };

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-apple",
          solid
            ? "bg-ink-950/70 backdrop-blur-xl backdrop-saturate-150"
            : "bg-transparent backdrop-blur-0",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* Frost furniture, all of it fading in together with the bar.
            A top highlight gives the glass thickness; the bottom edge is a
            neutral hairline with the brand gradient laid over it, which is
            the only colour the bar ever shows. */}
        <div
          aria-hidden
          className={cx(
            "pointer-events-none absolute inset-0 transition-opacity duration-500 ease-apple",
            solid ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-ink-700/80" />
          <GradientRule className="absolute inset-x-0 bottom-0" opacity={0.5} origin="center" />
        </div>

        <nav aria-label="Primary" className="shell relative flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
          <a
            href="#top"
            onClick={close}
            className="group relative rounded-sm text-sm font-medium tracking-tight text-chalk transition-opacity duration-300 ease-apple hover:opacity-80"
          >
            {site.name}
            <span
              aria-hidden
              className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-brand-grad transition-transform duration-500 ease-apple-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
            />
          </a>

          <div className="flex items-center gap-6 md:gap-8">
            <ul className="hidden items-center gap-7 md:flex lg:gap-9">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href} label={item.label} active={activeHref === item.href} />
                </li>
              ))}
            </ul>

            <a
              href={site.links.github}
              target="_blank"
              rel="noreferrer"
              aria-label={`${site.name} on GitHub (opens in a new tab)`}
              className="group relative grid h-9 w-9 place-items-center rounded-full text-chalk-dim transition-colors duration-300 ease-apple hover:text-chalk focus-visible:text-chalk"
            >
              {/* A gradient-bordered tile that materialises under the mark.
                  `.grad-border` carries both the fill and the 1px gradient
                  edge, so one fading layer does the whole effect. */}
              <span
                aria-hidden
                className="grad-border absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 ease-apple-out group-hover:opacity-100 group-focus-visible:opacity-100"
              />
              <GitHubMark className="relative h-[1.125rem] w-[1.125rem] transition-transform duration-500 ease-apple-out group-hover:-translate-y-px" />
            </a>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-nav-panel"
              aria-label={open ? "Close menu" : "Open menu"}
              className="-mr-1 rounded-sm p-2 text-chalk md:hidden"
            >
              {/* Two rules that slide together and cross. The `top-*` classes are
                  the no-JS/pre-hydration fallback; framer-motion overwrites them
                  inline once mounted. */}
              <span aria-hidden className="relative block h-3.5 w-5">
                <motion.span
                  className="absolute left-0 top-[15%] block h-px w-full bg-current"
                  initial={false}
                  animate={open ? { top: "50%", y: "-50%", rotate: 45 } : { top: "15%", y: "0%", rotate: 0 }}
                  transition={barTransition}
                />
                <motion.span
                  className="absolute left-0 top-[85%] block h-px w-full bg-current"
                  initial={false}
                  animate={open ? { top: "50%", y: "-50%", rotate: -45 } : { top: "85%", y: "0%", rotate: 0 }}
                  transition={barTransition}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="site-nav-panel"
            key="site-nav-panel"
            variants={panelVariants}
            initial={reduce ? false : "hidden"}
            animate="show"
            exit={reduce ? undefined : "exit"}
            className="fixed inset-0 z-40 bg-ink-950/95 backdrop-blur-2xl md:hidden"
          >
            {/* The overlay gets the same treatment as the page behind it, so
                opening the menu is a lighting change rather than a blackout. */}
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
              <Orb color="violet" size="md" position="top-right" opacity={0.2} />
              <Orb color="cyan" size="sm" position="bottom-left" opacity={0.16} />
              <GridPanel variant="dot" fade="radial" opacity={0.35} />
            </div>

            <nav aria-label="Mobile" className="shell relative flex h-full flex-col justify-center pb-16">
              <ul className="flex flex-col gap-2">
                {site.nav.map((item, i) => (
                  <motion.li key={item.href} variants={reduce ? undefined : itemVariants}>
                    <a
                      href={item.href}
                      onClick={close}
                      className="group flex items-baseline gap-4 rounded-sm py-2 text-headline font-medium tracking-tight text-chalk transition-opacity duration-300 ease-apple hover:opacity-70"
                    >
                      <span
                        aria-hidden
                        className="font-mono text-xs tracking-[0.22em] text-chalk-faint transition-colors duration-300 ease-apple group-hover:text-violet-soft"
                      >
                        {`0${i + 1}`}
                      </span>
                      <span>{item.label}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div variants={reduce ? undefined : itemVariants} className="mt-10">
                <GradientRule className="mb-8 max-w-[10rem]" opacity={0.6} />
                <a
                  href={site.links.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={close}
                  className="eyebrow inline-flex items-center gap-2 rounded-sm text-chalk-dim transition-colors duration-300 ease-apple hover:text-chalk"
                >
                  <GitHubMark className="h-4 w-4" />
                  GitHub
                </a>
              </motion.div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default SiteNav;
