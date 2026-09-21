import Link from "next/link";
import { LionMark } from "./LionMark";
import { DiamondDivider } from "./ui/DiamondDivider";
import { SocialIconRow } from "./SocialIcons";
import { GoldWordmark } from "./ui/GoldWordmark";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Our Projects", href: "/projects" },
      { label: "Our Design", href: "/design" },
      { label: "Our Services", href: "/services" },
      { label: "Construction Projects", href: "/construction-projects" },
      { label: "Cost Estimator", href: "/cost-estimator" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Team", href: "/team" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer({
  phone,
  phoneSecondary,
  email,
  locationPrimaryName,
  locationPrimaryLabel,
  locationSecondaryName,
  locationSecondaryLabel,
  instagramUrl,
  facebookUrl,
  tiktokUrl,
  whatsappUrl,
}: {
  phone?: string | null;
  phoneSecondary?: string | null;
  email?: string | null;
  locationPrimaryName?: string | null;
  locationPrimaryLabel?: string | null;
  locationSecondaryName?: string | null;
  locationSecondaryLabel?: string | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  tiktokUrl?: string | null;
  whatsappUrl?: string | null;
}) {
  return (
    <footer className="relative overflow-hidden border-t border-gold-600/25 bg-ink-950 pt-20 pb-10">
      <div className="absolute inset-0 diamond-field opacity-60" />
      <div
        className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full opacity-[0.12] blur-[100px]"
        style={{ background: "radial-gradient(circle, #4f2980 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full opacity-[0.12] blur-[100px]"
        style={{ background: "radial-gradient(circle, #166049 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="flex flex-col gap-4">
            <LionMark size={52} />
            <GoldWordmark className="h-auto w-full max-w-[260px] self-start" fontSize={64} />
            <p className="text-sm text-bone/50 max-w-xs">
              Your dream home, our expertise — from concept to completion.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <p className="text-gold-300 text-[11px] uppercase tracking-widest2 mb-2">{col.title}</p>
              {col.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-bone/70 hover:text-gold-200 transition-colors w-fit"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}

          <div className="flex flex-col gap-3">
            <p className="text-gold-300 text-[11px] uppercase tracking-widest2 mb-2">Contact</p>
            <p className="text-sm text-bone/70">{phone || "[FILL: Phone]"}</p>
            {phoneSecondary && <p className="text-sm text-bone/70">{phoneSecondary}</p>}
            <p className="text-sm text-bone/70">{email || "[FILL: Email]"}</p>
            <div className="mt-1 flex flex-col gap-1 text-sm text-bone/70">
              <p>
                {locationPrimaryName || "[FILL: Primary location]"}
                {locationPrimaryLabel && <span className="text-bone/40"> — {locationPrimaryLabel}</span>}
              </p>
              {locationSecondaryName && (
                <p>
                  {locationSecondaryName}
                  {locationSecondaryLabel && <span className="text-bone/40"> — {locationSecondaryLabel}</span>}
                </p>
              )}
            </div>
            <div className="mt-2">
              <SocialIconRow
                instagramUrl={instagramUrl}
                facebookUrl={facebookUrl}
                tiktokUrl={tiktokUrl}
                whatsappUrl={whatsappUrl}
                size="sm"
              />
            </div>
          </div>
        </div>

        <DiamondDivider className="my-12" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-bone/40 tracking-wide">
          <p>© {new Date().getFullYear()} Ojaskaraa Builders. All rights reserved.</p>
          <p className="uppercase tracking-widest2">Precision. Strength. Craftsmanship.</p>
        </div>
      </div>
    </footer>
  );
}
