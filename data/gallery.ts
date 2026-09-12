import type { Accent } from "@/types/project";

export interface GalleryItem {
  /** Matches a project slug in data/projects.ts when `internal` is true. */
  slug: string;
  title: string;
  /** One short line — this is the hook. */
  blurb: string;
  tag: string;
  accent: Accent;
  /** Where the tile goes. Internal anchors scroll to the detail section. */
  href: string;
  internal: boolean;
  /**
   * Image path. For projects that already have a detail section this reuses the
   * SAME file as that section's lead image, so you only supply it once.
   */
  image: string;
  /** Shown as a small corner badge. */
  badge?: string;
}

/**
 * Every public repo, in the order they should appear. This is the "browse
 * everything" grid — one image, one title, one line. Delete any tile you'd
 * rather not show; nothing else depends on this list.
 */
export const gallery: GalleryItem[] = [
  {
    slug: "packet-fifo-uvm",
    title: "AXI4-Stream Packet FIFO",
    blurb: "Store-and-forward RTL + UVM with exact drop prediction",
    tag: "Verification",
    accent: "signal",
    href: "/projects/packet-fifo-uvm/",
    internal: true,
    image: "/projects/packet-fifo-uvm/architecture.png",
  },
  {
    slug: "rtos-environmental-monitoring-node",
    title: "RTOS Monitoring Node",
    blurb: "Five-task FreeRTOS firmware streaming telemetry over MQTT",
    tag: "Embedded",
    accent: "wave",
    href: "/projects/rtos-environmental-monitoring-node/",
    internal: true,
    image: "/projects/rtos-environmental-monitoring-node/bench.jpg",
  },
  {
    slug: "autocar-slam",
    title: "AutoCar SLAM",
    blurb: "A robot car that maps the room while it drives",
    tag: "Robotics",
    accent: "signal",
    href: "/projects/autocar-slam/",
    internal: true,
    image: "/projects/autocar-slam/car.jpg",
  },
  {
    slug: "de10-nano-opencl-fpga-acceleration",
    title: "DE10-Nano OpenCL",
    blurb: "ARM-to-FPGA acceleration, from BSP to running kernels",
    tag: "FPGA",
    accent: "amber",
    href: "/projects/de10-nano-opencl-fpga-acceleration/",
    internal: true,
    image: "/projects/de10-nano-opencl-fpga-acceleration/board.jpg",
  },
  {
    slug: "apb-uart-uvm-verification",
    title: "APB UART Verification",
    blurb: "Two cores facing each other, 100% functional coverage",
    tag: "Verification",
    accent: "signal",
    href: "/projects/apb-uart-uvm-verification/",
    internal: true,
    image: "/projects/apb-uart-uvm-verification/tb-architecture.png",
  },
  {
    slug: "save-your-grandpa",
    title: "SAVE YOUR GRANDPA",
    blurb: "Wearable fall detection with a four-state confirmation machine",
    tag: "IoT",
    accent: "amber",
    href: "/projects/save-your-grandpa/",
    internal: true,
    image: "/projects/save-your-grandpa/wearable.jpg",
  },
  {
    slug: "tof-ultrasonic-pico2350",
    title: "ToF + Ultrasonic",
    blurb: "Arduino-free VL53L1X driver port on the bare Pico SDK",
    tag: "Drivers",
    accent: "wave",
    href: "/projects/tof-ultrasonic-pico2350/",
    internal: true,
    image: "/projects/tof-ultrasonic-pico2350/setup.jpg",
  },
  {
    slug: "watchmark",
    title: "WatchMark",
    blurb: "Chrome extension that watches one element and alerts on change",
    tag: "Web",
    accent: "signal",
    href: "/projects/watchmark/",
    internal: true,
    image: "/projects/watchmark/popup.png",
  },
  {
    slug: "regression-sim",
    title: "Regression Sim",
    blurb: "Python harness for driving repeated simulation runs",
    tag: "Tools",
    accent: "amber",
    href: "/projects/regression-sim/",
    internal: true,
    image: "/projects/regression-sim/output.png",
  },
  {
    slug: "circuit-1-ltspice",
    title: "LTspice Circuit Studies",
    blurb: "Analog simulation — bias points, transient, frequency sweeps",
    tag: "Analog",
    accent: "wave",
    href: "/projects/circuit-1-ltspice/",
    internal: true,
    image: "/projects/circuit-1-ltspice/schematic.png",
  },
  {
    slug: "the-beauty-and-math",
    title: "The Beauty and Math",
    blurb: "A parametric heart built from particles of whatever you type",
    tag: "WebGL",
    accent: "amber",
    href: "/projects/the-beauty-and-math/",
    internal: true,
    image: "/projects/the-beauty-and-math/heart.png",
    badge: "Live demo",
  },
  {
    slug: "sv-tutorial",
    title: "SystemVerilog Tutorial",
    blurb: "Working through Greg Stitt's UF SystemVerilog course material",
    tag: "Learning",
    accent: "signal",
    href: "https://github.com/PETERFEE/sv-tutorial_Stits",
    internal: false,
    image: "/gallery/sv-tutorial.png",
    badge: "Fork",
  },
  {
    slug: "devotee",
    title: "Devotee",
    blurb: "Unity game — run an island as a god, from two linked perspectives",
    tag: "Games",
    accent: "amber",
    href: "https://github.com/PETERFEE/Devotee",
    internal: false,
    image: "/gallery/devotee.png",
    badge: "Team",
  },
];
