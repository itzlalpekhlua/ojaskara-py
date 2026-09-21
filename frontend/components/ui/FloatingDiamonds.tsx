"use client";

import { motion } from "framer-motion";

type Spec = { top: string; left: string; size: number; opacity: number; duration: number; delay: number };

const defaultSpecs: Spec[] = [
  { top: "12%", left: "8%", size: 18, opacity: 0.35, duration: 7, delay: 0 },
  { top: "68%", left: "5%", size: 12, opacity: 0.25, duration: 9, delay: 1.2 },
  { top: "22%", left: "92%", size: 14, opacity: 0.3, duration: 8, delay: 0.6 },
  { top: "78%", left: "88%", size: 20, opacity: 0.28, duration: 10, delay: 2 },
  { top: "45%", left: "50%", size: 10, opacity: 0.18, duration: 11, delay: 1.6 },
];

export function FloatingDiamonds({ specs = defaultSpecs }: { specs?: Spec[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {specs.map((s, i) => (
        <motion.svg
          key={i}
          width={s.size}
          height={s.size}
          viewBox="0 0 20 20"
          className="absolute"
          style={{ top: s.top, left: s.left, opacity: s.opacity }}
          animate={{ y: [0, -16, 0], rotate: [0, 15, 0] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect x="2" y="2" width="16" height="16" transform="rotate(45 10 10)" fill="none" stroke="#eabe3a" strokeWidth="1" />
        </motion.svg>
      ))}
    </div>
  );
}
