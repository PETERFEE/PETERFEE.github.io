import Link from "next/link";
import type { Project } from "@/types/project";
import { DemoStage } from "@/components/demo-stage";
import { ProjectShowcase } from "@/components/project-showcase";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

export interface ProjectDetailProps {
  project: Project;
}

function BackLink() {
  return (
    <Link
      href="/#gallery"
      className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-chalk-faint transition-colors duration-300 hover:text-chalk"
    >
      <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">
        ←
      </span>
      All projects
    </Link>
  );
}

/**
 * A full page for one project. Reuses ProjectShowcase for the body so the
 * dedicated page and the home page's section can never drift apart visually;
 * the page supplies the chrome around it and promotes the title to h1.
 *
 * A project with an embedded demo opens on that demo full-bleed — no top
 * padding, nothing above it — so the first thing on screen is the thing
 * itself. The back link then moves below the stage, since anything above it
 * would push the demo down the page.
 */
export function ProjectDetail({ project }: ProjectDetailProps) {
  const hasStage = Boolean(project.demoEmbed);

  return (
    <>
      <SiteNav />

      <main id="main" className={hasStage ? undefined : "pt-28 sm:pt-32"}>
        <div id="top" aria-hidden className="absolute top-0" />

        {hasStage && project.demoEmbed ? (
          <>
            <DemoStage src={project.demoEmbed} title={project.title} repo={project.repo} />
            <div className="shell pt-4">
              <BackLink />
            </div>
          </>
        ) : (
          <div className="shell">
            <BackLink />
          </div>
        )}

        <ProjectShowcase project={project} index={0} titleAs="h1" />
      </main>

      <SiteFooter id="contact" />
    </>
  );
}
