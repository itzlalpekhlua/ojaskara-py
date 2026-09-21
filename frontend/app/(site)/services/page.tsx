import { apiGet } from "@/lib/api";
import type { Service } from "@/lib/types";
import { GoldLabel } from "@/components/ui/GoldLabel";
import { Reveal } from "@/components/ui/Reveal";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { ServicesFlow } from "@/components/ServicesFlow";

export default async function ServicesPage() {
  const all = await apiGet<Service[]>("/api/services");
  const services = all
    .filter((s) => s.published && !s.parentId)
    .sort((a, b) => a.order - b.order)
    .map((s) => ({
      ...s,
      // Matches the original Prisma query: children aren't filtered by
      // `published` here, only the top-level services are.
      children: all.filter((c) => c.parentId === s.id).sort((a, b) => a.order - b.order),
    }));

  return (
    <div className="relative overflow-hidden bg-ink-950 pt-32 pb-28">
      <AmbientGlow />
      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-10">
        <Reveal>
          <h1>
            <GoldLabel
              className="text-2xl leading-tight sm:text-3xl md:text-4xl"
              align="start"
              tracking="tracking-[0.21em]"
            >
              The Journey Towards Your Dream Home
            </GoldLabel>
          </h1>
        </Reveal>
      </div>

      <div className="relative mx-auto mt-28 max-w-5xl px-6 md:px-10">
        <ServicesFlow
          services={services.map((s) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            image: s.image,
            mediaType: s.mediaType,
            children: s.children.map((c) => ({
              id: c.id,
              title: c.title,
              description: c.description,
              image: c.image,
              mediaType: c.mediaType,
            })),
          }))}
        />
      </div>
    </div>
  );
}
