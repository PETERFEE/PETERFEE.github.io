export type Accent = "signal" | "wave" | "amber";

export type MediaKind = "screenshot" | "photo" | "diagram" | "waveform" | "chart";

export interface ProjectMediaSlot {
  /** File you drop into public/projects/<slug>/ — no code change needed. */
  file: string;
  kind: MediaKind;
  /** Shown inside the empty frame so you know what to shoot/export. */
  hint: string;
  alt: string;
  caption?: string;
  /** CSS aspect-ratio, e.g. "16 / 10". */
  aspect?: string;
  /** Render as the large lead image for the project. */
  lead?: boolean;
}

export interface ProjectFeature {
  title: string;
  detail: string;
}

export interface ProjectMetric {
  value: string;
  label: string;
}

export interface Project {
  slug: string;
  title: string;
  /** One-line positioning under the title. */
  tagline: string;
  category: string;
  year: string;
  /** Marks repos forked/extended from someone else's base. */
  origin?: string;
  repo: string;
  demo?: string;
  /**
   * Path under /public to a self-contained HTML demo. When set, the project's
   * dedicated page embeds it live in an iframe.
   */
  demoEmbed?: string;
  summary: string;
  features: ProjectFeature[];
  metrics?: ProjectMetric[];
  stack: string[];
  media: ProjectMediaSlot[];
  accent: Accent;
  /** Featured projects get full sticky showcase sections. */
  featured: boolean;
}
