"use server";

import { revalidatePath } from "next/cache";
import { apiAdmin } from "@/lib/api";

function refresh() {
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");
}

export async function createTestimonial(formData: FormData) {
  const ratingRaw = (formData.get("rating") as string) || "";
  await apiAdmin("/api/testimonials", {
    method: "POST",
    body: JSON.stringify({
      kind: (formData.get("kind") as string) || "review",
      customerName: String(formData.get("customerName") ?? "").trim(),
      reviewText: (formData.get("reviewText") as string) || null,
      location: (formData.get("location") as string) || null,
      rating: ratingRaw ? Number(ratingRaw) : null,
      response: (formData.get("response") as string) || null,
      videoUrl: (formData.get("videoUrl") as string) || null,
      thumbnail: (formData.get("thumbnail") as string) || null,
    }),
  });

  refresh();
}

export async function updateTestimonial(id: string, formData: FormData) {
  const ratingRaw = (formData.get("rating") as string) || "";
  await apiAdmin(`/api/testimonials/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      kind: (formData.get("kind") as string) || "review",
      customerName: String(formData.get("customerName") ?? "").trim(),
      reviewText: (formData.get("reviewText") as string) || null,
      location: (formData.get("location") as string) || null,
      rating: ratingRaw ? Number(ratingRaw) : null,
      response: (formData.get("response") as string) || null,
      videoUrl: (formData.get("videoUrl") as string) || null,
      thumbnail: (formData.get("thumbnail") as string) || null,
    }),
  });

  refresh();
}

export async function deleteTestimonial(id: string) {
  await apiAdmin(`/api/testimonials/${id}`, { method: "DELETE" });
  refresh();
}

export async function toggleTestimonialPublished(id: string, published: boolean) {
  await apiAdmin(`/api/testimonials/${id}/publish`, {
    method: "POST",
    body: JSON.stringify({ published }),
  });
  refresh();
}

export async function reorderTestimonial(id: string, direction: "up" | "down") {
  await apiAdmin(`/api/testimonials/${id}/reorder`, {
    method: "POST",
    body: JSON.stringify({ direction }),
  });
  refresh();
}
