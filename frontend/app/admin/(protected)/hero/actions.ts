"use server";

import { revalidatePath } from "next/cache";
import { apiAdmin } from "@/lib/api";

export async function setHeroVideo(url: string) {
  await apiAdmin("/api/settings/hero-video", {
    method: "PUT",
    body: JSON.stringify({ url }),
  });

  revalidatePath("/admin/hero");
  revalidatePath("/");
}

export async function resetHeroVideo() {
  await apiAdmin("/api/settings/hero-video", { method: "DELETE" });

  revalidatePath("/admin/hero");
  revalidatePath("/");
}
