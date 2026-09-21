"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { NavIcon, type NavIconKey } from "@/components/admin/NavIcons";
import { PUBLIC_BACKEND_URL } from "@/lib/publicBackendUrl";

const NAV: { href: string; label: string; icon: NavIconKey }[] = [
  { href: "/admin/enquiries", label: "Enquiries", icon: "mail" },
  { href: "/admin/hero", label: "Introduction Video", icon: "video" },
  { href: "/admin/projects", label: "Our Projects", icon: "grid" },
  { href: "/admin/design-portfolio", label: "Design Portfolio", icon: "image" },
  { href: "/admin/construction-projects", label: "Construction Projects", icon: "building" },
  { href: "/admin/media-coverage", label: "Media Coverage", icon: "list" },
  { href: "/admin/services", label: "Services", icon: "list" },
  { href: "/admin/team", label: "Team", icon: "people" },
  { href: "/admin/testimonials", label: "Reviews", icon: "star" },
  { href: "/admin/social", label: "Social", icon: "share" },
  { href: "/admin/cost-estimator", label: "Cost Estimator Rates", icon: "calculator" },
  { href: "/admin/settings", label: "Site Settings", icon: "settings" },
];

export function AdminSidebar({ email, newEnquiryCount = 0 }: { email: string; newEnquiryCount?: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-white/10 bg-ink-950 px-4 py-6">
      <div className="mb-2">
        <p className="font-display text-lg text-gold-metal">Ojaskaraa Admin</p>
        <p className="mt-0.5 truncate text-xs text-bone/40">{email}</p>
      </div>

      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="mb-6 flex items-center justify-center gap-2 rounded-md border border-gold-400/30 bg-gold-400/10 px-3 py-2 text-xs font-semibold text-gold-300 hover:bg-gold-400/20"
      >
        View my website ↗
      </a>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm transition-colors ${
                active ? "bg-gold-400/15 text-gold-300" : "text-bone/70 hover:bg-white/5 hover:text-bone"
              }`}
            >
              <NavIcon icon={item.icon} className="shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.href === "/admin/enquiries" && newEnquiryCount > 0 && (
                <span className="rounded-full bg-gold-400 px-1.5 py-0.5 text-[10px] font-bold text-ink-950">
                  {newEnquiryCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await fetch(`${PUBLIC_BACKEND_URL}/api/admin/auth/logout`, { method: "POST", credentials: "include" });
            router.push("/admin/login");
            router.refresh();
          })
        }
        className="mt-4 rounded-md border border-white/10 px-3 py-2 text-left text-sm text-bone/60 hover:bg-white/5 hover:text-bone disabled:opacity-50"
      >
        Log out
      </button>
    </aside>
  );
}
