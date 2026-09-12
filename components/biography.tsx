"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { Avatar } from "@/components/avatar";
import { Reveal, Stagger, StaggerItem, staggerChild, staggerParent, useReducedMotion } from "@/components/motion";
import { bio } from "@/data/bio";
import { site } from "@/data/site";

/* ------------------------------------------------------------------ */
/* Biography — the academic-CV profile widget, rebuilt in this site's   */
/* dark Apple-restraint idiom: a sticky portrait rail on the left, the  */
/* prose / interests / education column on the right.                   */
/* ------------------------------------------------------------------ */

export interface BiographyProps {
  /** Anchor target for the nav. Defaults to "about". */
  id?: string;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ */
/* Staggered lists with real list semantics.                            */
/*                                                                      */
/* Stagger/StaggerItem render <div>s, which would cost these blocks     */
/* their list role. These reuse the shared variants on <ul>/<li>        */
/* instead — variant inheritance travels through React context, so the  */
/* parent/child relationship still works.                               */
/* ------------------------------------------------------------------ */

function StaggerList({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <ul className={className}>{children}</ul>;
  return (
    <motion.ul
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {children}
    </motion.ul>
  );
}

function StaggerListItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <li className={className}>{children}</li>;
  return (
    <motion.li className={className} variants={staggerChild}>
      {children}
    </motion.li>
  );
}

/* ------------------------------------------------------------------ */
/* Icons — hand-drawn 24x24 strokes. No icon library in this project.   */
/* ------------------------------------------------------------------ */

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="relative"
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

function CapGlyph() {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.8 9.3 12 5l9.2 4.3-9.2 4.3-9.2-4.3Z" />
      <path d="M6.9 11.3v4.2c0 .5.3 1 .8 1.2a9.6 9.6 0 0 0 8.6 0c.5-.2.8-.7.8-1.2v-4.2" />
      <path d="M21.2 9.3v4.8" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Social rail                                                          */
/* ------------------------------------------------------------------ */

interface SocialLink {
  key: string;
  href: string;
  label: string;
  external: boolean;
  glyph: ReactNode;
}

const SOCIALS: readonly SocialLink[] = [
  { key: "github", href: site.links.github, label: "GitHub", external: true, glyph: <GitHubGlyph /> },
  { key: "linkedin", href: site.links.linkedin, label: "LinkedIn", external: true, glyph: <LinkedInGlyph /> },
  { key: "email", href: `mailto:${site.links.email}`, label: "Email", external: false, glyph: <MailGlyph /> },
];

function SocialRow() {
  return (
    <ul className="mt-7 flex items-center justify-center gap-2.5 lg:justify-start">
      {SOCIALS.map((link) => (
        <li key={link.key}>
          <a
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noreferrer" : undefined}
            aria-label={link.external ? `${link.label} (opens in a new tab)` : link.label}
            className="group relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-ink-600 text-chalk-dim transition duration-300 ease-apple hover:-translate-y-0.5 hover:border-violet/50 hover:text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-soft focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
          >
            {/* The gradient the icon picks up on hover. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-brand-grad opacity-0 transition-opacity duration-500 ease-apple-out group-hover:opacity-20"
            />
            {link.glyph}
          </a>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                              */
/* ------------------------------------------------------------------ */

/** Soft brand bloom used twice as ambient decoration. */
const ORB_VIOLET =
  "radial-gradient(circle at 50% 50%, rgba(139,92,246,0.20), rgba(99,102,241,0.08) 45%, transparent 70%)";
const ORB_CYAN =
  "radial-gradient(circle at 50% 50%, rgba(6,182,212,0.16), rgba(34,211,238,0.06) 45%, transparent 70%)";

export function Biography({ id = "about" }: BiographyProps) {
  const reduce = useReducedMotion();

  return (
    <section id={id} className="relative scroll-mt-24 py-24 sm:py-32">
      {/* Ambient field. Clipped by its own box so nothing can widen the page,
          and kept out of the sticky rail's ancestor chain. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={cx(
            "absolute -left-24 top-16 h-[26rem] w-[26rem] rounded-full blur-3xl",
            reduce ? "" : "animate-float"
          )}
          style={{ backgroundImage: ORB_VIOLET }}
        />
        <div
          className="absolute -right-32 bottom-8 h-[22rem] w-[22rem] rounded-full blur-3xl"
          style={{ backgroundImage: ORB_CYAN }}
        />
      </div>

      <div className="shell relative">
        {/* Thin gradient rule opening the section. */}
        <Reveal y={0} duration={1.1}>
          <div
            aria-hidden
            className="pointer-events-none h-px w-full bg-gradient-to-r from-violet/50 via-ink-600 to-transparent"
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-y-14 sm:mt-16 lg:grid-cols-12 lg:gap-x-16">
          {/* ---------------------------------------------------------- */}
          {/* Portrait rail                                              */}
          {/* ---------------------------------------------------------- */}
          <div className="min-w-0 lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <Reveal y={24} duration={0.9}>
              <div className="mx-auto w-44 sm:w-52 lg:mx-0 lg:w-full lg:max-w-[17rem]">
                <div className="relative">
                  {/* Dot-grid panel behind the portrait. Painted first, so the
                      avatar sits on top without needing a z-index. */}
                  <div
                    aria-hidden
                    className="dot-grid mask-radial pointer-events-none absolute -inset-10 opacity-50"
                  />
                  <Avatar
                    src={bio.avatar}
                    initials={bio.initials}
                    alt={`${bio.name} — ${bio.role}`}
                    className="w-full"
                  />
                </div>
              </div>
            </Reveal>

            <div className="mt-8 text-center lg:text-left">
              <Reveal y={18} delay={0.08}>
                <p className="text-balance text-title font-semibold text-chalk">{bio.name}</p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-chalk-dim">
                  {bio.role}
                </p>
                <p className="brand-text mt-0.5 text-[0.9375rem] font-medium leading-relaxed">
                  {bio.org}
                </p>
                <p className="mt-4 text-pretty text-[0.8125rem] leading-relaxed text-chalk-dim">
                  {bio.strapline}
                </p>
              </Reveal>

              {/* Compact 3-up fact row, hairline-separated. */}
              <Reveal y={16} delay={0.14}>
                <dl className="hairline mt-7 grid grid-cols-3 divide-x divide-ink-700 pt-6">
                  {bio.facts.map((fact) => (
                    // dt before dd is what <dl> requires; flex-col-reverse puts
                    // the value on top without inverting the reading order.
                    <div
                      key={fact.label}
                      className="flex min-w-0 flex-col-reverse px-1.5 first:pl-0 last:pr-0"
                    >
                      <dt className="eyebrow mt-1.5 break-words leading-relaxed">{fact.label}</dt>
                      <dd className="text-xl font-semibold tracking-tight text-chalk sm:text-2xl">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>

              <Reveal y={16} delay={0.2}>
                <SocialRow />
              </Reveal>
            </div>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* Content column                                             */}
          {/* ---------------------------------------------------------- */}
          <div className="min-w-0 lg:col-span-8">
            <Reveal y={14} duration={0.7}>
              <div className="flex items-center gap-4 sm:gap-6">
                <span className="eyebrow">01 / About</span>
                <span
                  aria-hidden
                  className="h-px min-w-0 flex-1 bg-gradient-to-r from-ink-600 to-transparent"
                />
              </div>
            </Reveal>

            <Reveal as="h2" className="mt-6 text-balance text-headline text-chalk" delay={0.08}>
              Who I am
            </Reveal>

            <Stagger className="mt-8 space-y-6">
              {bio.about.map((paragraph, i) => (
                <StaggerItem key={paragraph.slice(0, 32)}>
                  <p
                    className={
                      i === 0
                        ? "max-w-prose text-pretty text-lede text-chalk"
                        : "max-w-prose text-pretty text-lede text-chalk-dim"
                    }
                  >
                    {paragraph}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>

            {/* Interests -------------------------------------------------- */}
            <div className="mt-14">
              <Reveal as="h3" className="eyebrow text-chalk-dim" y={12} duration={0.7}>
                Interests
              </Reveal>
              <StaggerList className="mt-5 grid grid-cols-1 gap-x-10 gap-y-3.5 sm:grid-cols-2">
                {bio.interests.map((interest) => (
                  <StaggerListItem
                    key={interest}
                    className="group flex items-start gap-3 text-[0.9375rem] leading-relaxed text-chalk-dim transition-colors duration-300 hover:text-chalk"
                  >
                    <span
                      aria-hidden
                      className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-grad shadow-[0_0_0_3px_rgba(139,92,246,0.12)] transition-shadow duration-300 group-hover:shadow-[0_0_0_4px_rgba(139,92,246,0.20)]"
                    />
                    <span className="min-w-0 text-pretty">{interest}</span>
                  </StaggerListItem>
                ))}
              </StaggerList>
            </div>

            {/* Education -------------------------------------------------- */}
            <div className="mt-14">
              <Reveal as="h3" className="eyebrow text-chalk-dim" y={12} duration={0.7}>
                Education
              </Reveal>
              <StaggerList className="mt-5 space-y-4">
                {bio.education.map((entry) => (
                  <StaggerListItem
                    key={`${entry.degree}-${entry.institution}`}
                    className="grad-border relative overflow-hidden rounded-2xl p-6 sm:p-7"
                  >
                    {/* Timeline rail down the card's leading edge. */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-6 left-0 w-px bg-gradient-to-b from-violet via-cyan/60 to-transparent"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-2xl"
                      style={{ backgroundImage: ORB_VIOLET }}
                    />

                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                      <span
                        aria-hidden
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet/25 bg-violet/10 text-violet-soft"
                      >
                        <CapGlyph />
                      </span>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                          <h4 className="text-balance text-lg font-semibold tracking-tight text-chalk">
                            {entry.degree}
                          </h4>
                          <span className="chip shrink-0">{entry.period}</span>
                        </div>
                        <p className="mt-2 text-[0.9375rem] leading-relaxed text-chalk-dim">
                          {entry.institution}
                        </p>
                        <p className="mt-3 max-w-prose text-pretty text-[0.875rem] leading-relaxed text-chalk-faint">
                          {entry.note}
                        </p>
                      </div>
                    </div>
                  </StaggerListItem>
                ))}
              </StaggerList>
            </div>

            {/* Languages -------------------------------------------------- */}
            <div className="mt-14">
              <Reveal as="h3" className="eyebrow text-chalk-dim" y={12} duration={0.7}>
                Languages &amp; HDLs
              </Reveal>
              <StaggerList className="mt-5 flex flex-wrap gap-2">
                {bio.languages.map((language) => (
                  <StaggerListItem key={language} className="chip">
                    {language}
                  </StaggerListItem>
                ))}
              </StaggerList>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Biography;
