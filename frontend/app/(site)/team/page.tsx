import Image from "next/image";
import { apiGet } from "@/lib/api";
import type { TeamMember } from "@/lib/types";
import { GoldLabel } from "@/components/ui/GoldLabel";
import { Reveal } from "@/components/ui/Reveal";
import { DiamondCorner } from "@/components/ui/DiamondCorner";

export default async function TeamPage() {
  const all = await apiGet<TeamMember[]>("/api/team");
  const members = all.filter((m) => m.published).sort((a, b) => a.order - b.order);

  return (
    <div className="bg-ink-950 pt-32 pb-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <GoldLabel>The People Behind Ojaskaraa</GoldLabel>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-4 font-display text-5xl font-bold text-gold-3d sm:text-6xl md:text-7xl">Our Team</h1>
        </Reveal>

        <div className="mt-20 flex flex-col gap-12">
          {members.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.1}>
              <div className="relative grid grid-cols-1 gap-10 border border-gold-700/20 bg-ink-900/40 p-8 sm:grid-cols-[280px_1fr] sm:p-12">
                <DiamondCorner position="top-left" />
                <DiamondCorner position="bottom-right" />
                <div className="relative mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden border border-gold-700/20 bg-ink-800">
                  {m.image ? (
                    <Image src={m.image} alt={m.name} fill sizes="280px" className="object-contain" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-bone/30">[FILL: Photo]</div>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <span className="font-display text-6xl text-gold-metal leading-none">&ldquo;</span>
                  <p className="mt-2 max-w-2xl text-lg leading-relaxed text-bone/70 sm:text-xl">
                    {m.description || "[FILL: Additional information]"}
                  </p>
                  <p className="mt-6 font-display text-2xl text-bone">{m.name}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-widest2 text-gold-300">{m.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
