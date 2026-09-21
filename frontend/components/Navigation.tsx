"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { LionMark } from "./LionMark";
import { GoldWordmark } from "./ui/GoldWordmark";

const simpleLinks = [
  { label: "Our Approach", href: "/services" },
  { label: "Construction", href: "/construction-projects" },
  { label: "Estimate", href: "/cost-estimator" },
  { label: "Team", href: "/team" },
  { label: "Reviews", href: "/testimonials" },
  { label: "Social", href: "/social" },
  { label: "Contact", href: "/contact" },
];

const designLinks = [
  { label: "Interior Design", href: "/design/interior" },
  { label: "Exterior Design", href: "/design/exterior" },
];

function PhoneGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

export function Navigation({
  phone,
}: {
  phone?: string | null;
}) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<"design" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const lastY = useRef(0);
  const navRef = useRef<HTMLElement>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const diff = latest - lastY.current;
    if (mobileOpen && Math.abs(diff) > 4) {
      setMobileOpen(false);
    }
    if (diff > 4) {
      setOpenMenu(null);
    }
    if (latest < 80) {
      setHidden(false);
    } else if (diff > 4) {
      setHidden(true);
    } else if (diff < -4) {
      setHidden(false);
    }
    lastY.current = latest;
  });

  useEffect(() => {
    if (!openMenu) return;
    function handleOutside(e: PointerEvent) {
      const target = e.target as HTMLElement;
      if (
        navRef.current &&
        !navRef.current.contains(target) &&
        !target.closest("[data-mega-menu-portal]")
      ) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [openMenu]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <motion.header
      animate={{ y: hidden ? "-130%" : "0%" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-2 rounded-full border border-gold-500/30 bg-ink-950 px-2 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.55)] sm:gap-4 sm:px-3">
          <Link href="/" className="flex shrink-0 items-center gap-2 rounded-full py-1 pl-1 pr-2 sm:pr-3" onClick={() => setMobileOpen(false)}>
            <LionMark size={38} />
            <GoldWordmark className="hidden h-8 w-auto sm:block" fontSize={40} />
          </Link>

          <nav
            ref={navRef}
            className="no-scrollbar hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-full bg-ink-800/60 p-1 lg:flex"
          >
            <NavPill href="/" label="Home" active={isActive("/")} />
            <NavPill href="/projects" label="Projects" active={isActive("/projects")} />

            <MegaMenuTrigger
              label="Design"
              active={isActive("/design")}
              open={openMenu === "design"}
              onToggle={() => setOpenMenu((v) => (v === "design" ? null : "design"))}
            >
              {designLinks.map((d) => (
                <MenuTextLink key={d.label} href={d.href} onClick={() => setOpenMenu(null)}>
                  {d.label}
                </MenuTextLink>
              ))}
            </MegaMenuTrigger>

            {simpleLinks.map((l) => (
              <NavPill key={l.href} href={l.href} label={l.label} active={isActive(l.href)} />
            ))}
          </nav>

          {phone ? (
            <a
              href={`tel:+977${phone.replace(/\D/g, "")}`}
              aria-label={`Call +977 ${phone}`}
              className="hidden shrink-0 items-center justify-center rounded-full bg-ink-800/70 p-3 text-gold-200 transition-colors hover:bg-ink-700 md:flex"
            >
              <PhoneGlyph />
            </a>
          ) : (
            <span />
          )}

          <button
            className="flex shrink-0 flex-col items-center justify-center gap-1.5 rounded-full bg-ink-800/70 px-3.5 py-3 text-bone lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="block h-px w-5 bg-gold-300" />
            <span className="block h-px w-5 bg-gold-300" />
            <span className="block h-px w-3.5 self-end bg-gold-300" />
          </button>
        </div>

        {mobileOpen && (
          <div className="mt-2 max-h-[75vh] overflow-y-auto rounded-3xl border border-gold-500/20 bg-ink-950 px-6 py-6 shadow-[0_10px_40px_rgba(0,0,0,0.55)] lg:hidden">
            <div className="flex flex-col gap-6 font-sans text-sm uppercase tracking-widest2">
              <Link href="/" onClick={() => setMobileOpen(false)} className="text-bone/90">
                Home
              </Link>
              <Link href="/projects" onClick={() => setMobileOpen(false)} className="text-bone/90">
                Projects
              </Link>

              <MobileGroup title="Design">
                {designLinks.map((d) => (
                  <Link
                    key={d.label}
                    href={d.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-bone/80 normal-case block py-1"
                  >
                    {d.label}
                  </Link>
                ))}
              </MobileGroup>

              <div className="gold-hairline" />
              {simpleLinks.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="text-bone/90">
                  {l.label}
                </Link>
              ))}
              {phone && (
                <a href={`tel:+977${phone.replace(/\D/g, "")}`} className="flex items-center gap-2 text-gold-200 normal-case">
                  <PhoneGlyph /> +977 {phone}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.header>
  );
}

function NavPill({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-semibold transition-colors duration-300 ${
        active ? "bg-gold-metal text-ink-950" : "text-bone/80 hover:text-gold-200"
      }`}
    >
      {label}
    </Link>
  );
}

function MegaMenuTrigger({
  label,
  active,
  open,
  onToggle,
  children,
}: {
  label: string;
  active: boolean;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function updatePos() {
      const rect = btnRef.current?.getBoundingClientRect();
      if (rect) setPos({ left: rect.left + rect.width / 2, top: rect.bottom + 16 });
    }
    updatePos();
    window.addEventListener("resize", updatePos);
    return () => window.removeEventListener("resize", updatePos);
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-semibold transition-colors duration-300 ${
          active
            ? "bg-gold-metal text-ink-950"
            : open
              ? "bg-ink-700 text-gold-200"
              : "text-bone/80 hover:text-gold-200"
        }`}
      >
        {label}
        <span className={`h-1 w-1 rotate-45 border-b border-r border-current transition-transform ${open ? "-rotate-[135deg]" : ""}`} />
      </button>
      {open &&
        pos &&
        mounted &&
        createPortal(
          <div
            data-mega-menu-portal
            className="fixed z-[60] -translate-x-1/2"
            style={{ left: pos.left, top: pos.top }}
          >
            <div className="min-w-[200px] overflow-hidden rounded-[28px] border border-gold-700/30 bg-ink-950 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              <div className="h-px w-full bg-gradient-to-r from-purple-600/50 via-gold-400/80 to-emerald-600/50" />
              <div className="flex flex-col gap-1 p-2">{children}</div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

function MenuTextLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold text-bone/80 normal-case tracking-normal transition-colors hover:bg-ink-800/70 hover:text-gold-200"
    >
      {children}
    </Link>
  );
}

function MobileGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-gold-300 text-[10px] mb-2">{title}</p>
      {children}
    </div>
  );
}
