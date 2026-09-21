export function DiamondDivider({
  className = "",
  align = "center",
}: {
  className?: string;
  align?: "center" | "start";
}) {
  return (
    <div
      className={`flex items-center gap-3 ${align === "start" ? "justify-start" : "justify-center"} ${className}`}
      aria-hidden="true"
    >
      <span className="h-1 w-1 rotate-45 border border-purple-400/70 shrink-0" />
      <span className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-gold-400/70" />
      <svg width="16" height="16" viewBox="0 0 16 16" className="shrink-0">
        <rect
          x="1.5"
          y="1.5"
          width="13"
          height="13"
          transform="rotate(45 8 8)"
          fill="none"
          stroke="#eabe3a"
          strokeWidth="1.1"
        />
        <rect x="6" y="6" width="4" height="4" transform="rotate(45 8 8)" fill="#eabe3a" opacity="0.6" />
      </svg>
      <span className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-gold-400/70" />
      <span className="h-1 w-1 rotate-45 border border-emerald-400/70 shrink-0" />
    </div>
  );
}
