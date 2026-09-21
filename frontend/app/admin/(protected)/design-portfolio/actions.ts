"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiAdmin } from "@/lib/api";
import type { DesignWork } from "@/lib/types";

function refresh(kind?: string, scope?: string, slug?: string) {
  revalidatePath("/admin/design-portfolio");
  revalidatePath("/design");
  if (kind) revalidatePath(`/design/${kind}`);
  if (kind && scope) revalidatePath(`/design/${kind}/${scope}`);
  if (kind && scope && slug) revalidatePath(`/design/${kind}/${scope}/${slug}`);
}

export async function createDesignWork(formData: FormData) {
  const kind = String(formData.get("kind") ?? "interior");
  const scope = String(formData.get("scope") ?? "residential");

  const work = await apiAdmin<DesignWork>("/api/design-works", {
    method: "POST",
    body: JSON.stringify({
      title: String(formData.get("title") ?? "").trim(),
      kind,
      scope,
      roomType: (formData.get("roomType") as string) || null,
      description: (formData.get("description") as string) || null,
      featuredImage: (formData.get("featuredImage") as string) || null,
    }),
  });

  refresh(work.kind, work.scope, work.slug);
  redirect(`/admin/design-portfolio/${work.id}`);
}

export async function updateDesignWork(id: string, formData: FormData) {
  const work = await apiAdmin<DesignWork>(`/api/design-works/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title: String(formData.get("title") ?? "").trim(),
      kind: String(formData.get("kind") ?? "interior"),
      scope: String(formData.get("scope") ?? "residential"),
      roomType: (formData.get("roomType") as string) || null,
      description: (formData.get("description") as string) || null,
      featuredImage: (formData.get("featuredImage") as string) || null,
    }),
  });

  refresh(work.kind, work.scope, work.slug);
}

export async function deleteDesignWork(id: string) {
  await apiAdmin(`/api/design-works/${id}`, { method: "DELETE" });
  refresh();
}

export async function toggleDesignWorkPublished(id: string, published: boolean) {
  await apiAdmin(`/api/design-works/${id}/publish`, {
    method: "POST",
    body: JSON.stringify({ published }),
  });
  refresh();
}

export async function reorderDesignWork(id: string, direction: "up" | "down") {
  await apiAdmin(`/api/design-works/${id}/reorder`, {
    method: "POST",
    body: JSON.stringify({ direction }),
  });
  refresh();
}

export async function addDesignWorkImage(designWorkId: string, url: string) {
  await apiAdmin(`/api/design-works/${designWorkId}/images`, {
    method: "POST",
    body: JSON.stringify({ url }),
  });
  revalidatePath(`/admin/design-portfolio/${designWorkId}`);
  refresh();
}

export async function deleteDesignWorkImage(imageId: string) {
  await apiAdmin(`/api/design-works/images/${imageId}`, { method: "DELETE" });
  refresh();
}

export async function reorderDesignWorkImage(imageId: string, direction: "up" | "down") {
  await apiAdmin(`/api/design-works/images/${imageId}/reorder`, {
    method: "POST",
    body: JSON.stringify({ direction }),
  });
}

export async function setDesignWorkFeaturedImage(designWorkId: string, url: string) {
  await apiAdmin(`/api/design-works/${designWorkId}/featured-image`, {
    method: "PUT",
    body: JSON.stringify({ url }),
  });
  revalidatePath(`/admin/design-portfolio/${designWorkId}`);
  refresh();
}
