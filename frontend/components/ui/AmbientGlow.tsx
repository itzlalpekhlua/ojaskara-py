export function AmbientGlow({ variant = "default" }: { variant?: "default" | "reverse" }) {
  const a = variant === "reverse" ? "right-[-10%]" : "left-[-10%]";
  const b = variant === "reverse" ? "left-[-15%]" : "right-[-15%]";
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className={`absolute top-[-10%] ${a} h-[620px] w-[620px] rounded-full opacity-40 blur-[100px]`}
        style={{ background: "radial-gradient(circle, #4f2980 0%, transparent 68%)" }}
      />
      <div
        className={`absolute bottom-[-15%] ${b} h-[580px] w-[580px] rounded-full opacity-[0.38] blur-[100px]`}
        style={{ background: "radial-gradient(circle, #166049 0%, transparent 68%)" }}
      />
      <div
        className="absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-[0.12] blur-[120px]"
        style={{ background: "radial-gradient(circle, #eabe3a 0%, transparent 70%)" }}
      />
    </div>
  );
}
