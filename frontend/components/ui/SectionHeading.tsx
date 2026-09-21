import { GoldLabel } from "./GoldLabel";
import { GoldSpark } from "./GoldSpark";

export function SectionHeading({
  eyebrow,
  title,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={`${align === "center" ? "text-center items-center" : "items-start"} flex flex-col gap-5 ${className}`}>
      {eyebrow && <GoldLabel>{eyebrow}</GoldLabel>}
      <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight">
        <GoldSpark className="text-gold-3d">{title}</GoldSpark>
      </h2>
    </div>
  );
}
