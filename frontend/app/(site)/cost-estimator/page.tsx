import { apiGet } from "@/lib/api";
import type { CostEstimatorRates } from "@/lib/types";
import { GoldLabel } from "@/components/ui/GoldLabel";
import { Reveal } from "@/components/ui/Reveal";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { CostEstimatorTool } from "@/components/CostEstimatorTool";

export default async function CostEstimatorPage() {
  const rates = await apiGet<CostEstimatorRates>("/api/cost-estimator-rates");

  return (
    <div className="relative overflow-hidden bg-ink-950 pt-32 pb-28">
      <AmbientGlow />
      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-10">
        <Reveal>
          <GoldLabel>Plan Your Budget</GoldLabel>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-4 font-display text-5xl font-bold text-gold-3d sm:text-6xl md:text-7xl">Cost Estimator</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-8 max-w-xl text-base text-bone/60 sm:text-lg">
            Work out material quantities and a rough project budget for your build in Nepal — instantly, before you talk to us.
          </p>
        </Reveal>
      </div>

      <div className="relative mx-auto mt-16 max-w-6xl px-6 md:px-10">
        <Reveal delay={0.2}>
          <CostEstimatorTool rates={rates} />
        </Reveal>
      </div>
    </div>
  );
}
