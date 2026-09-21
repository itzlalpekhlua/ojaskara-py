"use server";

import { revalidatePath } from "next/cache";
import { apiAdmin } from "@/lib/api";

function refresh() {
  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
}

export async function createService(formData: FormData) {
  await apiAdmin("/api/services", {
    method: "POST",
    body: JSON.stringify({
      title: String(formData.get("title") ?? "").trim(),
      description: (formData.get("description") as string) || null,
      image: (formData.get("image") as string) || null,
      mediaType: (formData.get("mediaType") as string) || "image",
      parentId: (formData.get("parentId") as string) || null,
    }),
  });

  refresh();
}

export async function updateService(id: string, formData: FormData) {
  await apiAdmin(`/api/services/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title: String(formData.get("title") ?? "").trim(),
      description: (formData.get("description") as string) || null,
      image: (formData.get("image") as string) || null,
      mediaType: (formData.get("mediaType") as string) || "image",
    }),
  });

  refresh();
}

export async function deleteService(id: string) {
  await apiAdmin(`/api/services/${id}`, { method: "DELETE" });
  refresh();
}

export async function toggleServicePublished(id: string, published: boolean) {
  await apiAdmin(`/api/services/${id}/publish`, {
    method: "POST",
    body: JSON.stringify({ published }),
  });
  refresh();
}

export async function reorderService(id: string, direction: "up" | "down") {
  await apiAdmin(`/api/services/${id}/reorder`, {
    method: "POST",
    body: JSON.stringify({ direction }),
  });
  refresh();
}
