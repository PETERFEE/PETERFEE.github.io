import Link from "next/link";
import type { Project } from "@/types/project";
import { LiveDemo } from "@/components/live-demo";
import { ProjectShowcase } from "@/components/project-showcase";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

export interface ProjectDetailProps {
  project: Project;
}

/**
 * A full page for one project. Reuses ProjectShowcase for the body so the
 * dedicated page and the in-page section stay identical in look and never
 * drift apart; the page adds the chrome around it.
 */
export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <>
      <SiteNav />

      <main id="top" className="pt-28 sm:pt-32">
        <div className="shell">
          <Link
            href="/#gallery"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-chalk-faint transition-colors duration-300 hover:text-chalk"
          >
            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            All projects
          </Link>
        </div>

        {project.demoEmbed ? (
          <div className="shell mt-10">
            <LiveDemo
              src={project.demoEmbed}
              title={project.title}
              hint="Loads Three.js and builds a few thousand particles, so it only starts when you ask it to."
              repo={project.repo}
            />
          </div>
        ) : null}

        <ProjectShowcase project={project} index={0} />
      </main>

      <SiteFooter id="contact" />
    </>
  );
}
