"use client";

import type { ReactNode } from "react";

import { GradientRule, GridPanel, Orb } from "@/components/decor";
import { Reveal } from "@/components/motion";
import { site } from "@/data/site";

export interface SiteFooterProps {
  id?: string;
}

const MAILTO = `mailto:${site.links.email}`;

/* ------------------------------------------------------------------ */
/* Icons — hand-drawn 24x24 strokes. No icon library in this project.  */
/* ------------------------------------------------------------------ */

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function GitHubGlyph() {
  return (
    <Glyph>
      <path d="M8.6 20.1c-3.6 1.1-3.6-1.9-5.1-2.3" />
      <path d="M15.4 21.4v-3c0-.9.1-1.3-.5-1.8 2.6-.3 5.1-1.3 5.1-5.5a4.3 4.3 0 0 0-1.2-3 4 4 0 0 0-.1-3s-1-.3-3.3 1.2a11.6 11.6 0 0 0-5.8 0C7.3 4.8 6.3 5.1 6.3 5.1a4 4 0 0 0-.1 3 4.3 4.3 0 0 0-1.2 3c0 4.2 2.5 5.2 5.1 5.5-.6.5-.5 1-.5 1.8v3" />
    </Glyph>
  );
}

function LinkedInGlyph() {
  return (
    <Glyph>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="3.4" />
      <path d="M7.7 10.7V17" />
      <path d="M11.7 17v-6.3" />
      <path d="M11.7 13.5c0-1.6 1-2.8 2.5-2.8s2.5 1.2 2.5 2.8V17" />
      <path d="M7.7 7.2h.01" />
    </Glyph>
  );
}

function MailGlyph() {
  return (
    <Glyph>
      <rect x="2.6" y="4.8" width="18.8" height="14.4" rx="2.6" />
      <path d="M3.6 7.6l7.5 5a1.7 1.7 0 0 0 1.8 0l7.5-5" />
    </Glyph>
  );
}

function ArrowUpGlyph() {
  return (
    <Glyph>
      <path d="M12 19.4V5.3" />
      <path d="M6.3 11L12 5.3 17.7 11" />
    </Glyph>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Social link as an icon tile plus a label. The tile's gradient border is a
 * separate layer that fades in, rather than a border-colour transition —
 * `.grad-border` paints its edge with a background, which cannot be animated
 * from a flat colour.
 */
function FooterLink({
  href,
  label,
  external = false,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={external ? `${label} (opens in a new tab)` : label}
      {...(external ? { target: "_blank" as const, rel: "noreferrer" } : {})}
      className="group inline-flex items-center gap-3 rounded-xl py-2 pr-3 text-sm text-chalk-dim transition-colors duration-500 ease-apple hover:text-chalk focus-visible:text-chalk"
    >
      <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-ink-600/70 bg-ink-850/50 text-chalk-faint transition-all duration-500 ease-apple-out group-hover:-translate-y-0.5 group-hover:border-transparent group-hover:text-chalk group-focus-visible:border-transparent group-focus-visible:text-chalk">
        <span
          aria-hidden
          className="grad-border absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 ease-apple-out group-hover:opacity-100 group-focus-visible:opacity-100"
        />
        <span className="relative">{children}</span>
      </span>
      <span>{label}</span>
    </a>
  );
}

/** Closing section — doubles as contact. Deliberately the loudest block. */
export function SiteFooter({ id }: SiteFooterProps) {
  // Computed at render, so a rebuild always ships the right year. The static
  // export bakes in the build-time value, hence suppressHydrationWarning on
  // the node that prints it.
  const year = new Date().getFullYear();

  return (
    <footer id={id} className="relative isolate scroll-mt-24 overflow-hidden pt-28 sm:pt-40">
      {/* Ambient close: the blueprint band resolves into the brand hues, so the
          page ends on the same two colours it opened with. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <GridPanel variant="blueprint" fade="top" opacity={0.7} className="inset-x-0 bottom-0 h-72" />
        <Orb color="violet" size="lg" position="bottom-center" opacity={0.18} drift driftDuration={31} />
        <Orb color="cyan" size="md" position="bottom-left" opacity={0.14} drift driftDuration={41} driftDelay={-17} />
      </div>

      <div className="shell">
        <Reveal className="flex items-center gap-4 sm:gap-6" y={14} duration={0.7}>
          <span className="eyebrow">Contact</span>
          <GradientRule className="min-w-0 flex-1" opacity={0.55} animate />
        </Reveal>

        <Reveal as="h2" className="mt-8 max-w-[20ch] text-balance text-headline gradient-text" delay={0.06}>
          {"Let's build something that has to work."}
        </Reveal>

        <Reveal as="p" className="mt-6 max-w-prose text-pretty text-lede text-chalk-dim" delay={0.12}>
          {
            "Open to internships and new-grad roles in design verification, RTL and embedded systems. Email is the fastest way to reach me — I read all of it."
          }
        </Reveal>

        {/* The single loudest interactive element on the page. Two stacked
            copies of the address: the base one carries the colour transition,
            the gradient one fades in over it on hover. Cross-fading is the only
            way to animate `background-clip: text` — there is no interpolation
            between a solid colour and a clipped gradient. The overlay is
            aria-hidden so the address is announced exactly once. */}
        <Reveal className="mt-12 sm:mt-16" delay={0.18}>
          <a
            href={MAILTO}
            className="group relative inline-block max-w-full break-words rounded-md text-[clamp(1.5rem,6vw,4rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-chalk-dim transition-colors duration-700 ease-apple-out hover:text-chalk focus-visible:text-chalk"
          >
            <span className="relative">{site.links.email}</span>
            <span
              aria-hidden
              className="brand-text pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-apple-out group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              {site.links.email}
            </span>
            {/* Underline wipes in from the left on hover / keyboard focus. */}
            <span
              aria-hidden
              className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-brand-grad transition-transform duration-700 ease-apple-out group-hover:scale-x-100 group-focus-visible:scale-x-100 sm:-bottom-2"
            />
          </a>
        </Reveal>

        <Reveal className="mt-12 sm:mt-16" delay={0.24}>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <li>
              <FooterLink href={site.links.github} label="GitHub" external>
                <GitHubGlyph />
              </FooterLink>
            </li>
            <li>
              <FooterLink href={site.links.linkedin} label="LinkedIn" external>
                <LinkedInGlyph />
              </FooterLink>
            </li>
            <li>
              <FooterLink href={MAILTO} label="Email">
                <MailGlyph />
              </FooterLink>
            </li>
          </ul>
        </Reveal>
      </div>

      <div className="shell mt-24 sm:mt-32">
        <GradientRule opacity={0.35} origin="center" />
        <div className="flex flex-col gap-5 py-8 text-xs text-chalk-faint sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <p suppressHydrationWarning>
            © {year} {site.name} — {site.role}
          </p>
          <p className="sm:order-3">Built with Next.js and Tailwind CSS.</p>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 self-start rounded-md py-1 transition-colors duration-500 ease-apple hover:text-chalk focus-visible:text-chalk sm:order-2 sm:self-auto"
          >
            <span>Back to top</span>
            <span className="inline-block transition-transform duration-500 ease-apple-out group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
              <ArrowUpGlyph />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
