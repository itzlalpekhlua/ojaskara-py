"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type EstimatorRates = {
  cementPerBag: number;
  sandPerCuFt: number;
  aggregatePerCuFt: number;
  brickPerPc: number;
  steelPerKg: number;
  economyRatePerSqFt: number;
  standardRatePerSqFt: number;
  premiumRatePerSqFt: number;
};

const MIX_RATIOS: { label: string; parts: [number, number, number] }[] = [
  { label: "M10 (1:3:6)", parts: [1, 3, 6] },
  { label: "M15 (1:2:4)", parts: [1, 2, 4] },
  { label: "M20 (1:1.5:3)", parts: [1, 1.5, 3] },
  { label: "M25 (1:1:2)", parts: [1, 1, 2] },
];

const WALL_TYPES: { label: string; thicknessFt: number }[] = [
  { label: `4.5" Half Brick`, thicknessFt: 0.375 },
  { label: `9" Full Brick`, thicknessFt: 0.75 },
  { label: `13.5" One and Half`, thicknessFt: 1.125 },
];

const QUALITY_TIERS = [
  { key: "economy" as const, label: "Economy", blurb: "Basic materials & finishing" },
  { key: "standard" as const, label: "Standard", blurb: "Mid-range materials & finishing" },
  { key: "premium" as const, label: "Premium", blurb: "High-end materials & finishing" },
];

const BRICKS_PER_CU_FT = 13.5;
const DRY_VOLUME_FACTOR = 1.54;
const MORTAR_VOLUME_FACTOR = 0.3;
const MORTAR_DRY_FACTOR = 1.33;
const MORTAR_MIX_RATIO: [number, number] = [1, 6];
const CU_FT_PER_CEMENT_BAG = 1.226;

function formatNPR(n: number) {
  if (!isFinite(n) || n <= 0) return "0";
  return Math.round(n).toLocaleString("en-US");
}

function clamp(n: number, min: number) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, n);
}

function NumberField({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  suffix?: string;
}) {
  return (
    <div>
      <label className="block min-h-[2rem] text-[11px] uppercase tracking-widest2 text-bone/50">{label}</label>
      <div className="relative mt-1.5">
        <input
          type="number"
          value={Number.isFinite(value) ? value : min}
          step={step}
          min={min}
          onChange={(e) => onChange(clamp(parseFloat(e.target.value), min))}
          className="w-full rounded-md border border-white/10 bg-ink-950/70 px-3 py-2.5 text-sm text-bone outline-none transition-colors focus:border-gold-400"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-bone/30">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function ResultRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between border-b border-white/5 py-2.5 last:border-0">
      <span className={`text-sm ${strong ? "text-gold-200 font-semibold" : "text-bone/60"}`}>{label}</span>
      <span className={`font-display text-sm ${strong ? "text-gold-300 font-bold text-base" : "text-bone"}`}>{value}</span>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
        active ? "bg-gold-400 text-ink-950" : "text-bone/60 hover:text-bone"
      }`}
    >
      {children}
    </button>
  );
}

function StepHeader({
  step,
  icon,
  title,
  subtitle,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-950 text-gold-300 ring-1 ring-gold-500/30">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest2 text-gold-400">Step {step}</p>
        <h3 className="font-display text-xl font-bold text-bone">{title}</h3>
        <p className="text-xs text-bone/45">{subtitle}</p>
      </div>
    </div>
  );
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-ink-900/60 ring-1 ring-gold-700/25 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.8)]">
      <div className="h-px w-full bg-gradient-to-r from-purple-600/50 via-gold-400/80 to-emerald-600/50" />
      <div className="p-6 md:p-8">{children}</div>
    </div>
  );
}

function ProjectEstimator({ rates }: { rates: EstimatorRates }) {
  const [area, setArea] = useState(700);
  const [floors, setFloors] = useState(1);
  const [tier, setTier] = useState<"economy" | "standard" | "premium">("standard");

  const rate =
    tier === "economy" ? rates.economyRatePerSqFt : tier === "premium" ? rates.premiumRatePerSqFt : rates.standardRatePerSqFt;
  const totalBuiltUpArea = area * floors;
  const total = totalBuiltUpArea * rate;

  return (
    <CardShell>
      <StepHeader
        step={1}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M3 10h18M8 2v4M16 2v4M8 15h.01M12 15h.01M16 15h.01M8 18h.01M12 18h.01M16 18h.01" />
          </svg>
        }
        title="Quick Project Estimate"
        subtitle="Get a whole-house ballpark in seconds — start here"
      />

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Built-up Area (per floor)" value={area} onChange={setArea} suffix="sq.ft" />
            <NumberField label="Number of Floors" value={floors} onChange={setFloors} min={1} />
          </div>
          <p className="text-[11px] text-bone/35">
            Total built-up area: <span className="text-bone/60">{totalBuiltUpArea.toLocaleString("en-US")} sq.ft</span> ({area}{" "}
            sq.ft × {floors} {floors === 1 ? "floor" : "floors"})
          </p>

          <div>
            <label className="block text-[11px] uppercase tracking-widest2 text-bone/50">Finishing Quality</label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {QUALITY_TIERS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTier(t.key)}
                  title={t.blurb}
                  className={`rounded-md py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                    tier === t.key ? "bg-gold-400 text-ink-950" : "bg-ink-950/70 text-bone/60 ring-1 ring-white/10 hover:text-bone"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-bone/40">
              {QUALITY_TIERS.find((t) => t.key === tier)?.blurb} — Current Rate:{" "}
              <span className="font-semibold text-gold-300">NPR {formatNPR(rate)}</span> / sq.ft
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-purple-900/40 via-ink-950 to-emerald-900/30 p-6 text-center ring-1 ring-gold-500/20">
          <p className="text-[11px] uppercase tracking-widest2 text-bone/50">Estimated Project Cost</p>
          <p className="mt-2 font-display text-3xl font-black text-gold-300 sm:text-4xl">NPR {formatNPR(total)}</p>
          <p className="mx-auto mt-4 max-w-sm text-[11px] leading-relaxed text-bone/35">
            * This is a rough estimate based on a flat rate per sq.ft. Actual cost depends on site location, material costs
            at the time, and specific design requirements.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-block rounded-md bg-gold-400 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-ink-950 hover:bg-gold-300"
          >
            Get a Precise Quote
          </Link>
        </div>
      </div>
    </CardShell>
  );
}

