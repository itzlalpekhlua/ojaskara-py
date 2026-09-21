export function GoldLabel({
  children,
  className = "text-xs",
  align = "center",
  tracking = "tracking-widest2",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "center" | "start";
  tracking?: string;
}) {
  return (
    <span
      className={`inline-flex ${align === "start" ? "items-start" : "items-center"} gap-3 uppercase ${tracking} text-gold-300 font-sans ${className}`}
    >
      <span className={`h-px w-8 shrink-0 bg-gradient-to-r from-transparent via-gold-400 to-transparent ${align === "start" ? "mt-[0.6em]" : ""}`} />
      <span className={`h-1.5 w-1.5 shrink-0 rotate-45 border border-gold-400 ${align === "start" ? "mt-[0.55em]" : ""}`} />
      {children}
    </span>
  );
}
