import Image from "next/image";
import { apiGet } from "@/lib/api";
import type { Testimonial } from "@/lib/types";
import { GoldLabel } from "@/components/ui/GoldLabel";
import { Reveal } from "@/components/ui/Reveal";
import { TestimonialCard } from "@/components/TestimonialCard";
import { GoogleRatingBadge } from "@/components/ui/GoogleRatingBadge";

export default async function TestimonialsPage() {
  const all = (await apiGet<Testimonial[]>("/api/testimonials"))
    .filter((t) => t.published)
    .sort((a, b) => a.order - b.order);

  const videos = all.filter((t) => t.kind === "video");
  const reviews = all.filter((t) => t.kind !== "photo" && t.kind !== "video");
  const moments = all.filter((t) => t.kind === "photo");

  return (
    <div className="bg-ink-950 pt-32 pb-28">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <GoldLabel>In Their Words</GoldLabel>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-4 font-display text-5xl font-bold text-gold-3d sm:text-6xl md:text-7xl">Testimonials</h1>
        </Reveal>

        <Reveal delay={0.15} className="mt-8">
          <GoogleRatingBadge />
        </Reveal>

        {videos.length > 0 && (
          <div className={`mt-20 grid grid-cols-1 gap-10 ${videos.length > 1 ? "md:grid-cols-2" : "mx-auto max-w-md"}`}>
            {videos.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.08}>
                <TestimonialCard t={t} />
              </Reveal>
            ))}
          </div>
        )}

        <div className={`${videos.length > 0 ? "mt-16" : "mt-20"} grid grid-cols-1 gap-10 md:grid-cols-2`}>
          {reviews.length === 0 && <p className="text-bone/40">[FILL: Testimonials coming soon]</p>}
          {reviews.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08}>
              <TestimonialCard t={t} />
            </Reveal>
          ))}
        </div>

        {moments.length > 0 && (
          <div className="mt-32">
            <Reveal>
              <GoldLabel>Real Moments</GoldLabel>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-4 font-display text-4xl font-bold text-gold-3d sm:text-5xl">Moments</h2>
            </Reveal>

            <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {moments.map((m, i) => (
                <Reveal key={m.id} delay={i * 0.06}>
                  <div className="group relative aspect-square w-full overflow-hidden rounded-lg border border-gold-700/25 bg-ink-900">
                    {m.thumbnail ? (
                      <Image
                        src={m.thumbnail}
                        alt={m.customerName}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-contain transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-bone/30">[FILL]</div>
                    )}
                    {m.customerName && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/90 to-transparent p-3">
                        <p className="text-xs text-bone/80">{m.customerName}</p>
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
