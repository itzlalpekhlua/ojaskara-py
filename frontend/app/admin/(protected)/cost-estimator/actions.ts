"use server";

import { revalidatePath } from "next/cache";
import { apiAdmin } from "@/lib/api";

const DEFAULTS = {
  cementPerBag: 850,
  sandPerCuFt: 90,
  aggregatePerCuFt: 85,
  brickPerPc: 18,
  steelPerKg: 115,
  economyRatePerSqFt: 2800,
  standardRatePerSqFt: 3500,
  premiumRatePerSqFt: 4500,
} as const;

export async function updateCostEstimatorRates(formData: FormData) {
  const num = (name: string, fallback: number) => {
    const value = parseFloat(String(formData.get(name)));
    return Number.isFinite(value) && value >= 0 ? value : fallback;
  };

  const body: Record<string, number> = {};
  for (const [name, fallback] of Object.entries(DEFAULTS)) {
    body[name] = num(name, fallback);
  }

  await apiAdmin("/api/cost-estimator-rates", {
    method: "PUT",
    body: JSON.stringify(body),
  });

  revalidatePath("/admin/cost-estimator");
  revalidatePath("/cost-estimator");
}
