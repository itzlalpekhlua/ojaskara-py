"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function GoldSpark({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block overflow-hidden ${className}`}>
      {children}
      <motion.span
        aria-hidden="true"
        initial={{ x: "-130%" }}
        whileInView={{ x: "230%" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.3, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-y-0 left-0 w-1/4 -skew-x-[18deg] bg-gradient-to-r from-transparent via-white/60 to-transparent mix-blend-overlay"
      />
    </span>
  );
}
