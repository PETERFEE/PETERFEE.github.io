# Peter Feng — Portfolio

A projects-first portfolio. Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion,
built as a **static export** so it deploys anywhere — Vercel, Netlify, GitHub Pages, or a plain
static host.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # static site lands in ./out
```

---

## Page structure

1. **Hero** (`#top`)
2. **Biography** (`#about`) — portrait rail + about / interests / education, modelled on the Hugo Blox academic-CV profile widget
3. **Project gallery** (`#gallery`) — every repo as one tile, one image, one title; tiles link down to the write-up or out to GitHub
4. **Deep dives** (`#work`) — five full case studies with sticky columns
5. **More work** (`#more`) — the rest as cards
6. **Toolchain** (`#toolchain`)
7. **Contact** (`#contact`)

---

## Your profile picture

Drop a square photo at:

```
public/profile/avatar.jpg
```

~600×600px is plenty. Until it exists the section shows a "PF" monogram inside the
rotating gradient ring, plus a small caption telling you where the file goes — **that
caption disappears automatically the moment the photo is there.** To use a `.png`
instead, change `avatar` in `data/bio.ts`.

---

## Adding your images — no code required

Every image frame on the site is a **drop-in slot**. The page shows a labelled placeholder that
tells you exactly what to shoot and exactly where to put it. Drop the file in, refresh, done.

```
public/projects/<project-slug>/<filename>
```

The placeholder on the page prints that full path, so you never have to guess. For example, the
first frame of the packet FIFO project wants:

```
public/projects/packet-fifo-uvm/architecture.png
```

Create the folder if it does not exist. The frame picks the file up automatically — there is no
import to add and no manifest to update.

### What each project is waiting for

| Project | Folder | Files |
|---|---|---|
| AXI4-Stream Packet FIFO | `packet-fifo-uvm/` | `architecture.png`, `waveform-drop.png`, `coverage.png`, `uvm-env.png` |
| RTOS Monitoring Node | `rtos-environmental-monitoring-node/` | `bench.jpg`, `task-diagram.png`, `telemetry.png`, `jitter.png` |
| AutoCar SLAM | `autocar-slam/` | `car.jpg`, `map.png`, `ros-graph.png`, `mapping-run.gif` |
| DE10-Nano OpenCL | `de10-nano-opencl-fpga-acceleration/` | `board.jpg`, `stack-diagram.png`, `diagnostics.png`, `convolution.png` |
| APB UART Verification | `apb-uart-uvm-verification/` | `tb-architecture.png`, `coverage-report.png`, `waveform.png` |
| SAVE YOUR GRANDPA | `save-your-grandpa/` | `wearable.jpg`, `dashboard.png` |
| ToF + Ultrasonic | `tof-ultrasonic-pico2350/` | `setup.jpg`, `readings.png` |
| WatchMark | `watchmark/` | `popup.png`, `alert.png` |
| Regression Sim | `regression-sim/` | `output.png` |
| LTspice Studies | `circuit-1-ltspice/` | `schematic.png` |
| SystemVerilog Tutorial (gallery only) | `../gallery/` | `sv-tutorial.png` |
| Devotee (gallery only) | `../gallery/` | `devotee.png` |

The gallery tiles **reuse the same image file** as each project's detail section, so you
only supply it once. The last two rows are gallery-only tiles and live in
`public/gallery/` instead.

Screenshots of waveforms, coverage reports and block diagrams carry the most weight here — they
are the evidence behind the claims. Photos of hardware on the bench work well for the embedded
and robotics projects.

**Sizing:** aim for ~1600px on the long edge. Nothing needs to be larger. Each slot declares its
own aspect ratio in `data/projects.ts`, and images are cropped with `object-cover` to fit.

---

## Editing the content

Everything readable on the page lives in two files. No component needs touching.

- **`data/projects.ts`** — the projects. Order in this array **is** the order on the page.
  `featured: true` renders a full sticky showcase section; `featured: false` drops into the
  "More work" grid. Each project carries its `summary`, `features`, `metrics`, `stack`, `repo`
  link and `media` slots.
- **`data/site.ts`** — your name, hero headline and lede, disciplines, links, nav, and the
  toolchain groups.
- **`data/bio.ts`** — the biography section: about paragraphs, interests, education, facts,
  languages. **Check the education entry** — the degree and expected year are a best guess
  and you should correct them.
