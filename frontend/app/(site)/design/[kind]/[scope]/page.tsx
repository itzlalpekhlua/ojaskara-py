import Link from "next/link";
import { notFound } from "next/navigation";
import { apiGet } from "@/lib/api";
import type { DesignWork } from "@/lib/types";
import { GoldLabel } from "@/components/ui/GoldLabel";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { Reveal } from "@/components/ui/Reveal";
import { PhotoSlideshow } from "@/components/ui/PhotoSlideshow";

const kindTitles: Record<string, string> = { interior: "Interior Design", exterior: "Exterior Design" };
const scopeTitles: Record<string, string> = { residential: "Residential", commercial: "Commercial" };

export default async function DesignScopePage({
  params,
}: {
  params: Promise<{ kind: string; scope: string }>;
}) {
  const { kind, scope } = await params;
  if (!kindTitles[kind] || !scopeTitles[scope]) notFound();

  const all = await apiGet<DesignWork[]>("/api/design-works");
  const items = all
    .filter((w) => w.published && w.kind === kind && w.scope === scope)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="relative overflow-hidden bg-ink-950 pt-32 pb-28">
      <AmbientGlow />
      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-10">
        <Reveal>
          <GoldLabel>
            <Link href={`/design/${kind}`} className="hover:text-gold-200">{kindTitles[kind]}</Link>
          </GoldLabel>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-4 font-display text-5xl font-bold text-gold-3d sm:text-6xl md:text-7xl">
            {scopeTitles[scope]} {kindTitles[kind]}
          </h1>
        </Reveal>
      </div>

      <div className="relative mx-auto mt-20 max-w-7xl px-6 md:px-10">
        {items.length === 0 ? (
          <p className="text-center text-sm text-bone/30">[FILL: Designs coming soon]</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((d, i) => {
              const galleryUrls = [...d.images].sort((a, b) => a.order - b.order).map((img) => img.url);
              const slides = d.featuredImage && !galleryUrls.includes(d.featuredImage)
                ? [d.featuredImage, ...galleryUrls]
                : galleryUrls.length
                ? galleryUrls
                : d.featuredImage
                ? [d.featuredImage]
                : [];
              return (
                <Reveal key={d.id} delay={i * 0.08}>
                  <Link href={`/design/${kind}/${scope}/${d.slug}`} className="group block border border-gold-700/25">
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink-900">
                      {slides.length > 0 ? (
                        <PhotoSlideshow
                          images={slides}
                          alt={d.title}
                          sizes="(max-width: 768px) 100vw, 33vw"
                          imgClassName="object-contain transition-transform duration-[1200ms] ease-luxe group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-bone/30">[FILL: Image]</div>
                      )}
                    </div>
                    <div className="p-5">
                      {d.roomType && d.roomType.toLowerCase() !== d.title.toLowerCase() && (
                        <p className="text-[10px] uppercase tracking-widest2 text-emerald-400/80">{d.roomType}</p>
                      )}
                      <h3 className="mt-1 font-display text-xl text-bone transition-colors group-hover:text-gold-200">{d.title}</h3>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
