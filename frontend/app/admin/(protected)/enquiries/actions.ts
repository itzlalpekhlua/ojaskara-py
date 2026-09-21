"use server";

import { revalidatePath } from "next/cache";
import { apiAdmin } from "@/lib/api";

function refresh() {
  revalidatePath("/admin/enquiries");
}

export async function markEnquiryStatus(id: string, status: "new" | "read" | "handled") {
  await apiAdmin(`/api/admin/enquiries/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  refresh();
}

export async function deleteEnquiry(id: string) {
  await apiAdmin(`/api/admin/enquiries/${id}`, { method: "DELETE" });
  refresh();
}
