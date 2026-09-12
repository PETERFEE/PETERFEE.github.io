/**
 * GitHub Pages serves a PROJECT site from a subpath
 * (https://peterfee.github.io/<repo>/), which breaks every absolute asset URL
 * unless Next knows about that prefix. A USER site
 * (https://peterfee.github.io/, repo named peterfee.github.io) needs no prefix.
 *
 * So the prefix is read from the environment: unset for a user site, set to
 * "/<repo>" in the deploy workflow for a project site. Nothing else changes.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export => no server needed. Works on Pages, Netlify, Vercel, S3.
  output: "export",
  // The Pages CDN has no Next image optimizer behind it.
  images: { unoptimized: true },
  // Emits about/index.html rather than about.html, so paths resolve on a
  // plain static host without rewrite rules.
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