function MaterialCalculator({ rates }: { rates: EstimatorRates }) {
  const [tab, setTab] = useState<"concrete" | "steel" | "bricks">("concrete");

  const [mixIndex, setMixIndex] = useState(2);
  const [length, setLength] = useState(20);
  const [width, setWidth] = useState(15);
  const [thick, setThick] = useState(0.42);

  const [wallLength, setWallLength] = useState(20);
  const [wallHeight, setWallHeight] = useState(10);
  const [wallTypeIndex, setWallTypeIndex] = useState(1);

  const [barDiameter, setBarDiameter] = useState(12);
  const [barLength, setBarLength] = useState(12);
  const [barQty, setBarQty] = useState(10);

  const concrete = useMemo(() => {
    const parts = MIX_RATIOS[mixIndex].parts;
    const sum = parts[0] + parts[1] + parts[2];
    const wetVolume = length * width * thick;
    const dryVolume = wetVolume * DRY_VOLUME_FACTOR;
    const cementCuFt = dryVolume * (parts[0] / sum);
    const sandCuFt = dryVolume * (parts[1] / sum);
    const aggCuFt = dryVolume * (parts[2] / sum);
    const cementBags = cementCuFt / CU_FT_PER_CEMENT_BAG;
    const cost = cementBags * rates.cementPerBag + sandCuFt * rates.sandPerCuFt + aggCuFt * rates.aggregatePerCuFt;
    return { cementBags, sandCuFt, aggCuFt, cost };
  }, [mixIndex, length, width, thick, rates]);

  const steel = useMemo(() => {
    const weightKg = (barDiameter * barDiameter * barLength * barQty) / 162;
    const cost = weightKg * rates.steelPerKg;
    return { weightKg, cost };
  }, [barDiameter, barLength, barQty, rates]);

  const bricks = useMemo(() => {
    const wallVolume = wallLength * wallHeight * WALL_TYPES[wallTypeIndex].thicknessFt;
    const totalBricks = wallVolume * BRICKS_PER_CU_FT;
    const mortarWet = wallVolume * MORTAR_VOLUME_FACTOR;
    const mortarDry = mortarWet * MORTAR_DRY_FACTOR;
    const [c, s] = MORTAR_MIX_RATIO;
    const cementCuFt = mortarDry * (c / (c + s));
    const sandCuFt = mortarDry * (s / (c + s));
    const cementBags = cementCuFt / CU_FT_PER_CEMENT_BAG;
    const cost = totalBricks * rates.brickPerPc + cementBags * rates.cementPerBag + sandCuFt * rates.sandPerCuFt;
    return { totalBricks, cementBags, sandCuFt, cost };
  }, [wallLength, wallHeight, wallTypeIndex, rates]);

  return (
    <CardShell>
      <StepHeader
        step={2}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="m14 2 1.5 1.5a2.12 2.12 0 0 1 0 3L5 17l-4 1 1-4L12.5 3.5a2.12 2.12 0 0 1 3 0Z" />
            <path d="M11.5 6.5 15.5 10.5" />
          </svg>
        }
        title="Detailed Material Calculator"
        subtitle="Already have drawings? Work out exact quantities for one job"
      />
      <p className="mt-4 rounded-md bg-ink-950/50 px-4 py-2.5 text-xs leading-relaxed text-bone/45">
        This calculates materials and cost for <span className="text-bone/70">one specific</span> slab, wall, or rebar
        job — not your whole house. For a whole-project ballpark, use Step 1 above.
      </p>

      <div className="mt-5 flex gap-1 rounded-full bg-ink-950/60 p-1">
        <TabButton active={tab === "concrete"} onClick={() => setTab("concrete")}>
          Concrete/Plaster
        </TabButton>
        <TabButton active={tab === "steel"} onClick={() => setTab("steel")}>
          Steel
        </TabButton>
        <TabButton active={tab === "bricks"} onClick={() => setTab("bricks")}>
          Bricks
        </TabButton>
      </div>

      {tab === "concrete" && (
        <div className="mt-6 space-y-5">
          <div>
            <label className="block text-[11px] uppercase tracking-widest2 text-bone/50">Mix Ratio</label>
            <select
              value={mixIndex}
              onChange={(e) => setMixIndex(parseInt(e.target.value))}
              className="mt-1.5 w-full rounded-md border border-white/10 bg-ink-950/70 px-3 py-2.5 text-sm text-bone outline-none focus:border-gold-400"
            >
              {MIX_RATIOS.map((m, i) => (
                <option key={m.label} value={i}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <NumberField label="Length" value={length} onChange={setLength} suffix="ft" />
            <NumberField label="Width" value={width} onChange={setWidth} suffix="ft" />
            <NumberField label="Thick" value={thick} onChange={setThick} step={0.05} suffix="ft" />
          </div>
          <div className="rounded-xl bg-ink-950/70 p-4">
            <ResultRow label="Cement (50kg bags)" value={`${Math.round(concrete.cementBags)} bags`} />
            <ResultRow label="Sand" value={`${Math.round(concrete.sandCuFt)} cu.ft`} />
            <ResultRow label="Aggregate" value={`${Math.round(concrete.aggCuFt)} cu.ft`} />
            <ResultRow label="Est. Cost" value={`Rs. ${formatNPR(concrete.cost)}`} strong />
          </div>
        </div>
      )}

      {tab === "steel" && (
        <div className="mt-6 space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <NumberField label="Diameter" value={barDiameter} onChange={setBarDiameter} suffix="mm" />
            <NumberField label="Length" value={barLength} onChange={setBarLength} step={0.5} suffix="m" />
            <NumberField label="Quantity" value={barQty} onChange={setBarQty} min={1} suffix="pcs" />
          </div>
          <p className="text-[11px] italic text-bone/35">Formula: (D&sup2; &divide; 162) &times; Length &times; Qty</p>
          <div className="rounded-xl bg-ink-950/70 p-4">
            <ResultRow label="Total Weight" value={`${steel.weightKg.toFixed(1)} kg`} />
            <ResultRow label="Est. Cost" value={`Rs. ${formatNPR(steel.cost)}`} strong />
          </div>
        </div>
      )}

      {tab === "bricks" && (
        <div className="mt-6 space-y-5">
          <div>
            <label className="block text-[11px] uppercase tracking-widest2 text-bone/50">Wall Type</label>
            <select
              value={wallTypeIndex}
              onChange={(e) => setWallTypeIndex(parseInt(e.target.value))}
              className="mt-1.5 w-full rounded-md border border-white/10 bg-ink-950/70 px-3 py-2.5 text-sm text-bone outline-none focus:border-gold-400"
            >
              {WALL_TYPES.map((w, i) => (
                <option key={w.label} value={i}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Wall Length" value={wallLength} onChange={setWallLength} suffix="ft" />
            <NumberField label="Wall Height" value={wallHeight} onChange={setWallHeight} suffix="ft" />
          </div>
          <div className="rounded-xl bg-ink-950/70 p-4">
            <ResultRow label="Total Bricks" value={`${Math.round(bricks.totalBricks).toLocaleString("en-US")} pcs`} />
            <ResultRow label="Mortar Cement" value={`${Math.round(bricks.cementBags)} bags`} />
            <ResultRow label="Mortar Sand" value={`${bricks.sandCuFt.toFixed(1)} cu.ft`} />
            <ResultRow label="Est. Cost" value={`Rs. ${formatNPR(bricks.cost)}`} strong />
          </div>
        </div>
      )}
    </CardShell>
  );
}

export function CostEstimatorTool({ rates }: { rates: EstimatorRates }) {
  return (
    <div className="flex flex-col gap-8">
      <ProjectEstimator rates={rates} />
      <div className="mx-auto flex items-center gap-3 text-bone/25">
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-500/40" />
        <svg width="14" height="14" viewBox="0 0 24 24" className="text-gold-500/60">
          <path d="M12 2 4 12l8 10 8-10Z" fill="currentColor" />
        </svg>
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-500/40" />
      </div>
      <MaterialCalculator rates={rates} />
    </div>
  );
}
