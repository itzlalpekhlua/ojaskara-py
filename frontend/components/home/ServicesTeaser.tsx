import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { AmbientGlow } from "@/components/ui/AmbientGlow";

export type ServiceCard = {
  id: string;
  title: string;
  image: string | null;
};

export function ServicesTeaser({ services }: { services: ServiceCard[] }) {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-24 md:py-32">
      <AmbientGlow variant="reverse" />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeading eyebrow="The Journey" title="Our Approach" align="center" className="mx-auto items-center text-center" />

        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent md:block" />
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {services.slice(0, 4).map((s, i) => (
              <Reveal key={s.id} delay={i * 0.1} className="relative">
                <Link href="/services" className="group block">
                  <div className="relative aspect-square w-full overflow-hidden border border-gold-700/25 bg-ink-900">
                    {s.image ? (
                      <Image
                        src={s.image}
                        alt={s.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-contain transition-transform duration-[1200ms] ease-luxe group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-bone/30">[FILL]</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
                    <div className="absolute left-1/2 top-1/2 z-10 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-ink-950 md:flex">
                      <svg width="36" height="36" viewBox="0 0 36 36" className="absolute">
                        <rect x="7" y="7" width="22" height="22" transform="rotate(45 18 18)" fill="none" stroke="#eabe3a" strokeWidth="1" />
                      </svg>
                      <span className="relative font-display text-xs text-gold-3d">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <p className="absolute bottom-4 left-4 right-4 font-display text-lg text-bone md:hidden">{s.title}</p>
                  </div>
                  <p className="mt-4 hidden text-center font-display text-lg text-bone group-hover:text-gold-200 transition-colors md:block">
                    {s.title}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.2} className="mt-16 flex justify-center">
          <Button href="/services" variant="outline">
            View Full Process
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
