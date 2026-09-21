import Link from "next/link";
import { notFound } from "next/navigation";
import { apiGetOrNull } from "@/lib/api";
import type { Project } from "@/lib/types";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { ProjectForm } from "../ProjectForm";
import {
  updateProject,
  addProjectGalleryImage,
  deleteProjectGalleryImage,
  reorderProjectGalleryImage,
  setProjectFeaturedImage,
} from "../actions";

export default async function ProjectDetailAdminPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = await apiGetOrNull<Project>(`/api/projects/${projectId}`);

  if (!project) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/projects" className="text-xs text-bone/50 hover:text-bone">
        ← Back to Projects
      </Link>
      <h1 className="mt-2 font-display text-2xl text-gold-metal">{project.title}</h1>

      <section className="mt-6">
        <h2 className="text-sm font-medium text-bone/70">Details</h2>
        <div className="mt-2">
          <ProjectForm action={updateProject.bind(null, project.id)} initial={project} submitLabel="Save changes" />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-bone/70">Gallery (photos & videos)</h2>
        <div className="mt-2">
          <GalleryManager
            section="projects"
            items={[...project.images].sort((a, b) => a.order - b.order).map((img) => ({ id: img.id, url: img.url, mediaType: img.mediaType, alt: img.alt }))}
            featuredUrl={project.featuredImage}
            onAdd={async (url, mediaType) => {
              "use server";
              await addProjectGalleryImage(project.id, url, mediaType);
            }}
            onDelete={async (id) => {
              "use server";
              await deleteProjectGalleryImage(id);
            }}
            onReorder={async (id, direction) => {
              "use server";
              await reorderProjectGalleryImage(id, direction);
            }}
            onSetFeatured={async (item) => {
              "use server";
              await setProjectFeaturedImage(project.id, item.url);
            }}
          />
        </div>
      </section>
    </div>
  );
}
