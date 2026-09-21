import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DiamondCorner } from "@/components/ui/DiamondCorner";

export type MediaFeatureData = {
  id: string;
  title: string;
  outlet: string;
  type: string;
  url: string;
  thumbnail: string | null;
};

const typeLabel: Record<string, string> = {
  article: "Article",
  podcast: "Podcast",
  interview: "Interview",
  tv: "TV Feature",
};

export function MediaCoverage({ features }: { features: MediaFeatureData[] }) {
  if (features.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-ink-950 py-24 md:py-32">
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="As Seen In"
            title="Media Coverage"
            align="center"
            className="mx-auto items-center text-center"
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.id} delay={i * 0.08}>
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden border border-gold-700/20 bg-ink-900/40"
              >
                <DiamondCorner position="top-left" />
                <DiamondCorner position="bottom-right" />
                <div className="relative aspect-video w-full overflow-hidden bg-ink-900">
                  {f.thumbnail ? (
                    <Image
                      src={f.thumbnail}
                      alt={f.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-contain transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-ink-800 text-xs text-bone/30">[FILL]</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-ink-950/70 px-3 py-1 text-[10px] uppercase tracking-widest2 text-gold-300 backdrop-blur-sm">
                    {typeLabel[f.type] ?? f.type}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-widest2 text-gold-300">{f.outlet}</p>
                  <h3 className="mt-2 font-display text-xl text-bone transition-colors group-hover:text-gold-100">
                    {f.title}
                  </h3>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
