import Image from "next/image";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import type { DesignWork } from "@/lib/types";
import { GoldLabel } from "@/components/ui/GoldLabel";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { Reveal } from "@/components/ui/Reveal";

export default async function DesignOverviewPage() {
  const all = await apiGet<DesignWork[]>("/api/design-works");
  const published = all.filter((w) => w.published).sort((a, b) => a.order - b.order);
  const interior = published.find((w) => w.kind === "interior");
  const exterior = published.find((w) => w.kind === "exterior");

  const kinds = [
    {
      slug: "interior",
      title: "Interior Design",
      description: "Modular kitchens, living rooms, and bedrooms — crafted for how you actually live.",
      image: interior?.featuredImage ?? null,
    },
    {
      slug: "exterior",
      title: "Exterior Design",
      description: "The first impression — facades, materials, and massing that define a building's presence.",
      image: exterior?.featuredImage ?? null,
    },
  ];

  return (
    <div className="relative overflow-hidden bg-ink-950 pt-32 pb-28">
      <AmbientGlow />
      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-10">
        <Reveal>
          <GoldLabel>Design That Inspires</GoldLabel>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-4 font-display text-5xl font-bold text-gold-3d sm:text-6xl md:text-7xl">Our Design</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-8 max-w-xl text-base text-bone/60 sm:text-lg">
            Every space we design — inside and out, residential and commercial.
          </p>
        </Reveal>
      </div>

      <div className="relative mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-6 px-6 sm:grid-cols-2 md:px-10">
        {kinds.map((k, i) => (
          <Reveal key={k.slug} delay={i * 0.1}>
            <Link href={`/design/${k.slug}`} className="group relative block aspect-[4/5] overflow-hidden border border-gold-700/25 bg-ink-900">
              {k.image ? (
                <Image src={k.image} alt={k.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain transition-transform duration-[1200ms] ease-luxe group-hover:scale-105" />
              ) : (
                <div className="flex h-full items-center justify-center text-bone/30">[FILL: Image]</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <h2 className="font-display text-3xl text-bone md:text-4xl">{k.title}</h2>
                <p className="mt-2 max-w-sm text-sm text-bone/60">{k.description}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
