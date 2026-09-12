import type { Project } from "@/types/project";

/**
 * Ordering is intentional and drives the page: featured projects render as
 * full sticky showcase sections, the rest fall into the "More work" grid.
 * To add an image, drop the named file into public/projects/<slug>/ —
 * the frame picks it up automatically, no code change required.
 */
export const projects: Project[] = [
  {
    slug: "packet-fifo-uvm",
    title: "AXI4-Stream Packet FIFO",
    tagline: "Store-and-forward RTL with a UVM environment that predicts every drop exactly",
    category: "Design & Verification",
    year: "2026",
    repo: "https://github.com/PETERFEE/packet_fifo_UVM",
    accent: "signal",
    featured: true,
    summary:
      "A store-and-forward packet FIFO that sits upstream of a network MAC and buffers whole frames so the MAC never underruns when the source stalls mid-packet. The design is built around a three-pointer commit/rewind scheme, and the UVM environment verifies it against a timing-independent contract rather than a cycle-by-cycle occupancy mirror.",
    features: [
      {
        title: "Three-pointer commit and rewind",
        detail:
          "wr_ptr advances speculatively on every accepted beat, wr_ptr_commit marks the end of the last whole packet and doubles as the rewind target, and rd_ptr only ever sees committed packets. A dropped frame costs one pointer assignment.",
      },
      {
        title: "Drop-on-overflow without deadlock",
        detail:
          "A packet is dropped only when the entire buffer holds a single in-progress packet, so anything that fits is never dropped. Once dropping starts the FIFO holds tready high and sinks the rest of the doomed frame to tlast, so the AXI4-Stream master never locks up.",
      },
      {
        title: "Exact scoreboarding from a design contract",
        detail:
          "Because the drop rule collapses to length > DEPTH always drops and length <= DEPTH never drops, the scoreboard predicts drops deterministically instead of racing the DUT's internal occupancy. That removes the false-failure problem that plagues cycle-accurate monitors.",
      },
      {
        title: "Configurable slave-side backpressure VIP",
        detail:
          "A new axi4_stream_slave_driver generates tready under four policies — always ready, random, stall, and blocked — layered onto Greg Stitt's parameterized AXI4-Stream agent, which is reused unchanged.",
      },
      {
        title: "Mutation-tested checkers",
        detail:
          "Five bugs were deliberately injected — overeager drop, commit pointer off-by-one, missing rewind, stall-during-drop, and plain FIFO instead of store-and-forward. All five were caught by the assertions and scoreboard, proving the checkers actually check.",
      },
    ],
    metrics: [
      { value: "6", label: "UVM tests in the regression" },
      { value: "5 / 5", label: "Injected bugs caught" },
      { value: "445", label: "Packets in RTL pre-validation" },
      { value: "0", label: "Scoreboard discrepancies" },
    ],
    stack: ["SystemVerilog", "UVM 1.2", "AXI4-Stream", "Questa", "Verilator", "SVA", "Functional coverage"],
    media: [
      {
        file: "architecture.png",
        kind: "diagram",
        hint: "Block diagram: AXI4-Stream master → FIFO (wr_ptr / wr_ptr_commit / rd_ptr) → MAC",
        alt: "Block diagram of the store-and-forward packet FIFO datapath and its three pointers",
        caption: "Datapath and the commit/rewind pointer scheme.",
        aspect: "16 / 9",
        lead: true,
      },
      {
        file: "waveform-drop.png",
        kind: "waveform",
        hint: "Questa wave window showing an oversize packet being sunk and the write pointer rewinding",
        alt: "Simulation waveform of a dropped oversize packet and the pointer rewind",
        caption: "Rewind on overflow: tready stays high while the doomed frame is sunk to tlast.",
        aspect: "16 / 9",
      },
      {
        file: "coverage.png",
        kind: "chart",
        hint: "Questa coverage report — packet length bins, backpressure policy crosses",
        alt: "Functional coverage report for the packet FIFO regression",
        caption: "Coverage closure across length bins and backpressure policies.",
        aspect: "4 / 3",
      },
      {
        file: "uvm-env.png",
        kind: "diagram",
        hint: "UVM hierarchy: master agent, slave agent, scoreboard, coverage, assertions",
        alt: "UVM testbench hierarchy diagram",
        caption: "Testbench topology — reused agent, new slave driver, packet-level scoreboard.",
        aspect: "4 / 3",
      },
    ],
  },
  {
    slug: "rtos-environmental-monitoring-node",
    title: "RTOS Environmental Monitoring Node",
    tagline: "Five-task FreeRTOS firmware on STM32F103 streaming telemetry to an MQTT gateway",
    category: "Embedded / RTOS",
    year: "2026",
    repo: "https://github.com/PETERFEE/RTOS-Environmental-Monitoring-Node",
    accent: "wave",
    featured: true,
    summary:
      "FreeRTOS firmware for an STM32 NUCLEO-F103RB that samples a BME680 over I²C, filters and scores the readings, and streams formatted telemetry over UART to an ESP32 that republishes it as MQTT. Built around explicit priority assignment, priority-inheritance locking, and a command interface that reconfigures the sampling period at runtime.",
    features: [
      {
        title: "Five tasks with deliberate priorities",
        detail:
          "Sensor at priority 3, processing and comm at 2, logging and health at 1. The health task uses absolute wake times rather than relative delays so its 5-second cadence holds even when execution time varies.",
      },
      {
        title: "Zero-interrupt UART reception",
        detail:
          "Circular DMA with IDLE-line framing means a burst of incoming bytes costs no interrupts at all — the line goes idle, one event fires, and the whole message is already in memory.",
      },
      {
        title: "Priority inheritance on the I²C bus",
        detail:
          "The BME680 bus is guarded by a priority-inheritance mutex, and the button ISR uses direct task notifications instead of a semaphore, keeping the interrupt path short and the sensor task unblocked.",
      },
      {
        title: "Runtime command interface",
        detail:
          "STATUS, SAMPLE_NOW, SET_PERIOD, GET_PERIOD and PING are accepted on either UART link, with responses returned on the originating link. The sampling period retunes from 100 ms to 60 s without stopping the application.",
      },
      {
        title: "Hardware-free unit testing",
        detail:
          "processing.c, telemetry.c and cmd_parser.c contain no HAL or kernel calls, so they compile for the host and run 93+ tests under pytest via ctypes. Hardware tests then check round-trip latency and telemetry jitter separately.",
      },
    ],
    metrics: [
      { value: "5", label: "FreeRTOS tasks" },
      { value: "36.3 KB", label: "Flash — 27.7% of 128 KB" },
      { value: "13.0 KB", label: "SRAM — 65% of 20 KB" },
      { value: "93+", label: "Host-side unit tests" },
    ],
    stack: ["C", "FreeRTOS 11.1", "STM32F103RB", "BME680", "I²C", "DMA + IDLE", "CMake", "ESP32", "MQTT", "pytest"],
    media: [
      {
        file: "bench.jpg",
        kind: "photo",
        hint: "Photo of the NUCLEO board, BME680 breakout and ESP32 wired on the bench",
        alt: "The NUCLEO-F103RB, BME680 sensor and ESP32 gateway wired together",
        caption: "The node on the bench — NUCLEO-F103RB, BME680, ESP32 gateway.",
        aspect: "16 / 10",
        lead: true,
      },
      {
        file: "task-diagram.png",
        kind: "diagram",
        hint: "Task/queue diagram: sensor → processing → comm, with logging and health alongside",
        alt: "FreeRTOS task and queue architecture diagram",
        caption: "Task graph, queues, and the notification paths between them.",
        aspect: "16 / 9",
      },
      {
        file: "telemetry.png",
        kind: "screenshot",
        hint: "Serial console showing the T=,H=,P=,G=,A=,S= telemetry stream",
        alt: "Serial console output showing the telemetry line format",
        caption: "Telemetry stream and the health task's heap/stack report.",
        aspect: "4 / 3",
      },
      {
        file: "jitter.png",
        kind: "chart",
        hint: "Plot of telemetry scheduling jitter from the Python test harness",
        alt: "Chart of telemetry scheduling jitter measurements",
        caption: "Measured scheduling jitter across sampling periods.",
        aspect: "4 / 3",
      },
    ],
  },
  {
    slug: "autocar-slam",
    title: "AutoCar SLAM",
    tagline: "A self-mapping robot car — ROS 2, RPLIDAR, and live floor plans over Wi-Fi",
    category: "Robotics / ROS 2",
    year: "2026",
    repo: "https://github.com/PETERFEE/autocar-slam",
    accent: "signal",
    featured: true,
    summary:
      "A robot car that drives itself around a room and builds a floor plan while it goes. An ESP32 handles motors and encoder counting, a Raspberry Pi 5 runs the LiDAR, odometry and SLAM stack under ROS 2 Jazzy, and a laptop watches the map build in real time through Foxglove Studio over Wi-Fi.",
    features: [
      {
        title: "Split-brain architecture",
        detail:
          "The ESP32 does only what needs hard real-time — PWM and encoder ticks — and bridges into ROS 2 through micro-ROS. Everything with a compute budget lives on the Pi 5, so the motor loop never competes with scan matching.",
      },
      {
        title: "Encoder odometry from first principles",
        detail:
          "Wheel position is integrated from 20-slot encoder ticks calibrated at 10.2 mm per tick, then fused with RPLIDAR A1 scans at 10 Hz to close loops and correct drift.",
      },
      {
        title: "Live remote visualization",
        detail:
          "Map, scan point cloud and odometry stream to Foxglove Studio on a client machine over Wi-Fi, so you watch the floor plan assemble as the car drives rather than after the fact.",
      },
      {
        title: "Teleop and autonomous modes",
        detail:
          "WASD keyboard teleop with tunable speed for careful mapping runs, plus an autonomous obstacle-avoidance mode. Finished maps persist as PGM images with YAML metadata.",
      },
      {
        title: "Honest hardware limits, documented",
        detail:
          "Motor deadband near 20% duty, single-channel encoders that infer direction rather than measure it, and a battery that sags when motors and LiDAR draw together — all characterized in HARDWARE.md rather than hidden.",
      },
    ],
    metrics: [
      { value: "12 m", label: "RPLIDAR A1 range" },
      { value: "10 Hz", label: "Scan rate" },
      { value: "10.2 mm", label: "Per encoder tick" },
      { value: "11.1 V", label: "3S Li-ion pack" },
    ],
    stack: ["ROS 2 Jazzy", "Python 3", "micro-ROS", "RPLIDAR A1", "Raspberry Pi 5", "ESP32", "L298N", "Foxglove", "Ubuntu 24.04"],
    media: [
      {
        file: "car.jpg",
        kind: "photo",
        hint: "Photo of the assembled car — LiDAR on top, Pi and ESP32 visible",
        alt: "The assembled AutoCar with RPLIDAR mounted on top",
        caption: "The car, fully assembled — RPLIDAR A1 up top, Pi 5 and ESP32 below.",
        aspect: "16 / 10",
        lead: true,
      },
      {
        file: "map.png",
        kind: "screenshot",
        hint: "Foxglove screenshot of a completed room map with scan points overlaid",
        alt: "A completed SLAM floor plan rendered in Foxglove Studio",
        caption: "A finished room map after loop closure.",
        aspect: "16 / 9",
      },
      {
        file: "ros-graph.png",
        kind: "diagram",
        hint: "ROS 2 node graph: micro-ROS, ticks_odom_node, lidar, slam, teleop",
        alt: "ROS 2 node and topic graph for the AutoCar stack",
        caption: "Node graph across the ESP32, Pi 5 and client.",
        aspect: "4 / 3",
      },
      {
        file: "mapping-run.gif",
        kind: "screenshot",
        hint: "Short GIF or still of the map filling in during a driving run",
        alt: "The occupancy map filling in during a mapping run",
        caption: "Map assembling live during a slow mapping pass.",
        aspect: "4 / 3",
      },
    ],
  },
  {
    slug: "de10-nano-opencl-fpga-acceleration",
    title: "DE10-Nano OpenCL Acceleration",
    tagline: "Standing up an ARM-to-FPGA OpenCL platform from BSP to running kernels",
    category: "FPGA / Acceleration",
    year: "2026",
    repo: "https://github.com/PETERFEE/de10-nano-opencl-fpga-acceleration",
    accent: "amber",
    featured: true,
    summary:
      "An end-to-end OpenCL acceleration platform on the Terasic DE10-Nano, where a host application on the ARM Cortex-A9 dispatches compute kernels into the Cyclone V fabric. The work spans the whole stack — Quartus hardware, the MMD layer and device driver, the board support package, and the host code — kept in clean separation.",
    features: [
      {
        title: "Full-stack board bring-up",
        detail:
          "Quartus hardware and Qsys system integration, the MMD implementation and ARM device driver, the OpenCL board support package, and the host application — each in its own layer with an explicit boundary between them.",
      },
      {
        title: "Host-to-fabric dispatch over OpenCL",
        detail:
          "The ARM host enumerates the FPGA as an OpenCL device through the BSP and MMD library, then queues kernels onto the Cyclone V fabric like any other accelerator.",
      },
      {
        title: "Two demonstration kernels",
        detail:
          "Vector addition establishes the dispatch path end to end, then a 3×3 image convolution exercises a real signal-processing workload with memory access patterns that matter.",
      },
      {
        title: "Cross-compiled and reproducible",
        detail:
          "Host code builds with the ARM hard-float toolchain under GNU Make, and prebuilt .aocx device binaries and FPGA artifacts ship with the repo so the platform can be validated without a full toolchain install.",
      },
    ],
    metrics: [
      { value: "Cyclone V", label: "FPGA fabric" },
      { value: "Cortex-A9", label: "Hard processor system" },
      { value: "OpenCL 18.1", label: "Intel FPGA SDK" },
      { value: "2", label: "Demonstration kernels" },
    ],
    stack: ["OpenCL", "C++", "Quartus Prime 18.1", "Qsys", "Cyclone V", "ARM Cortex-A9", "arm-linux-gnueabihf", "GNU Make"],
    media: [
      {
        file: "board.jpg",
        kind: "photo",
        hint: "Photo of the DE10-Nano board, ideally powered up with the SD card and Ethernet in",
        alt: "The Terasic DE10-Nano development board",
        caption: "The DE10-Nano — Cortex-A9 HPS beside the Cyclone V fabric.",
        aspect: "16 / 10",
        lead: true,
      },
      {
        file: "stack-diagram.png",
        kind: "diagram",
        hint: "Layer diagram: host app → OpenCL runtime → MMD → driver → FPGA fabric",
        alt: "Layer diagram of the ARM-to-FPGA OpenCL software stack",
        caption: "How a kernel call travels from host code down into the fabric.",
        aspect: "16 / 9",
      },
      {
        file: "diagnostics.png",
        kind: "screenshot",
        hint: "Terminal showing aocl diagnose passing on the board",
        alt: "Board diagnostics output confirming the OpenCL device enumerates",
        caption: "Board validation — the FPGA enumerating as an OpenCL device.",
        aspect: "4 / 3",
      },
      {
        file: "convolution.png",
        kind: "chart",
        hint: "Before/after of the 3×3 convolution kernel, or a timing comparison",
        alt: "Output of the 3x3 convolution kernel running on the fabric",
        caption: "The 3×3 convolution kernel running on fabric.",
        aspect: "4 / 3",
      },
    ],
  },
  {
    slug: "apb-uart-uvm-verification",
    title: "APB UART Master Core Verification",
    tagline: "A two-agent UVM environment closing 100% functional coverage on a 16550-compatible core",
    category: "Design & Verification",
    year: "2026",
    origin: "Verification environment built on a forked RTL core",
    repo: "https://github.com/PETERFEE/verification-of-apb-based-uart-master-core",
    accent: "signal",
    featured: true,
    summary:
      "A UVM environment that verifies an APB-based UART master core by instantiating two cores and wiring them to talk to each other, so transmit and receive are checked against real traffic rather than a model. Two APB agents drive the pair, a central scoreboard validates end to end, and assertions police APB protocol compliance throughout.",
    features: [
      {
        title: "Two DUVs, one closed loop",
        detail:
          "Rather than verify a transmitter against a predicted bitstream, two UART cores face each other. Whatever one sends the other must receive, which turns serialization, framing and timing into an end-to-end check.",
      },
      {
        title: "Per-agent drivers, monitors and sequencers",
        detail:
          "Each APB agent carries its own driver, monitor and sequencer, feeding a shared scoreboard so traffic from either side is checked against the same reference.",
      },
      {
        title: "Error injection across nine scenarios",
        detail:
          "Parity errors, break conditions, buffer overrun, framing errors, transmit register states and timeouts — each with a dedicated test rather than being folded into a random soak.",
      },
      {
        title: "Assertion-backed protocol compliance",
        detail:
          "SystemVerilog assertions check APB transaction legality continuously, so a protocol violation fails at the moment it happens rather than as a downstream data mismatch.",
      },
    ],
    metrics: [
      { value: "100%", label: "Functional coverage" },
      { value: "9", label: "Test scenarios" },
      { value: "2", label: "APB agents" },
      { value: "0", label: "Assertion failures" },
    ],
    stack: ["SystemVerilog", "UVM 1.2", "APB", "UART 16550", "QuestaSim", "VCS", "SVA"],
    media: [
      {
        file: "tb-architecture.png",
        kind: "diagram",
        hint: "UVM env diagram: two APB agents → two UART DUVs → shared scoreboard",
        alt: "UVM testbench architecture with two APB agents and a shared scoreboard",
        caption: "Two agents, two cores, one scoreboard.",
        aspect: "16 / 9",
        lead: true,
      },
      {
        file: "coverage-report.png",
        kind: "chart",
        hint: "Coverage report showing 100% functional coverage",
        alt: "Functional coverage report at 100%",
        caption: "Coverage closure across all nine scenarios.",
        aspect: "16 / 9",
      },
      {
        file: "waveform.png",
        kind: "waveform",
        hint: "Waveform of an APB write followed by the serial frame on the line",
        alt: "Waveform of an APB transaction and the resulting UART frame",
        caption: "APB write to serial frame, captured end to end.",
        aspect: "4 / 3",
      },
    ],
  },
  {
    slug: "save-your-grandpa",
    title: "SAVE YOUR GRANDPA",
    tagline: "A wearable fall detector with a four-state confirmation machine",
    category: "Embedded / IoT",
    year: "2026",
    repo: "https://github.com/PETERFEE/SAVE_YOUR_GRANDPA",
    accent: "amber",
    featured: false,
    summary:
      "A chest-worn ESP32 watches motion and impact and reports over ESP-NOW to a base station that logs telemetry and serves a dashboard. The detector only confirms a fall after four conditions line up in sequence, which is what separates a real fall from sitting down hard.",
    features: [
      {
        title: "Four-state fall confirmation",
        detail:
          "NORMAL → MOTION_EVENT → IMPACT → FALL_CONFIRMED. A fall is only declared when motion exceeds threshold, an impact follows shortly after, chest orientation changes, and the body then goes still.",
      },
      {
        title: "Threshold tuning against real movement",
        detail:
          "Seven acceleration and gyroscope thresholds were tuned against standing, walking, running, bending and staged falls to push down false positives.",
      },
      {
        title: "Two dashboards, one telemetry store",
        detail:
          "A terminal dashboard for bench work and a remote dashboard server that persists to SQLite and serves a browser UI with REST endpoints for status, history and events.",
      },
    ],
    metrics: [
      { value: "4", label: "Detector states" },
      { value: "7", label: "Tuned thresholds" },
      { value: "2×", label: "ESP32 over ESP-NOW" },
    ],
    stack: ["ESP32", "ESP-NOW", "MPU6050", "HC-SR04", "Python", "SQLite", "REST"],
    media: [
      {
        file: "wearable.jpg",
        kind: "photo",
        hint: "Photo of the chest-worn sender unit",
        alt: "The chest-worn ESP32 sender unit",
        aspect: "4 / 3",
        lead: true,
      },
      {
        file: "dashboard.png",
        kind: "screenshot",
        hint: "Browser dashboard showing live telemetry and event history",
        alt: "The browser dashboard showing telemetry and fall events",
        aspect: "16 / 9",
      },
    ],
  },
  {
    slug: "tof-ultrasonic-pico2350",
    title: "ToF + Ultrasonic on Pico 2350",
    tagline: "An Arduino-free port of the VL53L1X driver to the bare Pico SDK",
    category: "Embedded / Drivers",
    year: "2026",
    repo: "https://github.com/PETERFEE/ToF_UltraSonic_pico2350",
    accent: "wave",
    featured: false,
    summary:
      "Distance sensing on the RP2350 from two different physical principles at once — a VL53L1X time-of-flight sensor and an ultrasonic rangefinder — with the Adafruit VL53L1X driver ported off Arduino and onto the raw Pico C/C++ SDK.",
    features: [
      {
        title: "Driver port off the Arduino framework",
        detail:
          "The Adafruit VL53L1X driver is rewritten against the Pico SDK's I²C primitives directly, removing the Arduino abstraction layer entirely.",
      },
      {
        title: "Two sensing principles, one target",
        detail:
          "Optical time-of-flight and acoustic ranging measured side by side, which exposes where each one fails — reflective surfaces for one, soft surfaces for the other.",
      },
      {
        title: "CMake and Pico SDK from scratch",
        detail:
          "Built on the plain Pico SDK toolchain with CMake and VSCode configuration checked in, no vendor IDE required.",
      },
    ],
    stack: ["C / C++", "Pico SDK", "RP2350", "VL53L1X", "HC-SR04", "I²C", "CMake"],
    media: [
      {
        file: "setup.jpg",
        kind: "photo",
        hint: "Photo of the Pico with both sensors wired up",
        alt: "The Pico 2350 wired to the VL53L1X and ultrasonic sensors",
        aspect: "4 / 3",
        lead: true,
      },
      {
        file: "readings.png",
        kind: "chart",
        hint: "Plot comparing ToF vs ultrasonic distance readings",
        alt: "Comparison plot of time-of-flight and ultrasonic distance readings",
        aspect: "16 / 9",
      },
    ],
  },
  {
    slug: "watchmark",
    title: "WatchMark",
    tagline: "A Chrome extension that watches one element and tells you the moment it changes",
    category: "Web / Tools",
    year: "2026",
    repo: "https://github.com/PETERFEE/WatchMark",
    accent: "signal",
    featured: false,
    summary:
      "Pick any element on any page and WatchMark tells you when its text changes — seat availability, appointment slots, stock, ticket drops. Built on MutationObserver with auto-reload for pages that only update on refresh, and selections that survive the reload.",
    features: [
      {
        title: "Click-to-select any element",
        detail:
          "Highlight and click the thing you care about; the extension stores a selector that it restores after page reloads.",
      },
      {
        title: "MutationObserver plus scheduled reload",
        detail:
          "Live DOM changes are caught instantly; pages that only change on refresh are reloaded on a 30-second to 5-minute cadence.",
      },
      {
        title: "Three alert channels",
        detail:
          "Chrome notifications, an on-page alert, and email via EmailJS, so it works whether or not the tab is in front of you.",
      },
    ],
    stack: ["JavaScript", "Chrome Extension APIs", "MutationObserver", "EmailJS", "HTML / CSS"],
    media: [
      {
        file: "popup.png",
        kind: "screenshot",
        hint: "Extension popup UI with an element selected",
        alt: "The WatchMark extension popup",
        aspect: "4 / 3",
        lead: true,
      },
      {
        file: "alert.png",
        kind: "screenshot",
        hint: "A Chrome notification firing when the watched element changed",
        alt: "A change notification from WatchMark",
        aspect: "16 / 9",
      },
    ],
  },
  {
    slug: "regression-sim",
    title: "Regression Sim",
    tagline: "A Python harness for running simulation regressions",
    category: "Tools",
    year: "2026",
    repo: "https://github.com/PETERFEE/Regression_sim",
    accent: "amber",
    featured: false,
    summary:
      "A small Python tool for driving repeated simulation runs and collecting their results. Placeholder copy — send me a line about what this one actually does and I'll rewrite it properly.",
    features: [
      {
        title: "Needs your description",
        detail:
          "The repo has no README, so this card is a stub. Tell me what it does and I will replace this text with something real.",
      },
    ],
    stack: ["Python"],
    media: [
      {
        file: "output.png",
        kind: "screenshot",
        hint: "Any screenshot of the tool running or its output",
        alt: "Regression Sim output",
        aspect: "16 / 9",
        lead: true,
      },
    ],
  },
  {
    slug: "circuit-1-ltspice",
    title: "LTspice Circuit Studies",
    tagline: "Analog simulation work — bias points, transient response, frequency sweeps",
    category: "Analog / Simulation",
    year: "2026",
    repo: "https://github.com/PETERFEE/Circuit_1_LTspice",
    accent: "wave",
    featured: false,
    summary:
      "LTspice schematics and simulation runs from analog circuits coursework. Placeholder copy — tell me which circuits these are and what you were characterizing, and I'll write this up properly.",
    features: [
      {
        title: "Needs your description",
        detail:
          "Tell me which circuits are in here and what the simulations were characterizing, and I will replace this stub.",
      },
    ],
    stack: ["LTspice", "Analog design"],
    media: [
      {
        file: "schematic.png",
        kind: "diagram",
        hint: "An LTspice schematic screenshot",
        alt: "An LTspice schematic",
        aspect: "16 / 9",
        lead: true,
      },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
