"use server";

import { revalidatePath } from "next/cache";
import { apiAdmin } from "@/lib/api";

function refresh() {
  revalidatePath("/admin/team");
  revalidatePath("/team");
}

export async function createTeamMember(formData: FormData) {
  await apiAdmin("/api/team", {
    method: "POST",
    body: JSON.stringify({
      name: String(formData.get("name") ?? "").trim(),
      role: String(formData.get("role") ?? "").trim(),
      description: (formData.get("description") as string) || null,
      image: (formData.get("image") as string) || null,
    }),
  });

  refresh();
}

export async function updateTeamMember(id: string, formData: FormData) {
  await apiAdmin(`/api/team/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      name: String(formData.get("name") ?? "").trim(),
      role: String(formData.get("role") ?? "").trim(),
      description: (formData.get("description") as string) || null,
      image: (formData.get("image") as string) || null,
    }),
  });

  refresh();
}

export async function deleteTeamMember(id: string) {
  await apiAdmin(`/api/team/${id}`, { method: "DELETE" });
  refresh();
}

export async function toggleTeamMemberPublished(id: string, published: boolean) {
  await apiAdmin(`/api/team/${id}/publish`, {
    method: "POST",
    body: JSON.stringify({ published }),
  });
  refresh();
}

export async function reorderTeamMember(id: string, direction: "up" | "down") {
  await apiAdmin(`/api/team/${id}/reorder`, {
    method: "POST",
    body: JSON.stringify({ direction }),
  });
  refresh();
}
