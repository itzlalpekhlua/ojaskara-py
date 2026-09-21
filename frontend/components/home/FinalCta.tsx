import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { GoldLabel } from "@/components/ui/GoldLabel";
import { Button } from "@/components/ui/Button";
import { FloatingDiamonds } from "@/components/ui/FloatingDiamonds";
import { DiamondDivider } from "@/components/ui/DiamondDivider";

export function FinalCta({
  title,
  body,
  phone,
}: {
  title: string | null;
  body: string | null;
  phone?: string | null;
}) {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-ink-950 py-28">
      <Image
        src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1800&q=80"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/80 to-purple-950/60" />
      <FloatingDiamonds />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center md:px-10">
        <Reveal>
          <GoldLabel>Get In Touch</GoldLabel>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 font-display text-4xl font-semibold text-gold-3d sm:text-5xl md:text-6xl">
            {title || "Begin Your Legacy"}
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <DiamondDivider className="my-6 mx-auto max-w-xs" />
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-2 text-base text-bone/60 sm:text-lg">
            {body || "[FILL: Final CTA copy]"}
          </p>
        </Reveal>
        <Reveal delay={0.3} className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/contact" variant="solid">
            Start a Conversation
          </Button>
          {phone && (
            <Button href={`tel:${phone.replace(/\s+/g, "")}`} variant="outline">
              Call or WhatsApp
            </Button>
          )}
        </Reveal>
      </div>
    </section>
  );
}
