"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export type GalleryItem = { url: string; type?: "image" | "video" };

export function ImageGallery({ items, alt }: { items: GalleryItem[]; alt: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (items.length === 0) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-2xl bg-ink-900/40 text-bone/30 shadow-[inset_0_0_60px_rgba(0,0,0,0.5)]">
        [FILL: Images]
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item, i) => (
          <button
            key={item.url + i}
            onClick={() => setOpenIndex(i)}
            className={`group relative block overflow-hidden rounded-2xl bg-ink-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] ${
              i === 0 ? "sm:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
            }`}
          >
            {item.type === "video" ? (
              <>
                <video src={item.url} className="h-full w-full object-contain" muted playsInline />
                <div className="absolute inset-0 flex items-center justify-center bg-ink-950/30">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/70 bg-ink-950/60">
                    <span className="ml-1 h-0 w-0 border-y-[8px] border-l-[12px] border-y-transparent border-l-gold-300" />
                  </span>
                </div>
              </>
            ) : (
              <Image
                src={item.url}
                alt={`${alt} — image ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain transition-transform duration-700 group-hover:scale-105"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-950/95 p-6 backdrop-blur-sm"
            onClick={() => setOpenIndex(null)}
          >
            <button
              className="absolute right-6 top-6 text-2xl text-bone/70 hover:text-gold-300"
              onClick={() => setOpenIndex(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              {items[openIndex].type === "video" ? (
                <video src={items[openIndex].url} className="h-full w-full object-contain" controls autoPlay />
              ) : (
                <Image src={items[openIndex].url} alt={`${alt} — full view`} fill sizes="100vw" className="object-contain" />
              )}
            </div>
            {items.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl text-bone/50 hover:text-gold-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenIndex((openIndex - 1 + items.length) % items.length);
                  }}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl text-bone/50 hover:text-gold-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenIndex((openIndex + 1) % items.length);
                  }}
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
