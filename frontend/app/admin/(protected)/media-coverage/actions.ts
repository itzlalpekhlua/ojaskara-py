"use server";

import { revalidatePath } from "next/cache";
import { apiAdmin } from "@/lib/api";

function refresh() {
  revalidatePath("/admin/media-coverage");
  revalidatePath("/");
}

export async function createMediaFeature(formData: FormData) {
  await apiAdmin("/api/media-features", {
    method: "POST",
    body: JSON.stringify({
      title: String(formData.get("title") ?? "").trim(),
      outlet: String(formData.get("outlet") ?? "").trim(),
      url: String(formData.get("url") ?? "").trim(),
      type: String(formData.get("type") ?? "article"),
      thumbnail: (formData.get("thumbnail") as string) || null,
    }),
  });

  refresh();
}

export async function updateMediaFeature(id: string, formData: FormData) {
  await apiAdmin(`/api/media-features/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title: String(formData.get("title") ?? "").trim(),
      outlet: String(formData.get("outlet") ?? "").trim(),
      url: String(formData.get("url") ?? "").trim(),
      type: String(formData.get("type") ?? "article"),
      thumbnail: (formData.get("thumbnail") as string) || null,
    }),
  });

  refresh();
}

export async function deleteMediaFeature(id: string) {
  await apiAdmin(`/api/media-features/${id}`, { method: "DELETE" });
  refresh();
}

export async function toggleMediaFeaturePublished(id: string, published: boolean) {
  await apiAdmin(`/api/media-features/${id}/publish`, {
    method: "POST",
    body: JSON.stringify({ published }),
  });
  refresh();
}

export async function reorderMediaFeature(id: string, direction: "up" | "down") {
  await apiAdmin(`/api/media-features/${id}/reorder`, {
    method: "POST",
    body: JSON.stringify({ direction }),
  });
  refresh();
}
