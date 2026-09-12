import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/project-detail";
import { projects } from "@/data/projects";

interface Params {
  params: { slug: string };
}

/**
 * Required by `output: "export"` — tells Next which slugs to pre-render.
 * Add a project to data/projects.ts and its page appears automatically.
 */
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary },
  };
}

export default function ProjectPage({ params }: Params) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
