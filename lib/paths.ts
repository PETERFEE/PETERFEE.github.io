/**
 * GitHub Pages project sites live under /<repo>/, and Next.js only rewrites
 * basePath for next/link and next/image — raw strings in iframe src or plain
 * hrefs are left alone. Route everything user-authored through this.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
