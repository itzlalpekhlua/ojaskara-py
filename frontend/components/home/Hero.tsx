"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { FloatingDiamonds } from "@/components/ui/FloatingDiamonds";

const ease = [0.22, 1, 0.36, 1] as const;
const revealEase = [0.16, 1, 0.3, 1] as const;

const reveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  shown: { opacity: 1, y: 0 },
};

// Same entrance as `reveal`, plus a slow white-to-gold-to-white color pulse
// for the hero headline. The array starts and ends on the same color so the
// infinite loop has no visible seam.
const revealWithGoldPulse: Variants = {
  hidden: { opacity: 0, y: 28, color: "#f4efe4" },
  shown: { opacity: 1, y: 0, color: ["#f4efe4", "#eabe3a", "#f4efe4"] },
};

// Video plays at 65% speed (a 35% slowdown) for a more cinematic feel —
// this only changes playback rate, so the source quality is untouched.
const VIDEO_PLAYBACK_RATE = 0.65;
const TEXT_REVEAL_DELAY_MS = 2400;

function useDelay(base: number) {
  return { duration: 1.6, delay: base, ease: revealEase };
}

export function Hero({ heroImage, heroVideoUrl }: { heroImage: string; heroVideoUrl?: string | null }) {
  const videoSrc = heroVideoUrl || "/video/hero-bg.mp4";
  const [revealed, setRevealed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), TEXT_REVEAL_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = VIDEO_PLAYBACK_RATE;
    const onLoaded = () => {
      video.playbackRate = VIDEO_PLAYBACK_RATE;
    };
    video.addEventListener("loadedmetadata", onLoaded);
    return () => video.removeEventListener("loadedmetadata", onLoaded);
  }, []);

  return (
    <section className="relative flex h-[100svh] min-h-[640px] w-full items-end overflow-hidden bg-ink-950">
      <div className="absolute inset-0">
        <video
          key={videoSrc}
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={heroImage || undefined}
          className="h-full w-full object-cover"
          style={{ willChange: "transform" }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 1.2, ease }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-transparent to-ink-950" />
        <FloatingDiamonds />
      </motion.div>

      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 0.4 : 0 }}
        transition={{ duration: 1, ease }}
        className="pointer-events-none absolute right-8 top-28 hidden md:block"
        width="140"
        height="140"
        viewBox="0 0 140 140"
      >
        <rect x="30" y="30" width="80" height="80" transform="rotate(45 70 70)" fill="none" stroke="#eabe3a" strokeWidth="0.75" />
      </motion.svg>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 md:px-10 md:pb-28">
        <motion.div
          variants={reveal}
          initial="hidden"
          animate={revealed ? "shown" : "hidden"}
          transition={useDelay(0)}
          className="flex items-center gap-3"
        >
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: revealed ? 32 : 0 }}
            transition={{ duration: 1.4, delay: 0.35, ease: revealEase }}
            className="h-px bg-gold-400"
          />
          <span className="text-xs uppercase tracking-widest2 text-gold-300 font-sans">Ojaskaraa Builders</span>
        </motion.div>

        <div className="relative mt-6 overflow-hidden">
          <motion.h1
            variants={revealWithGoldPulse}
            initial="hidden"
            animate={revealed ? "shown" : "hidden"}
            transition={{
              ...useDelay(0.25),
              color: { duration: 3.5, delay: 0.25 + 1.6, repeat: Infinity, ease: "easeInOut" },
            }}
            className="font-display text-[2.75rem] font-light leading-[1.02] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem]"
          >
            We Create
          </motion.h1>
        </div>
        <div className="relative overflow-hidden">
          <motion.h1
            variants={revealWithGoldPulse}
            initial="hidden"
            animate={revealed ? "shown" : "hidden"}
            transition={{
              ...useDelay(0.5),
              color: { duration: 3.5, delay: 0.5 + 1.6, repeat: Infinity, ease: "easeInOut" },
            }}
            className="font-display text-[2.75rem] font-light leading-[1.02] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem]"
          >
            the Future.
          </motion.h1>
        </div>

        <motion.div
          variants={reveal}
          initial="hidden"
          animate={revealed ? "shown" : "hidden"}
          transition={useDelay(0.85)}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Button href="/contact" variant="solid">
            Get Free Consultation
          </Button>
        </motion.div>
      </div>

      {revealed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
        >
          <span className="text-[10px] uppercase tracking-widest2 text-bone/50">Scroll</span>
          <span className="h-10 w-px bg-gradient-to-b from-gold-400 to-transparent" />
        </motion.div>
      )}
    </section>
  );
}
