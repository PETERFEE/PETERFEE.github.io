"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { useRef, useSyncExternalStore, type ReactNode } from "react";

/** Apple's standard ease-out curve. Everything on this site uses it. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* Reduced motion — hydration-safe.                                     */
/*                                                                      */
/* framer-motion's own useReducedMotion() reads `null` on the server    */
/* and the device's real preference on the client, so any component     */
/* that branches its RENDERED OUTPUT on it emits one tree during        */
/* prerender and a different one during hydration. For a visitor with   */
/* prefers-reduced-motion set that threw React #418/#423/#425 and made  */
/* React discard the entire prerendered page and re-render it on the    */
/* client. useSyncExternalStore pins the hydration pass to the server   */
/* value and re-renders with the real one immediately after mount,      */
/* which is the sanctioned React 18 pattern; as a bonus it also tracks  */
/* the setting live, which framer-motion's hook never did.              */
/* ------------------------------------------------------------------ */

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const query = window.matchMedia(REDUCE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function readReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(REDUCE_QUERY).matches;
}

/** Always `false` on the server and through hydration, so both trees match. */
function readReducedMotionOnServer(): boolean {
  return false;
}

/**
 * Drop-in replacement for framer-motion's `useReducedMotion` that is safe to
 * branch rendered markup on. Import this one, never framer-motion's.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, readReducedMotion, readReducedMotionOnServer);
}

/* ------------------------------------------------------------------ */
/* Reveal — the workhorse. Fade + rise + de-blur as the block enters.   */
/* ------------------------------------------------------------------ */

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds to wait after the element enters view. */
  delay?: number;
  /** Pixels to travel upward. */
  y?: number;
  duration?: number;
  as?: "div" | "section" | "li" | "span" | "p" | "h2" | "h3";
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  duration = 0.85,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;

  if (reduce) {
    const Plain = as as "div";
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Stagger — parent/child pair for lists that cascade in.               */
/* ------------------------------------------------------------------ */

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
};

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={staggerChild}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Parallax — element drifts against scroll while it's on screen.       */
/* ------------------------------------------------------------------ */

export function Parallax({
  children,
  className,
  distance = 60,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const smooth = useSpring(y, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y: smooth }}>{children}</motion.div>
    </div>
  );
}

/** Hook form, for when you need the value rather than a wrapper. */
export function useParallaxValue(
  ref: React.RefObject<HTMLElement>,
  from: number,
  to: number
): MotionValue<number> {
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return useTransform(scrollYProgress, [0, 1], [from, to]);
}

/* ------------------------------------------------------------------ */
/* WordReveal — headline words rise in sequence. Used in the hero.      */
/* ------------------------------------------------------------------ */

export function WordReveal({
  text,
  className,
  delay = 0,
  stagger = 0.06,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) return <span className={className}>{text}</span>;

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 0.95, delay: delay + i * stagger, ease: EASE }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* ScrollProgress — hairline reading indicator pinned to the top.       */
/* ------------------------------------------------------------------ */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 34, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-gradient-to-r from-signal via-signal-soft to-transparent"
    />
  );
}
