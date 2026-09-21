"use client";

import { useState } from "react";
import Image from "next/image";
import { DiamondCorner } from "@/components/ui/DiamondCorner";

export type TestimonialData = {
  id: string;
  kind: string;
  customerName: string;
  reviewText: string | null;
  location: string | null;
  rating: number | null;
  videoUrl: string | null;
  thumbnail: string | null;
  response: string | null;
};

export function TestimonialCard({ t }: { t: TestimonialData }) {
  const [playing, setPlaying] = useState(false);

  if (t.videoUrl) {
    return (
      <div className="group relative aspect-[4/5] w-full overflow-hidden border border-gold-700/30 bg-ink-900">
        <DiamondCorner position="top-left" />
        <DiamondCorner position="bottom-right" />
        {playing ? (
          <video src={t.videoUrl} controls autoPlay className="h-full w-full object-contain" />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="relative flex h-full w-full items-center justify-center"
            aria-label={`Play testimonial from ${t.customerName}`}
          >
            {t.thumbnail ? (
              <Image src={t.thumbnail} alt={t.customerName} fill sizes="480px" className="object-contain" />
            ) : (
              <div className="absolute inset-0 bg-ink-800" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />
            <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/70 bg-ink-950/60 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
              <span className="ml-1 h-0 w-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-gold-300" />
            </span>
            <p className="absolute bottom-5 left-5 text-sm uppercase tracking-widest2 text-bone">
              {t.customerName}
            </p>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative border border-gold-700/20 p-8">
      <DiamondCorner position="top-left" />
      <DiamondCorner position="bottom-right" />
      <span className="font-display text-5xl text-gold-metal leading-none">&ldquo;</span>
      <p className="mt-2 text-base leading-relaxed text-bone/70">{t.reviewText || "[FILL: Customer review]"}</p>
      {t.rating != null && (
        <div className="mt-4 flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} viewBox="0 0 20 20" className={`h-3.5 w-3.5 ${i < t.rating! ? "fill-gold-400" : "fill-white/15"}`}>
              <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.9l-5.2 2.61.99-5.79-4.21-4.1 5.82-.85z" />
            </svg>
          ))}
        </div>
      )}
      <p className="mt-6 text-xs uppercase tracking-widest2 text-gold-300">{t.customerName}</p>
      {t.location && <p className="mt-1 text-xs text-bone/40">{t.location}</p>}
      {t.response && (
        <div className="mt-6 border-t border-gold-700/20 pt-4">
          <p className="text-[11px] uppercase tracking-widest2 text-gold-300/70">Our Response</p>
          <p className="mt-2 text-sm text-bone/60">{t.response}</p>
        </div>
      )}
    </div>
  );
}
