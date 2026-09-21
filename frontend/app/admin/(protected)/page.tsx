import Link from "next/link";
import { NavIcon, type NavIconKey } from "@/components/admin/NavIcons";

const sections: { href: string; label: string; icon: NavIconKey; description: string }[] = [
  { href: "/admin/enquiries", label: "Enquiries", icon: "mail", description: "Messages people send through your Contact form." },
  { href: "/admin/hero", label: "Introduction Video", icon: "video", description: "The video visitors see first on your homepage." },
  { href: "/admin/projects", label: "Our Projects", icon: "grid", description: "The house and building designs organised by category." },
  { href: "/admin/design-portfolio", label: "Design Portfolio", icon: "image", description: "Interior and exterior design work you want to show off." },
  { href: "/admin/construction-projects", label: "Construction Projects", icon: "building", description: "Photos and updates from active or finished job sites." },
  { href: "/admin/services", label: "Services", icon: "list", description: "The steps you walk clients through, with photos or videos." },
  { href: "/admin/team", label: "Team", icon: "people", description: "Your staff — names, roles, and photos." },
  { href: "/admin/testimonials", label: "Reviews", icon: "star", description: "Written reviews, video testimonials, and photo moments from clients." },
  { href: "/admin/social", label: "Social", icon: "share", description: "Instagram, Facebook and TikTok posts shown on your site." },
  { href: "/admin/settings", label: "Site Settings", icon: "settings", description: "Phone numbers, address, social links and site text." },
];

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-gold-metal">Welcome</h1>
      <p className="mt-1 text-sm text-bone/50">Pick something below to update it on your website.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-gold-400/40 hover:bg-white/[0.04]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold-400/15 text-gold-300">
              <NavIcon icon={s.icon} />
            </span>
            <div>
              <p className="text-sm font-semibold text-bone group-hover:text-gold-200">{s.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-bone/50">{s.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
