import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className}>
      <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.9l-5.2 2.61.99-5.79-4.21-4.1 5.82-.85z" />
    </svg>
  );
}

type Stat = {
  value: React.ReactNode;
  label: string;
};

export function About({
  title,
  body,
  projectsCompleted,
  yearsInBusiness,
}: {
  title?: string | null;
  body?: string | null;
  projectsCompleted: number;
  yearsInBusiness: number;
}) {
  if (!title && !body) return null;

  const stats: Stat[] = [
    { value: `${yearsInBusiness}+`, label: "Years of Experience" },
    { value: `${projectsCompleted}+`, label: "Projects Delivered" },
    {
      value: (
        <span className="flex items-center justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-7 w-7 fill-gold-400 sm:h-8 sm:w-8" />
          ))}
        </span>
      ),
      label: "Outstanding Client Reviews",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-ink-950 py-24 md:py-32">
      <div className="relative mx-auto max-w-5xl px-6 text-center md:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Who We Are"
            title={title ?? ""}
            align="center"
            className="mx-auto items-center text-center"
          />
        </Reveal>

        {body && (
          <Reveal delay={0.1}>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-bone/60 sm:text-lg">{body}</p>
          </Reveal>
        )}

        <Reveal delay={0.2}>
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-y-0">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col items-center gap-2 ${i > 0 ? "sm:border-l sm:border-gold-700/20" : ""}`}
              >
                <span className="font-display text-4xl font-bold text-gold-3d sm:text-5xl">{s.value}</span>
                <span className="text-[11px] uppercase tracking-widest2 text-bone/50 sm:text-xs">{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
