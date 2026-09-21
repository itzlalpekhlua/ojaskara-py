import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const points = [
  {
    title: "One Company, Complete Solution",
    body: "From design to handover, one accountable team manages your entire project — no juggling separate contractors.",
  },
  {
    title: "Transparent Costing",
    body: "Clear, itemized estimates before we begin building. No hidden costs, no surprises at the end.",
  },
  {
    title: "Professional Supervision",
    body: "Qualified engineers and site supervisors on every project, every day — not just at milestones.",
  },
  {
    title: "Quality Materials",
    body: "We use certified, tested materials chosen for durability, not just the lowest price.",
  },
  {
    title: "Modern Design",
    body: "Contemporary architecture and interiors that stay beautiful and functional for decades.",
  },
  {
    title: "Timely Execution",
    body: "Realistic timelines, tracked and communicated, so your project keeps moving on schedule.",
  },
  {
    title: "After-Sales Support",
    body: "Our relationship doesn't end at handover — we stand behind our work long after you move in.",
  },
  {
    title: "Skilled & Experienced Team",
    body: "13+ years of hands-on experience — qualified engineers, architects and craftsmen behind every build.",
  },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#f3d266" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function WhyChooseOjaskaraa() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.25]"
        style={{ background: "radial-gradient(circle at 15% 20%, #eabe3a 0%, transparent 40%), radial-gradient(circle at 85% 80%, #166049 0%, transparent 40%)" }}
      />
      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="The Ojaskaraa Promise"
            title="Why Choose Ojaskaraa"
            align="center"
            className="mx-auto items-center text-center"
          />
        </Reveal>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06} className="flex items-start gap-4">
              <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-700/40 bg-ink-950/60">
                <CheckIcon />
              </span>
              <div>
                <p className="font-display text-lg text-bone">{p.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-bone/50">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
