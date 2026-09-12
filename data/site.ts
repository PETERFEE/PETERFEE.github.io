export const site = {
  name: "Peter Feng",
  role: "Computer Engineering",
  // Hero copy — Design & Verification + Embedded positioning.
  headline: ["I build hardware", "and prove it works."],
  lede:
    "Computer engineering student working across RTL design, UVM verification, and embedded firmware — from a store-and-forward packet FIFO with exact drop prediction, to FreeRTOS telemetry nodes, to a robot that maps rooms on its own.",
  disciplines: ["RTL Design", "UVM Verification", "Embedded / RTOS", "FPGA Acceleration", "Robotics"],
  links: {
    github: "https://github.com/PETERFEE",
    linkedin: "https://www.linkedin.com/in/peterfeng718",
    email: "fenghon000@gmail.com",
  },
  nav: [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#gallery" },
    { label: "Deep dives", href: "#work" },
    { label: "Toolchain", href: "#toolchain" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

/** Grouped for the toolchain marquee / strip. */
export const toolchain = [
  { group: "HDL & Verification", items: ["SystemVerilog", "UVM 1.2", "VHDL", "SVA", "Functional Coverage"] },
  { group: "Simulators & EDA", items: ["Questa", "Vivado XSim", "VCS", "Verilator", "Quartus Prime", "LTspice"] },
  { group: "Embedded", items: ["C / C++", "FreeRTOS", "STM32 HAL", "Pico SDK", "ESP32", "CMake"] },
  { group: "Protocols", items: ["AXI4-Stream", "APB", "I²C", "UART", "SPI", "ESP-NOW"] },
  { group: "Systems & Tools", items: ["Python", "ROS 2", "Linux", "Git", "Altium", "Foxglove"] },
] as const;
