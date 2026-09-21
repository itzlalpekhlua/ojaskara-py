"use server";

import { revalidatePath } from "next/cache";
import { apiAdmin } from "@/lib/api";

function refresh() {
  revalidatePath("/admin/social");
  revalidatePath("/social");
}

export async function createSocialPost(formData: FormData) {
  await apiAdmin("/api/social-posts", {
    method: "POST",
    body: JSON.stringify({
      platform: String(formData.get("platform") ?? "instagram"),
      embedUrl: String(formData.get("embedUrl") ?? "").trim(),
      caption: (formData.get("caption") as string) || null,
      thumbnail: (formData.get("thumbnail") as string) || null,
    }),
  });

  refresh();
}

export async function updateSocialPost(id: string, formData: FormData) {
  await apiAdmin(`/api/social-posts/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      platform: String(formData.get("platform") ?? "instagram"),
      embedUrl: String(formData.get("embedUrl") ?? "").trim(),
      caption: (formData.get("caption") as string) || null,
      thumbnail: (formData.get("thumbnail") as string) || null,
    }),
  });

  refresh();
}

export async function deleteSocialPost(id: string) {
  await apiAdmin(`/api/social-posts/${id}`, { method: "DELETE" });
  refresh();
}

export async function toggleSocialPostPublished(id: string, published: boolean) {
  await apiAdmin(`/api/social-posts/${id}/publish`, {
    method: "POST",
    body: JSON.stringify({ published }),
  });
  refresh();
}

export async function reorderSocialPost(id: string, direction: "up" | "down") {
  await apiAdmin(`/api/social-posts/${id}/reorder`, {
    method: "POST",
    body: JSON.stringify({ direction }),
  });
  refresh();
}
