import type { Metadata, Viewport } from "next";
import { AmbientField } from "@/components/ambient-field";
import { site } from "@/data/site";
import "./globals.css";

/*
  Fonts are loaded with a plain <link> rather than next/font/google on purpose:
  next/font fetches at BUILD time, so it hard-fails on any machine or CI runner
  without outbound access to fonts.googleapis.com. A stylesheet link resolves in
  the visitor's browser instead, so the build stays offline-safe everywhere.

  If you'd rather have next/font's self-hosting and zero layout shift, swap in:
    import { Inter, JetBrains_Mono } from "next/font/google";
    const sans = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" });
    const mono = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-mono" });
  ...then put `${sans.variable} ${mono.variable}` on <html> and delete the <link> tags.
*/
const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";

export const metadata: Metadata = {
  title: {
    default: `${site.name} — RTL Design, UVM Verification, Embedded Systems`,
    template: `%s — ${site.name}`,
  },
  description: site.lede,
  keywords: [
    "SystemVerilog", "UVM", "design verification", "RTL design", "FPGA",
    "FreeRTOS", "embedded systems", "STM32", "AXI4-Stream", "ROS 2",
  ],
  authors: [{ name: site.name, url: site.links.github }],
  creator: site.name,
  openGraph: {
    type: "website",
    title: `${site.name} — RTL Design, UVM Verification, Embedded Systems`,
    description: site.lede,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — RTL Design, UVM Verification, Embedded Systems`,
    description: site.lede,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONT_HREF} />
      </head>
      <body>
        {/*
          AmbientField is a pure RSC pinned at `fixed inset-0 -z-10`. It must sit
          here as a direct child of <body> — nesting it inside any element that
          creates a stacking context (transform, filter, opacity) would trap the
          negative z-index inside that element.
        */}
        <AmbientField />
        <a
          href="#work"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-chalk focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-ink-950"
        >
          Skip to the work
        </a>
        {children}
      </body>
    </html>
  );
}
