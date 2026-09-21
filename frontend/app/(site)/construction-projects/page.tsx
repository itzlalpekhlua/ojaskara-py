import Link from "next/link";
import { apiGet } from "@/lib/api";
import type { ConstructionProject } from "@/lib/types";
import { GoldLabel } from "@/components/ui/GoldLabel";
import { ProjectNumber } from "@/components/ui/ProjectNumber";
import { Reveal } from "@/components/ui/Reveal";
import { PhotoSlideshow } from "@/components/ui/PhotoSlideshow";

export default async function ConstructionProjectsPage() {
  const all = await apiGet<ConstructionProject[]>("/api/construction-projects");
  const projects = all.filter((p) => p.published).sort((a, b) => a.order - b.order);

  return (
    <div className="bg-ink-950 pt-32 pb-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <GoldLabel>Case Studies</GoldLabel>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-4 font-display text-5xl font-bold text-gold-3d sm:text-6xl md:text-7xl">Construction Projects</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-xl text-base text-bone/60 sm:text-lg">
            Real, completed work — actual sites, actual locations, with photos and videos from the ground.
          </p>
        </Reveal>

        <div className="mt-20 flex flex-col">
          {projects.length === 0 && <p className="text-bone/40">[FILL: Construction projects coming soon]</p>}
          {projects.map((p, i) => {
            const galleryUrls = p.images.filter((img) => img.mediaType === "image").sort((a, b) => a.order - b.order).map((img) => img.url);
            const slides = p.featuredImage && !galleryUrls.includes(p.featuredImage)
              ? [p.featuredImage, ...galleryUrls]
              : galleryUrls.length
              ? galleryUrls
              : p.featuredImage
              ? [p.featuredImage]
              : [];

            return (
              <Reveal key={p.id} delay={i * 0.08}>
                <Link
                  href={`/construction-projects/${p.slug}`}
                  className="group grid grid-cols-1 items-center gap-8 border-t border-gold-700/15 py-10 sm:grid-cols-12"
                >
                  <div className="sm:col-span-1">
                    <ProjectNumber n={i + 1} />
                  </div>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-ink-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] sm:col-span-5">
                    {slides.length > 0 ? (
                      <PhotoSlideshow
                        images={slides}
                        alt={p.title}
                        speed={1.5}
                        sizes="(max-width: 768px) 100vw, 40vw"
                        imgClassName="object-contain transition-transform duration-[1200ms] ease-luxe group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-bone/30 text-xs">[FILL]</div>
                    )}
                  </div>
                  <div className="sm:col-span-6">
                    <h2 className="font-display text-3xl text-bone transition-colors group-hover:text-gold-100 md:text-4xl">
                      {p.title}
                    </h2>
                    <p className="mt-3 text-[11px] uppercase tracking-widest2 text-gold-300">
                      {p.categoryLabel || "[FILL: Category]"}
                    </p>
                    {p.location && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-[11px] uppercase tracking-widest2 text-emerald-400/90">
                        <span className="h-1 w-1 rotate-45 border border-emerald-400" />
                        {p.location}
                      </p>
                    )}
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
