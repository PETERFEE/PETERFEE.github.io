/**
 * Biography section content — modelled on the Hugo Blox "academic CV" profile
 * widget: portrait + identity on one side, about/interests/education on the other.
 *
 * PROFILE PICTURE: drop a square photo at  public/profile/avatar.jpg
 * (a .png works too — change `avatar` below to match). Until then the section
 * shows a monogram. ~600x600px is plenty.
 */
export const bio = {
  avatar: "/profile/avatar.jpg",
  initials: "PF",
  name: "Peter Feng",
  role: "Computer Engineering Student",
  org: "University of Florida",
  /** Short line under the name. */
  strapline: "Embedded systems · PCB design · Design & verification",

  /** Two or three short paragraphs. First person, plain language. */
  about: [
    "I'm a computer engineering student who likes the part of the stack where software stops being an abstraction — RTL, firmware, and the boards they run on. Most of what I build starts as a question about how something actually behaves under load, then turns into a testbench or a scope trace that answers it.",
    "Lately that's meant writing a store-and-forward packet FIFO and a UVM environment that predicts every dropped frame exactly, tuning FreeRTOS task priorities on an STM32 telemetry node, and teaching a robot car to map a room with a spinning LiDAR. I care about designs that are provably correct, not just ones that pass a smoke test.",
    "Passionate about solving problems efficiently and building intelligent systems.",
  ],

  /** Shown as a bulleted interest list, like the academic-CV widget. */
  interests: [
    "RTL Design & Functional Verification",
    "Embedded Systems & Real-Time Operating Systems",
    "FPGA & Hardware Acceleration",
    "Robotics, SLAM & Sensor Fusion",
    "PCB Design & Hardware Bring-up",
  ],

  /**
   * Education. EDIT THIS — the degree and years are a best guess and you should
   * correct them before showing anyone.
   */
  education: [
    {
      degree: "B.S. Computer Engineering",
      institution: "University of Florida",
      period: "Expected 2027",
      note: "Coursework in operating systems, SystemVerilog verification, computer architecture, and analog circuits.",
    },
  ],

  /** Compact stat row beside the portrait. */
  facts: [
    { value: "10+", label: "Public projects" },
    { value: "6", label: "Languages & HDLs" },
    { value: "UVM", label: "Verification focus" },
  ],

  /** Languages and tools, as a quick scan. Mirrors the GitHub profile. */
  languages: ["C", "C++", "Python", "SystemVerilog", "VHDL", "Rust", "Java", "JavaScript"],
} as const;
