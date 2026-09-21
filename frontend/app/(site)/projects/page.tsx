import Link from "next/link";
import { apiGet } from "@/lib/api";
import type { Project } from "@/lib/types";
import { GoldLabel } from "@/components/ui/GoldLabel";
import { Reveal } from "@/components/ui/Reveal";
import { PhotoSlideshow } from "@/components/ui/PhotoSlideshow";

export default async function ProjectsPage() {
  const all = await apiGet<Project[]>("/api/projects");
  const projects = all.filter((p) => p.published).sort((a, b) => a.order - b.order);

  return (
    <div className="bg-ink-950 pt-32 pb-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <GoldLabel>Our Portfolio</GoldLabel>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-4 font-display text-5xl font-bold text-gold-3d sm:text-6xl md:text-7xl">Projects</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-xl text-base text-bone/60 sm:text-lg">
            A look at the homes and buildings we&rsquo;ve designed and built.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.length === 0 && <p className="text-bone/40">[FILL: Projects coming soon]</p>}
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
              <Reveal key={p.id} delay={i * 0.06}>
                <Link href={`/projects/${p.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]">
                    {slides.length > 0 ? (
                      <PhotoSlideshow
                        images={slides}
                        alt={p.title}
                        speed={1.5}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        imgClassName="object-contain transition-transform duration-[1200ms] ease-luxe group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-bone/30 text-xs">[FILL]</div>
                    )}
                  </div>
                  <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-widest2 text-gold-300">
                    <span>{p.category || "[FILL: Category]"}</span>
                    {p.location && (
                      <span className="flex items-center gap-1.5 text-emerald-400/90">
                        <span className="h-1 w-1 rotate-45 border border-emerald-400" />
                        {p.location}
                      </span>
                    )}
                  </p>
                  <h2 className="mt-2 font-display text-2xl text-bone transition-colors group-hover:text-gold-100">
                    {p.title}
                  </h2>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
