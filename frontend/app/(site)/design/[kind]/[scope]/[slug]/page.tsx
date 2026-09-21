import Link from "next/link";
import { notFound } from "next/navigation";
import { apiGet } from "@/lib/api";
import type { DesignWork } from "@/lib/types";
import { GoldLabel } from "@/components/ui/GoldLabel";
import { DiamondDivider } from "@/components/ui/DiamondDivider";
import { ImageGallery } from "@/components/ImageGallery";
import { Reveal } from "@/components/ui/Reveal";

const kindTitles: Record<string, string> = { interior: "Interior Design", exterior: "Exterior Design" };
const scopeTitles: Record<string, string> = { residential: "Residential", commercial: "Commercial" };

export default async function DesignDetailPage({
  params,
}: {
  params: Promise<{ kind: string; scope: string; slug: string }>;
}) {
  const { kind, scope, slug } = await params;
  if (!kindTitles[kind] || !scopeTitles[scope]) notFound();

  const all = await apiGet<DesignWork[]>("/api/design-works");
  const design = all.find((w) => w.slug === slug && w.kind === kind && w.scope === scope);
  if (!design || !design.published) notFound();

  const related = all
    .filter((w) => w.kind === kind && w.scope === scope && w.published && w.id !== design.id)
    .sort((a, b) => a.order - b.order)
    .slice(0, 4);

  const galleryUrls = [...design.images].sort((a, b) => a.order - b.order).map((i) => i.url);
  const images = (
    design.featuredImage && !galleryUrls.includes(design.featuredImage)
      ? [design.featuredImage, ...galleryUrls]
      : galleryUrls
  ).map((url) => ({ url }));

  return (
    <div className="bg-ink-950 pt-32 pb-28">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <Reveal>
          <GoldLabel>
            {kindTitles[kind]} / {scopeTitles[scope]}
            {design.roomType ? ` / ${design.roomType}` : ""}
          </GoldLabel>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-4 font-display text-4xl text-gold-3d sm:text-5xl md:text-6xl">{design.title}</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <DiamondDivider align="start" className="my-10 max-w-xs" />
        </Reveal>

        <Reveal delay={0.2}>
          <ImageGallery items={images} alt={design.title} />
        </Reveal>

        <Reveal delay={0.25} className="mt-14 max-w-2xl">
          <p className="text-base leading-relaxed text-bone/60 sm:text-lg">
            {design.description || "[FILL: Design description]"}
          </p>
        </Reveal>

        {related.length > 0 && (
          <div className="mt-24">
            <p className="text-[11px] uppercase tracking-widest2 text-gold-300 mb-6">Related Designs</p>
            <div className="flex flex-wrap gap-6">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/design/${kind}/${scope}/${r.slug}`}
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
