import Link from "next/link";
import { notFound } from "next/navigation";
import { apiGet } from "@/lib/api";
import type { DesignWork } from "@/lib/types";
import { GoldLabel } from "@/components/ui/GoldLabel";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { Reveal } from "@/components/ui/Reveal";
import { PhotoSlideshow } from "@/components/ui/PhotoSlideshow";

const titles: Record<string, string> = {
  interior: "Interior Design",
  exterior: "Exterior Design",
};

export default async function DesignKindPage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!titles[kind]) notFound();

  const all = await apiGet<DesignWork[]>("/api/design-works");
  const inKind = all.filter((w) => w.published && w.kind === kind);
  const byScope = (scope: string) => inKind.filter((w) => w.scope === scope).sort((a, b) => a.order - b.order);

  const scopes = [
    { slug: "residential", label: "Residential Building", items: byScope("residential") },
    { slug: "commercial", label: "Commercial Building", items: byScope("commercial") },
  ];

  return (
    <div className="relative overflow-hidden bg-ink-950 pt-32 pb-28">
      <AmbientGlow variant="reverse" />
      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-10">
        <Reveal>
          <GoldLabel>Our Design</GoldLabel>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-4 font-display text-5xl font-bold text-gold-3d sm:text-6xl md:text-7xl">{titles[kind]}</h1>
        </Reveal>
      </div>

      <div className="relative mx-auto mt-20 max-w-7xl px-6 md:px-10">
        {scopes.map((s, si) => (
          <div key={s.slug} className="mb-24 last:mb-0">
            <Reveal delay={si * 0.1} className="mb-8 flex items-baseline gap-4">
              <span className="h-px w-10 bg-gold-400" />
              <Link href={`/design/${kind}/${s.slug}`} className="font-display text-2xl text-bone hover:text-gold-200 md:text-3xl">
                {s.label}
              </Link>
            </Reveal>
            {s.items.length === 0 ? (
              <p className="text-sm text-bone/30">[FILL: Designs coming soon]</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {s.items.map((d, i) => {
                  const galleryUrls = [...d.images].sort((a, b) => a.order - b.order).map((img) => img.url);
                  const slides = d.featuredImage && !galleryUrls.includes(d.featuredImage)
                    ? [d.featuredImage, ...galleryUrls]
                    : galleryUrls.length
                    ? galleryUrls
                    : d.featuredImage
                    ? [d.featuredImage]
                    : [];
                  return (
                    <Reveal key={d.id} delay={i * 0.06}>
                      <Link href={`/design/${kind}/${s.slug}/${d.slug}`} className="group block border border-gold-700/25">
                        <div className="relative aspect-square w-full overflow-hidden bg-ink-900">
                          {slides.length > 0 ? (
                            <PhotoSlideshow
                              images={slides}
                              alt={d.title}
                              sizes="(max-width: 768px) 50vw, 25vw"
                              imgClassName="object-contain transition-transform duration-[1200ms] ease-luxe group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-bone/30">[FILL]</div>
                          )}
                        </div>
                        <div className="p-4">
                          {d.roomType && d.roomType.toLowerCase() !== d.title.toLowerCase() && (
                            <p className="text-[10px] uppercase tracking-widest2 text-emerald-400/80">{d.roomType}</p>
                          )}
                          <h3 className="mt-1 font-display text-lg text-bone transition-colors group-hover:text-gold-200">{d.title}</h3>
                        </div>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
