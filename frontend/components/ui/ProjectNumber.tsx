export function ProjectNumber({ n }: { n: number | string }) {
  const label = typeof n === "number" ? String(n).padStart(2, "0") : n;
  return (
    <span className="font-display text-gold-3d text-sm tracking-widest2">
      {label}
    </span>
  );
}
