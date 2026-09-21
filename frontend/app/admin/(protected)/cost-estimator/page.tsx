import { apiGet } from "@/lib/api";
import type { CostEstimatorRates } from "@/lib/types";
import { updateCostEstimatorRates } from "./actions";
import { SaveForm } from "@/components/admin/SaveForm";
import { SaveButton } from "@/components/admin/SaveButton";

const inputClass =
  "mt-1 w-full rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:border-gold-400";
const labelClass = "block text-xs uppercase tracking-wide text-bone/50";

function Field({
  name,
  label,
  defaultValue,
  suffix,
}: {
  name: string;
  label: string;
  defaultValue: number;
  suffix: string;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label} <span className="text-bone/30">({suffix})</span>
      </label>
      <input id={name} name={name} type="number" step="0.01" min="0" defaultValue={defaultValue} className={inputClass} />
    </div>
  );
}

export default async function CostEstimatorAdminPage() {
  const rates = await apiGet<CostEstimatorRates>("/api/cost-estimator-rates");

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl text-gold-metal">Cost Estimator Rates</h1>
      <p className="mt-1 text-sm text-bone/50">
        These prices power the public "Cost Estimator" page — update them whenever material costs or your per-sq.ft rates
        change. No code, no developer needed.
      </p>

      <SaveForm action={updateCostEstimatorRates} className="mt-8 space-y-8">
        <section>
          <h2 className="text-sm font-semibold text-bone/80">Material rates (NPR)</h2>
          <p className="mt-1 text-xs text-bone/40">Used by the Material Calculator (concrete, bricks, steel).</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field name="cementPerBag" label="Cement" defaultValue={rates.cementPerBag} suffix="per 50kg bag" />
            <Field name="sandPerCuFt" label="Sand" defaultValue={rates.sandPerCuFt} suffix="per cu.ft" />
            <Field name="aggregatePerCuFt" label="Aggregate" defaultValue={rates.aggregatePerCuFt} suffix="per cu.ft" />
            <Field name="brickPerPc" label="Brick" defaultValue={rates.brickPerPc} suffix="per piece" />
            <Field name="steelPerKg" label="Steel" defaultValue={rates.steelPerKg} suffix="per kg" />
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-bone/80">Project rates (NPR per sq.ft)</h2>
          <p className="mt-1 text-xs text-bone/40">Used by the whole-house Project Cost Estimator, by finishing quality.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Field name="economyRatePerSqFt" label="Economy" defaultValue={rates.economyRatePerSqFt} suffix="per sq.ft" />
            <Field name="standardRatePerSqFt" label="Standard" defaultValue={rates.standardRatePerSqFt} suffix="per sq.ft" />
            <Field name="premiumRatePerSqFt" label="Premium" defaultValue={rates.premiumRatePerSqFt} suffix="per sq.ft" />
          </div>
        </section>

        <SaveButton label="Save changes" />
      </SaveForm>
    </div>
  );
}
