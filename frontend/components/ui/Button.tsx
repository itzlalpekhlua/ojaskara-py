import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
  className?: string;
};

export function Button({ href, children, variant = "outline", className = "" }: ButtonProps) {
  const base =
    "group relative inline-flex items-center gap-3 px-8 py-3.5 text-xs uppercase tracking-widest2 font-sans transition-all duration-500 ease-luxe";

  if (variant === "solid") {
    return (
      <Link
        href={href}
        className={`${base} bg-gold-metal text-ink-950 shadow-[0_6px_16px_-6px_rgba(0,0,0,0.5)] hover:brightness-105 ${className}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`${base} border border-gold-600/60 text-bone hover:border-gold-300 hover:text-gold-200 ${className}`}
    >
      {children}
      <span className="h-1.5 w-1.5 rotate-45 border border-gold-400 transition-transform duration-500 group-hover:translate-x-1" />
    </Link>
  );
}
