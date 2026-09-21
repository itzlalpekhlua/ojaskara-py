"use server";

import { revalidatePath } from "next/cache";
import { apiAdmin } from "@/lib/api";

const FIELDS = [
  "tagline",
  "introTitle",
  "introBody",
  "finalCtaTitle",
  "finalCtaBody",
  "phone",
  "phoneSecondary",
  "email",
  "address",
  "locationPrimaryName",
  "locationPrimaryLabel",
  "locationSecondaryName",
  "locationSecondaryLabel",
  "instagramUrl",
  "facebookUrl",
  "tiktokUrl",
  "whatsappUrl",
] as const;

export async function updateSiteSettings(formData: FormData) {
  const body: Record<string, string | null> = {};
  for (const name of FIELDS) {
    const value = formData.get(name);
    body[name] = typeof value === "string" && value.trim() !== "" ? value.trim() : null;
  }

  await apiAdmin("/api/settings", {
    method: "PUT",
    body: JSON.stringify(body),
  });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}
