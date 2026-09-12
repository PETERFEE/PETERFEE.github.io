import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Zinc-tinted dark ramp. Cool neutrals read as "technical" where
        // pure greys read as flat, so every step carries a little blue.
        ink: {
          950: "#09090b", // page base
          900: "#0d0d10", // section base
          850: "#131317", // raised
          800: "#18181b", // card
          700: "#27272a", // border-strong
          600: "#3f3f46", // border
        },
        chalk: {
          DEFAULT: "#fafafa", // primary text — never pure white
          dim: "#a1a1aa",     // secondary text
          faint: "#71717a",   // tertiary / labels
        },
        signal: {
          DEFAULT: "#2997ff",
          soft: "#7bc0ff",
          deep: "#0a5fb8",
        },
        // Brand gradient endpoints. Violet leads, cyan resolves.
        violet: {
          DEFAULT: "#8b5cf6",
          soft: "#a78bfa",
          deep: "#6d28d9",
        },
        cyan: {
          DEFAULT: "#06b6d4",
          soft: "#22d3ee",
          deep: "#0e7490",
        },
        wave: "#4ade80",   // scope-trace green, used sparingly
        amber: "#f5a524",  // verification / warning accent
      },
      backgroundImage: {
        "brand-grad": "linear-gradient(110deg, #8b5cf6 0%, #6366f1 45%, #06b6d4 100%)",
        "brand-grad-soft": "linear-gradient(110deg, #a78bfa 0%, #818cf8 45%, #22d3ee 100%)",
        "sheen": "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.28) 50%, transparent 65%)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        display: ["clamp(2.75rem, 8vw, 7rem)", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
        headline: ["clamp(2rem, 5vw, 3.75rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        title: ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        lede: ["clamp(1.05rem, 1.6vw, 1.35rem)", { lineHeight: "1.55", letterSpacing: "-0.01em" }],
      },
      maxWidth: { shell: "1180px", prose: "68ch" },
      transitionTimingFunction: {
        // Apple's standard easing curves
        apple: "cubic-bezier(0.28, 0.11, 0.32, 1)",
        "apple-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "trace-dash": { to: { strokeDashoffset: "0" } },
        "pulse-soft": { "0%, 100%": { opacity: "0.35" }, "50%": { opacity: "0.9" } },
        drift: {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(2%, -3%, 0) scale(1.08)" },
        },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        sheen: { from: { transform: "translateX(-120%)" }, to: { transform: "translateX(120%)" } },
        "spin-slow": { to: { transform: "rotate(360deg)" } },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 4s ease-in-out infinite",
        drift: "drift 22s ease-in-out infinite",
        marquee: "marquee 40s linear infinite",
        sheen: "sheen 1.1s ease-out",
        "spin-slow": "spin-slow 14s linear infinite",
        "gradient-pan": "gradient-pan 6s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
