"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DiamondCorner } from "@/components/ui/DiamondCorner";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { Button } from "@/components/ui/Button";
import { GoogleRatingBadge } from "@/components/ui/GoogleRatingBadge";
import { TestimonialCard, type TestimonialData } from "@/components/TestimonialCard";

const AUTO_ADVANCE_MS = 3500;

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center justify-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < rating ? "fill-gold-400" : "fill-white/15"}`}
        >
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.9l-5.2 2.61.99-5.79-4.21-4.1 5.82-.85z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsTeaser({ testimonials }: { testimonials: TestimonialData[] }) {
  const reviews = testimonials.filter((t) => t.kind !== "video" && t.reviewText);
  const videos = testimonials.filter((t) => t.kind === "video" && t.videoUrl);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reviews.length <= 1 || paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [reviews.length, paused]);

  if (reviews.length === 0 && videos.length === 0) return null;
  const current = reviews[index];

  const goTo = (next: number) => {
    setIndex((next + reviews.length) % reviews.length);
  };

  return (
    <section id="testimonials" className="relative scroll-mt-28 overflow-hidden bg-ink-950 py-24 md:py-32">
      <AmbientGlow />
      <div className="relative mx-auto max-w-3xl px-6 md:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="In Their Words"
            title="Trusted Across Nepal"
            align="center"
            className="mx-auto items-center text-center"
          />
        </Reveal>

        <Reveal delay={0.08} className="mt-8 flex justify-center">
          <GoogleRatingBadge />
        </Reveal>

        {videos.length > 0 && (
          <div className="mt-14">
            <Reveal>
              <p className="text-center text-xs uppercase tracking-widest2 text-gold-300">Watch Their Stories</p>
            </Reveal>
            <div className={`mt-8 grid grid-cols-1 gap-6 ${videos.length > 1 ? "sm:grid-cols-2" : "mx-auto max-w-md"}`}>
              {videos.map((v, i) => (
                <Reveal key={v.id} delay={i * 0.1}>
                  <TestimonialCard t={v} />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {current && (
          <div
            className={`relative ${videos.length > 0 ? "mt-16" : "mt-14"}`}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="relative overflow-hidden rounded-2xl border border-gold-700/20 bg-ink-900/60 px-8 py-12 sm:px-14 sm:py-16">
              <DiamondCorner position="top-left" />
              <DiamondCorner position="bottom-right" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 0.985, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.985, filter: "blur(8px)" }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center"
                >
                  <span className="font-display text-5xl text-gold-metal leading-none">&ldquo;</span>
                  <p className="mx-auto mt-2 max-w-xl text-base leading-relaxed text-bone/70 sm:text-lg">
                    {current.reviewText}
                  </p>

                  {current.rating != null && (
                    <div className="mt-6">
                      <Stars rating={current.rating} />
                    </div>
                  )}

                  <p className="mt-6 text-sm font-semibold uppercase tracking-widest2 text-bone">
                    {current.customerName}
                  </p>
                  {current.location && (
                    <p className="mt-1 text-xs text-bone/50">{current.location}</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {reviews.length > 1 && (
              <div className="mt-8 flex items-center justify-center gap-6">
                <button
                  type="button"
                  aria-label="Previous testimonial"
                  onClick={() => goTo(index - 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-700/30 text-gold-300 transition-colors duration-300 hover:border-gold-400 hover:text-gold-400"
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                    <path d="M12.5 3 6 10l6.5 7 1.4-1.3L8.8 10l5.1-5.7z" />
                  </svg>
                </button>

                <div className="flex items-center gap-2">
                  {reviews.map((r, i) => (
                    <button
                      key={r.id}
                      type="button"
                      aria-label={`Go to testimonial ${i + 1}`}
                      onClick={() => goTo(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === index ? "w-6 bg-gold-400" : "w-2 bg-white/20 hover:bg-white/35"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  aria-label="Next testimonial"
                  onClick={() => goTo(index + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-700/30 text-gold-300 transition-colors duration-300 hover:border-gold-400 hover:text-gold-400"
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current">
                    <path d="M7.5 3 14 10l-6.5 7-1.4-1.3L11.2 10 6.1 4.3z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        <Reveal delay={0.2} className="mt-14 flex justify-center">
          <Button href="/testimonials" variant="outline">
            Read All Testimonials
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
