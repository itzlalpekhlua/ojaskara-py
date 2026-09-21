"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiAdmin } from "@/lib/api";
import type { Project } from "@/lib/types";

function refresh(slug?: string) {
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  if (slug) revalidatePath(`/projects/${slug}`);
}

export async function createProject(formData: FormData) {
  const project = await apiAdmin<Project>("/api/projects", {
    method: "POST",
    body: JSON.stringify({
      title: String(formData.get("title") ?? "").trim(),
      category: (formData.get("category") as string) || null,
      location: (formData.get("location") as string) || null,
      description: (formData.get("description") as string) || null,
      featuredImage: (formData.get("featuredImage") as string) || null,
    }),
  });

  refresh(project.slug);
  redirect(`/admin/projects/${project.id}`);
}

export async function updateProject(id: string, formData: FormData) {
  const project = await apiAdmin<Project>(`/api/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title: String(formData.get("title") ?? "").trim(),
      category: (formData.get("category") as string) || null,
      location: (formData.get("location") as string) || null,
      description: (formData.get("description") as string) || null,
      featuredImage: (formData.get("featuredImage") as string) || null,
    }),
  });

  refresh(project.slug);
}

export async function deleteProject(id: string) {
  await apiAdmin(`/api/projects/${id}`, { method: "DELETE" });
  refresh();
}

export async function toggleProjectPublished(id: string, published: boolean) {
  await apiAdmin(`/api/projects/${id}/publish`, {
    method: "POST",
    body: JSON.stringify({ published }),
  });
  refresh();
}

export async function reorderProject(id: string, direction: "up" | "down") {
  await apiAdmin(`/api/projects/${id}/reorder`, {
    method: "POST",
    body: JSON.stringify({ direction }),
  });
  refresh();
}

export async function addProjectGalleryImage(projectId: string, url: string, mediaType: "image" | "video") {
  await apiAdmin(`/api/projects/${projectId}/images`, {
    method: "POST",
    body: JSON.stringify({ url, mediaType }),
  });
  revalidatePath(`/admin/projects/${projectId}`);
  refresh();
}

export async function deleteProjectGalleryImage(imageId: string) {
  await apiAdmin(`/api/projects/images/${imageId}`, { method: "DELETE" });
  refresh();
}

export async function reorderProjectGalleryImage(imageId: string, direction: "up" | "down") {
  await apiAdmin(`/api/projects/images/${imageId}/reorder`, {
    method: "POST",
    body: JSON.stringify({ direction }),
  });
}

export async function setProjectFeaturedImage(projectId: string, url: string) {
  await apiAdmin(`/api/projects/${projectId}/featured-image`, {
    method: "PUT",
    body: JSON.stringify({ url }),
  });
  revalidatePath(`/admin/projects/${projectId}`);
  refresh();
}
