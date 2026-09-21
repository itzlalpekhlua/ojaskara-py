import Link from "next/link";
import { notFound } from "next/navigation";
import { apiGetOrNull, apiGet } from "@/lib/api";
import type { ConstructionProject } from "@/lib/types";
import { GoldLabel } from "@/components/ui/GoldLabel";
import { DiamondDivider } from "@/components/ui/DiamondDivider";
import { ImageGallery } from "@/components/ImageGallery";
import { Reveal } from "@/components/ui/Reveal";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await apiGetOrNull<ConstructionProject>(`/api/construction-projects/slug/${slug}`);
  if (!project || !project.published) notFound();

  const all = await apiGet<ConstructionProject[]>("/api/construction-projects");
  const related = all
    .filter((p) => p.published && p.id !== project.id)
    .sort((a, b) => a.order - b.order)
    .slice(0, 3);

  const images = [...project.images].sort((a, b) => a.order - b.order);
  const galleryMedia = images.map((i) => ({
    url: i.url,
    type: (i.mediaType === "video" ? "video" : "image") as "image" | "video",
  }));
  const media =
    project.featuredImage && !galleryMedia.some((m) => m.url === project.featuredImage)
      ? [{ url: project.featuredImage, type: "image" as const }, ...galleryMedia]
      : galleryMedia;

  return (
    <div className="bg-ink-950 pt-32 pb-28">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <Reveal>
          <h1 className="font-display text-4xl text-gold-3d sm:text-5xl md:text-6xl">{project.title}</h1>
        </Reveal>
        <Reveal delay={0.1}>
          <GoldLabel className="mt-4 text-xs">{project.categoryLabel || "[FILL: Category]"}</GoldLabel>
        </Reveal>
        {project.location && (
          <Reveal delay={0.12}>
            <p className="mt-4 flex items-center gap-2 text-sm uppercase tracking-widest2 text-emerald-400/90">
              <span className="h-1.5 w-1.5 rotate-45 border border-emerald-400" />
              {project.location}
            </p>
          </Reveal>
        )}
        <Reveal delay={0.15}>
          <DiamondDivider align="start" className="my-10 max-w-xs" />
        </Reveal>

        <Reveal delay={0.2}>
          <ImageGallery items={media} alt={project.title} />
        </Reveal>

        {related.length > 0 && (
          <div className="mt-24">
            <p className="text-[11px] uppercase tracking-widest2 text-gold-300 mb-6">Related Projects</p>
            <div className="flex flex-wrap gap-6">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/construction-projects/${r.slug}`}
                  className="text-sm text-bone/60 hover:text-gold-200 border-b border-gold-700/30 pb-1 transition-colors"
                >
                  {r.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
