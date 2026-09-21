import { Reveal } from "@/components/ui/Reveal";

const items = [
  {
    title: "Residential Building",
    body: "Modern homes for a better life.",
    icon: (
      <path d="M4 21V10.5L14 3l10 7.5V21h-7v-7h-6v7H4Z" />
    ),
  },
  {
    title: "Commercial Building",
    body: "Spaces for your business growth.",
    icon: (
      <path d="M6 21V6l6-3 6 3v15M6 21h12M6 21H3M18 21h3M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h.01M15 17h.01" />
    ),
  },
  {
    title: "Architectural Design",
    body: "Creative designs that inspire.",
    icon: (
      <path d="M4 20 20 4M8 20l10-10M4 12l8-8M15 20l5-5M4 16l4-4" />
    ),
  },
  {
    title: "Full Contract Construction",
    body: "We handle everything from start to finish.",
    icon: (
      <path d="M9 12l2 2 4-4M5 6h14v14H5V6ZM9 6V4h6v2" />
    ),
  },
  {
    title: "Quality Work On Time",
    body: "Your trust, our responsibility.",
    icon: <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 7v5l3 3" />,
  },
];

const ringColors = ["#eabe3a", "#166049", "#4f2980", "#eabe3a", "#166049"];

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden border-y border-gold-700/15 bg-ink-900 py-20 md:py-24">
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{ background: "linear-gradient(120deg, #4f2980 0%, transparent 35%, transparent 65%, #166049 100%)" }}
      />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-3 md:gap-y-0">
          <Reveal className="flex flex-col justify-center gap-4 md:p-10 md:pl-0">
            <h2 className="flex items-center gap-4 font-display text-3xl font-light leading-tight text-gold-3d sm:text-4xl">
              <span className="h-px w-10 shrink-0 bg-gold-400" />
              Our Services
            </h2>
            <p className="text-sm leading-relaxed text-bone/50">
              Every project follows the same disciplined process — from first sketch to final handover — so quality
              never depends on luck.
            </p>
          </Reveal>

          {items.map((item, i) => {
            const slot = i + 1;
            const row = Math.floor(slot / 3);
            const col = slot % 3;
            const dividers = `${row > 0 ? "md:border-t" : ""} ${col > 0 ? "md:border-l" : ""}`;

            return (
              <Reveal
                key={item.title}
                delay={i * 0.08}
                className={`flex flex-col items-center gap-4 border-gold-700/15 py-4 text-center md:items-start md:p-10 md:text-left ${dividers}`}
              >
                <span className="relative flex h-16 w-16 items-center justify-center">
                  <svg width="64" height="64" viewBox="0 0 64 64" className="absolute inset-0">
                    <rect
                      x="14"
                      y="14"
                      width="36"
                      height="36"
                      transform="rotate(45 32 32)"
                      fill="none"
                      stroke={ringColors[i % ringColors.length]}
                      strokeWidth="1"
                      opacity="0.8"
                    />
                  </svg>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f3d266" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="relative">
                    {item.icon}
                  </svg>
                </span>
                <p className="font-display text-base text-bone sm:text-lg">{item.title}</p>
                <p className="text-xs text-bone/50 sm:text-sm">{item.body}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
