"use client";

import { motion } from "framer-motion";

const SPARK_PATH =
  "M30 0 C33 34, 37 41, 60 50 C37 59, 33 66, 30 100 C27 66, 23 59, 0 50 C23 41, 27 34, 30 0 Z";

type Diamond = {
  size: number;
  top: string[];
  left: string[];
  duration: number;
  spin: number;
  delay: number;
  opacity: number;
};

const diamonds: Diamond[] = [
  { size: 22, top: ["10%", "55%", "28%", "10%"], left: ["6%", "24%", "46%", "6%"], duration: 34, spin: 10, delay: 0, opacity: 0.55 },
  { size: 16, top: ["72%", "18%", "52%", "72%"], left: ["84%", "62%", "14%", "84%"], duration: 40, spin: 13, delay: 3, opacity: 0.4 },
  { size: 14, top: ["38%", "82%", "8%", "38%"], left: ["44%", "76%", "70%", "44%"], duration: 46, spin: 16, delay: 6, opacity: 0.35 },
];

export function DriftingDiamonds() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {diamonds.map((d, i) => (
        <motion.svg
          key={i}
          width={d.size}
          height={d.size * 1.6}
          viewBox="0 0 60 100"
          className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_6px_rgba(234,190,58,0.6)]"
          style={{ opacity: d.opacity }}
          animate={{ top: d.top, left: d.left, rotate: 360 }}
          transition={{
            top: { duration: d.duration, delay: d.delay, repeat: Infinity, ease: "easeInOut" },
            left: { duration: d.duration, delay: d.delay, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: d.spin, repeat: Infinity, ease: "linear" },
          }}
        >
          <defs>
            <linearGradient id={`sparkGrad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8a6314" />
              <stop offset="25%" stopColor="#fdf3d0" />
              <stop offset="50%" stopColor="#eabe3a" />
              <stop offset="75%" stopColor="#fdf3d0" />
              <stop offset="100%" stopColor="#b3821a" />
            </linearGradient>
          </defs>
          <path d={SPARK_PATH} fill={`url(#sparkGrad-${i})`} />
        </motion.svg>
      ))}
    </div>
  );
}