- **`data/gallery.ts`** — the gallery tiles. Order here is order on screen. Delete any tile
  you'd rather not show; nothing else depends on this list.

Two entries are deliberately stubbed and say so on the page — **Regression Sim** and
**LTspice Circuit Studies**. Neither repo has a README, so the copy is a placeholder. Replace the
`summary` and `features` in `data/projects.ts` when you have a minute.

---

## Deploying to GitHub Pages

A workflow is already committed at `.github/workflows/deploy.yml`. Every push to
`main` builds the site and publishes it. You only need to do the setup once.

### Option A — user site at `https://peterfee.github.io/` (recommended)

Name the repo **exactly** `PETERFEE.github.io`. No config changes needed.

```bash
cd C:\Users\fengh\Desktop\Profolio
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/PETERFEE/PETERFEE.github.io.git
git push -u origin main
```

### Option B — project site at `https://peterfee.github.io/portfolio/`

Name the repo anything (e.g. `portfolio`), then **uncomment the two `env` lines**
in `.github/workflows/deploy.yml` and set the value to `/<your-repo-name>`.
Without this every stylesheet and script 404s, because Pages serves the site from
a subpath that Next.js doesn't know about.

```bash
git remote add origin https://github.com/PETERFEE/portfolio.git
```

### Then, once, in the browser

Repo → **Settings** → **Pages** → **Source: GitHub Actions**.

That last step is not optional and is the most common reason a first deploy shows
a 404 — Pages defaults to branch serving, which ignores the workflow entirely.
Watch the run under the **Actions** tab; the live URL appears on the deploy job
when it finishes (usually 1–2 minutes).

### Why the two extra files

- **`public/.nojekyll`** — Pages runs Jekyll on branch-served sites, and Jekyll
  silently deletes any directory starting with an underscore. Next.js puts every
  script and stylesheet in `_next/`, so without this the site loads as unstyled
  HTML. The Actions deploy above skips Jekyll anyway, but this keeps branch
  serving working as a fallback.
- **`basePath` / `assetPrefix` in `next.config.mjs`** — read from
  `NEXT_PUBLIC_BASE_PATH`, empty by default. This is what Option B sets.

### Other hosts

**Vercel** — import the repo and accept the defaults; it detects Next.js and
ignores the export config. **Netlify** — build command `npm run build`, publish
directory `out`.

---

## Structure

```
app/
  layout.tsx          fonts, metadata, ambient background mount
  page.tsx            section order
  globals.css         design tokens and utility classes
components/
  hero.tsx            headline, scroll-linked recede
  site-nav.tsx        transparent → frosted on scroll
  ambient-field.tsx   drifting glows, blueprint grid (pure CSS, zero JS)
  project-showcase.tsx  sticky-column featured sections
  project-card.tsx    grid card for the rest
  project-media.tsx   the drop-in image frame + placeholder
  toolchain-strip.tsx marquee + grouped tools
  site-footer.tsx     contact
  section-header.tsx  reusable section opener
  motion/index.tsx    Reveal, Stagger, Parallax, WordReveal, ScrollProgress
data/
  projects.ts         ← project content
  site.ts             ← identity and toolchain
types/project.ts      shape of a project
```

### A note on fonts

Fonts load via a `<link>` to Google Fonts rather than `next/font/google`, because `next/font`
fetches at **build** time and fails on any machine or CI runner without outbound access to
Google. If you would rather have self-hosted fonts and zero layout shift, `app/layout.tsx`
carries a comment with the three-line swap.

### Design system

Zinc-tinted dark ramp (`#09090b` → `#3f3f46`) with a violet→cyan brand gradient
(`#8b5cf6` → `#06b6d4`) used as punctuation — roughly one gradient moment per viewport.
Buttons come in three tiers as component classes in `globals.css`: `.btn-brand`
(gradient fill with a sheen sweep on hover), `.btn-glass` (frosted with a gradient
hairline border), `.btn-quiet`. Decorative primitives live in `components/decor.tsx`
(`Orb`, `GridPanel`, `GradientRule`, `NoiseLayer`) and are server components — no JS.

### Motion

All animation runs through `components/motion/index.tsx` on a single easing curve
(`cubic-bezier(0.16, 1, 0.3, 1)`), and every primitive checks `prefers-reduced-motion` — the
site degrades to a clean static page for anyone who has asked their OS for that.
