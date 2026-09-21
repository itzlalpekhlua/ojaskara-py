import Link from "next/link";
import { notFound } from "next/navigation";
import { apiGetOrNull } from "@/lib/api";
import type { ConstructionProject } from "@/lib/types";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { ConstructionProjectForm } from "../ConstructionProjectForm";
import {
  updateConstructionProject,
  addProjectImage,
  deleteProjectImage,
  reorderProjectImage,
  setProjectFeaturedImage,
} from "../actions";

export default async function ConstructionProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = await apiGetOrNull<ConstructionProject>(`/api/construction-projects/${projectId}`);

  if (!project) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/construction-projects" className="text-xs text-bone/50 hover:text-bone">
        ← Back to Construction Projects
      </Link>
      <h1 className="mt-2 font-display text-2xl text-gold-metal">{project.title}</h1>

      <section className="mt-6">
        <h2 className="text-sm font-medium text-bone/70">Details</h2>
        <div className="mt-2">
          <ConstructionProjectForm action={updateConstructionProject.bind(null, project.id)} initial={project} submitLabel="Save changes" />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-bone/70">Gallery (photos & videos)</h2>
        <div className="mt-2">
          <GalleryManager
            section="construction-projects"
            items={[...project.images].sort((a, b) => a.order - b.order).map((img) => ({ id: img.id, url: img.url, mediaType: img.mediaType, alt: img.alt }))}
            featuredUrl={project.featuredImage}
            onAdd={async (url, mediaType) => {
              "use server";
              await addProjectImage(project.id, url, mediaType);
            }}
            onDelete={async (id) => {
              "use server";
              await deleteProjectImage(id);
            }}
            onReorder={async (id, direction) => {
              "use server";
              await reorderProjectImage(id, direction);
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
