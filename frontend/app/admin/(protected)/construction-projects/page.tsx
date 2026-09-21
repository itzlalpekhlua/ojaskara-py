import Link from "next/link";
import { apiGet } from "@/lib/api";
import type { ConstructionProject } from "@/lib/types";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { ReorderButtons } from "@/components/admin/ReorderButtons";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { ConstructionProjectForm } from "./ConstructionProjectForm";
import {
  createConstructionProject,
  deleteConstructionProject,
  toggleConstructionProjectPublished,
  reorderConstructionProject,
} from "./actions";

export default async function ConstructionProjectsAdminPage() {
  const projects = (await apiGet<ConstructionProject[]>("/api/construction-projects")).sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl text-gold-metal">Construction Projects</h1>
      <p className="mt-1 text-sm text-bone/50">Completed and ongoing projects with photo/video galleries.</p>

      <details className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-4">
        <summary className="cursor-pointer text-sm font-medium text-gold-300">+ Add project</summary>
        <div className="mt-4">
          <ConstructionProjectForm action={createConstructionProject} submitLabel="Create & manage gallery" />
        </div>
      </details>

      <div className="mt-6 space-y-3">
        {projects.map((project, index) => (
          <div key={project.id} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-4">
            {project.featuredImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.featuredImage} alt="" className="h-12 w-12 rounded-md object-cover" />
            ) : (
              <div className="h-12 w-12 rounded-md bg-white/10" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{project.title}</p>
              <p className="truncate text-xs text-bone/50">
                {project.location || "No location"} · {project.images.length} media items
              </p>
            </div>
            <Link href={`/admin/construction-projects/${project.id}`} className="text-xs text-gold-300 hover:text-gold-200">
              Manage
            </Link>
            <ReorderButtons
              canMoveUp={index > 0}
              canMoveDown={index < projects.length - 1}
              onMoveUp={async () => {
                "use server";
                await reorderConstructionProject(project.id, "up");
              }}
              onMoveDown={async () => {
                "use server";
                await reorderConstructionProject(project.id, "down");
              }}
            />
            <PublishToggle
              published={project.published}
              onToggle={async (next) => {
                "use server";
                await toggleConstructionProjectPublished(project.id, next);
              }}
            />
            <ConfirmDeleteButton
              onDelete={async () => {
                "use server";
                await deleteConstructionProject(project.id);
              }}
            />
          </div>
        ))}
        {projects.length === 0 && <p className="text-sm text-bone/40">No projects yet.</p>}
      </div>
    </div>
  );
}
