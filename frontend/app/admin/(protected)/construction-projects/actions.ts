"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiAdmin } from "@/lib/api";
import type { ConstructionProject } from "@/lib/types";

function refresh(slug?: string) {
  revalidatePath("/admin/construction-projects");
  revalidatePath("/construction-projects");
  if (slug) revalidatePath(`/construction-projects/${slug}`);
}

export async function createConstructionProject(formData: FormData) {
  const project = await apiAdmin<ConstructionProject>("/api/construction-projects", {
    method: "POST",
    body: JSON.stringify({
      title: String(formData.get("title") ?? "").trim(),
      categoryLabel: (formData.get("categoryLabel") as string) || null,
      location: (formData.get("location") as string) || null,
      featuredImage: (formData.get("featuredImage") as string) || null,
    }),
  });

  refresh(project.slug);
  redirect(`/admin/construction-projects/${project.id}`);
}

export async function updateConstructionProject(id: string, formData: FormData) {
  const project = await apiAdmin<ConstructionProject>(`/api/construction-projects/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title: String(formData.get("title") ?? "").trim(),
      categoryLabel: (formData.get("categoryLabel") as string) || null,
      location: (formData.get("location") as string) || null,
      featuredImage: (formData.get("featuredImage") as string) || null,
    }),
  });

  refresh(project.slug);
}

export async function deleteConstructionProject(id: string) {
  await apiAdmin(`/api/construction-projects/${id}`, { method: "DELETE" });
  refresh();
}

export async function toggleConstructionProjectPublished(id: string, published: boolean) {
  await apiAdmin(`/api/construction-projects/${id}/publish`, {
    method: "POST",
    body: JSON.stringify({ published }),
  });
  refresh();
}

export async function reorderConstructionProject(id: string, direction: "up" | "down") {
  await apiAdmin(`/api/construction-projects/${id}/reorder`, {
    method: "POST",
    body: JSON.stringify({ direction }),
  });
  refresh();
}

export async function addProjectImage(projectId: string, url: string, mediaType: "image" | "video") {
  await apiAdmin(`/api/construction-projects/${projectId}/images`, {
    method: "POST",
    body: JSON.stringify({ url, mediaType }),
  });
  revalidatePath(`/admin/construction-projects/${projectId}`);
  refresh();
}

export async function deleteProjectImage(imageId: string) {
  await apiAdmin(`/api/construction-projects/images/${imageId}`, { method: "DELETE" });
  refresh();
}

export async function reorderProjectImage(imageId: string, direction: "up" | "down") {
  await apiAdmin(`/api/construction-projects/images/${imageId}/reorder`, {
    method: "POST",
    body: JSON.stringify({ direction }),
  });
}

export async function setProjectFeaturedImage(projectId: string, url: string) {
  await apiAdmin(`/api/construction-projects/${projectId}/featured-image`, {
    method: "PUT",
    body: JSON.stringify({ url }),
  });
  revalidatePath(`/admin/construction-projects/${projectId}`);
  refresh();
}
