import { apiGet } from "@/lib/api";
import type { SiteSettings } from "@/lib/types";
import { GoldLabel } from "@/components/ui/GoldLabel";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/ContactForm";
import { SocialIconRow } from "@/components/SocialIcons";

export default async function ContactPage() {
  const settings = await apiGet<SiteSettings>("/api/settings");

  return (
    <div className="bg-ink-950 pt-32 pb-28">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <GoldLabel>Begin a Project</GoldLabel>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-4 font-display text-5xl font-bold text-gold-3d sm:text-6xl md:text-7xl">Contact</h1>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-16 md:grid-cols-2">
          <Reveal delay={0.15}>
            <div className="flex flex-col gap-8">
              <div>
                <p className="text-[11px] uppercase tracking-widest2 text-gold-300">Call or WhatsApp</p>
                <p className="mt-2 text-lg text-bone/80">{settings?.phone || "[FILL: Phone]"}</p>
                {settings?.phoneSecondary && (
                  <p className="text-lg text-bone/80">{settings.phoneSecondary}</p>
                )}
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest2 text-gold-300">Email</p>
                <p className="mt-2 text-lg text-bone/80">{settings?.email || "[FILL: Email]"}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest2 text-gold-300">Our Locations</p>
                <p className="mt-2 text-lg text-bone/80">
                  {settings?.locationPrimaryName || "[FILL: Primary location]"}
                  {settings?.locationPrimaryLabel && (
                    <span className="ml-2 text-sm text-bone/40">— {settings.locationPrimaryLabel}</span>
                  )}
                </p>
                {settings?.locationSecondaryName && (
                  <p className="mt-1 text-lg text-bone/80">
                    {settings.locationSecondaryName}
                    {settings.locationSecondaryLabel && (
                      <span className="ml-2 text-sm text-bone/40">— {settings.locationSecondaryLabel}</span>
                    )}
                  </p>
                )}
                <p className="mt-2 text-xs uppercase tracking-widest2 text-emerald-400/80">
                  Serving clients across Nepal
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest2 text-gold-300">Follow</p>
                <div className="mt-3">
                  <SocialIconRow
                    instagramUrl={settings?.instagramUrl}
                    facebookUrl={settings?.facebookUrl}
                    tiktokUrl={settings?.tiktokUrl}
                    whatsappUrl={settings?.whatsappUrl}
                  />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <ContactForm whatsappPhone={settings?.phone} />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
