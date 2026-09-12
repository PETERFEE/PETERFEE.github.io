"use client";

import { motion } from "framer-motion";

import { EASE, Reveal, useReducedMotion } from "@/components/motion";

type Align = "left" | "center";

export interface SectionHeaderProps {
  /** Short label above the title, e.g. "01 / Verification". */
  eyebrow: string;
  title: string;
  description?: string;
  /** Anchor target so the nav can jump straight to this section. */
  id?: string;
  align?: Align;
  className?: string;
}

/**
 * Static lookup, never a template literal — Tailwind's JIT only sees class
 * names that appear verbatim in the source.
 */
const ALIGN: Record<Align, { root: string; row: string; prose: string }> = {
  left: { root: "text-left", row: "justify-start", prose: "" },
  center: { root: "text-center", row: "justify-center", prose: "mx-auto" },
};

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Complete literal class strings on both sides — the JIT cannot see a
 *  template literal, and these are the only two variants that exist. */
const RULE_GRADIENT: Record<"left" | "right", string> = {
  right: "bg-gradient-to-r from-violet/80 via-cyan/45 to-transparent",
  left: "bg-gradient-to-l from-violet/80 via-cyan/45 to-transparent",
};

const RULE_ORIGIN: Record<"left" | "right", string> = {
  right: "origin-left",
  left: "origin-right",
};

/**
 * The hairline beside the eyebrow. It draws itself outward from the label
 * (scaleX 0 -> 1) as the header enters view, then holds — and it draws in the
 * brand gradient, so the section label is where violet→cyan is introduced on
 * every screen of the page.
 *
 * The gradient is dense at the label end and dissolves as it runs out, which
 * keeps the colour attached to the type instead of striping the layout.
 */
function DrawRule({ direction, delay }: { direction: "left" | "right"; delay: number }) {
  const reduce = useReducedMotion();
  const grad = RULE_GRADIENT[direction];

  if (reduce) {
    return <div aria-hidden className={cx("h-px min-w-0 flex-1", grad)} />;
  }

  return (
    <motion.div
      aria-hidden
      className={cx("relative h-px min-w-0 flex-1", RULE_ORIGIN[direction], grad)}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      {/* A soft bloom riding along with the rule — a duplicate of the same
          gradient, blurred. One per section header, on a 1px box: cheap, and
          it stops the hairline reading as a plain border. */}
      <div className={cx("absolute inset-0 opacity-60 blur-[3px]", grad)} />
    </motion.div>
  );
}

/**
 * Opens a major section: eyebrow + self-drawing rule, an <h2>, and an
 * optional lede. The three parts reveal in sequence.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  id,
  align = "left",
  className,
}: SectionHeaderProps) {
  const a = ALIGN[align];

  return (
    <div id={id} className={cx("scroll-mt-28", a.root, className)}>
      <Reveal className={cx("flex items-center gap-4 sm:gap-6", a.row)} y={14} duration={0.7}>
        {align === "center" ? <DrawRule direction="left" delay={0.12} /> : null}
        <span className="eyebrow inline-flex items-center gap-2.5 whitespace-nowrap">
          {/* 5px of brand, as the section's own bullet. */}
          <span aria-hidden className="block h-[5px] w-[5px] shrink-0 rounded-full bg-brand-grad" />
          {eyebrow}
        </span>
        <DrawRule direction="right" delay={0.12} />
      </Reveal>

      <Reveal as="h2" className="mt-6 text-balance text-headline text-chalk" delay={0.08}>
        {title}
      </Reveal>

      {description ? (
        <Reveal
          as="p"
          className={cx("mt-6 max-w-prose text-pretty text-lede text-chalk-dim", a.prose)}
          delay={0.16}
        >
          {description}
        </Reveal>
      ) : null}
    </div>
  );
}
