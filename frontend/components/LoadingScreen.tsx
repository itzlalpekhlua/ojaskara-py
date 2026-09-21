"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LionMark } from "./LionMark";

const ease = [0.22, 1, 0.36, 1] as const;
const DIAMOND_PERIMETER = 4 * 160; // perimeter of the 160x160 rect path (rotate() doesn't change path length)

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950"
        >
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 0.45, scale: 1 }}
            transition={{ duration: 1.2, ease }}
            className="absolute h-[300px] w-[300px] rounded-full blur-[60px]"
            style={{
              background:
                "radial-gradient(circle, rgba(234,190,58,0.5) 0%, rgba(79,41,128,0.35) 45%, transparent 72%)",
            }}
          />

          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="relative flex items-center justify-center"
          >
            <svg width="260" height="260" viewBox="0 0 260 260" className="absolute">
              <motion.rect
                x="50"
                y="50"
                width="160"
                height="160"
                transform="rotate(45 130 130)"
                fill="none"
                stroke="#eabe3a"
                strokeWidth="1"
                strokeDasharray={DIAMOND_PERIMETER}
                initial={{ strokeDashoffset: DIAMOND_PERIMETER }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.1, ease, delay: 0.15 }}
              />
              <motion.g
                animate={{ rotate: 360 }}
                style={{ transformOrigin: "130px 130px" }}
                transition={{ duration: 14, ease: "linear", repeat: Infinity }}
              >
                <rect
                  x="50"
                  y="50"
                  width="160"
                  height="160"
                  transform="rotate(45 130 130)"
                  fill="none"
                  stroke="#eabe3a"
                  strokeWidth="0.5"
                  opacity="0.4"
                />
              </motion.g>
            </svg>
            <LionMark size={168} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
