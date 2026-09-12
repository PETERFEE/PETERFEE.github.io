import { Biography } from "@/components/biography";
import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/project-card";
import { ProjectGallery } from "@/components/project-gallery";
import { ProjectShowcase } from "@/components/project-showcase";
import { ScrollProgress } from "@/components/motion";
import { SectionHeader } from "@/components/section-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { ToolchainStrip } from "@/components/toolchain-strip";
import { featuredProjects, otherProjects } from "@/data/projects";

export default function Page() {
  return (
    <>
      <ScrollProgress />
      <SiteNav />

      <main>
        <Hero />

        {/* 1 — who this is. Portrait rail + about/interests/education. */}
        <Biography id="about" />

        {/* 2 — everything at a glance. Tiles link down to the detail
            sections below, or out to GitHub for the ones without one. */}
        <ProjectGallery id="gallery" />

        {/* 3 — the deep dives. Each showcase pins its own left column while
            the right scrolls past, so nothing here may be wrapped in a
            component that applies transform/filter: that creates a containing
            block and silently kills the sticky pin. */}
        <section id="work" className="scroll-mt-24 border-t border-ink-700">
          <div className="shell pt-20 sm:pt-28">
            <SectionHeader
              eyebrow="03 / Deep dives"
              title="Five projects, end to end."
              description="Ordered by what I'd want you to read first. Each one links straight to the repository — the commit history is part of the argument."
            />
          </div>

          <div className="mt-16 sm:mt-24">
            {featuredProjects.map((project, index) => (
              <ProjectShowcase key={project.slug} project={project} index={index} />
            ))}
          </div>
        </section>

        {/* 4 — the rest, as cards. */}
        <section id="more" className="scroll-mt-24 border-t border-ink-700 py-24 sm:py-32">
          <div className="shell">
            <SectionHeader
              eyebrow="04 / More work"
              title="Smaller builds and experiments."
              description="Hackathon hardware, driver ports, browser tooling, and coursework simulation."
            />

            <div className="mt-14 grid gap-6 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
              {otherProjects.map((project, index) => (
                <ProjectCard key={project.slug} project={project} index={index} />
              ))}
            </div>
          </div>
        </section>

        <ToolchainStrip id="toolchain" />
      </main>

      <SiteFooter id="contact" />
    </>
  );
}
