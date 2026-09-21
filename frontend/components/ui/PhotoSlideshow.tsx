"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function PhotoSlideshow({
  images,
  alt,
  sizes,
  imgClassName,
  intervalMs = 3800,
  speed = 1,
}: {
  images: string[];
  alt: string;
  sizes: string;
  imgClassName?: string;
  intervalMs?: number;
  /** Scales transition speed — e.g. 1.5 makes the hold time and crossfade 1.5x faster. */
  speed?: number;
}) {
  const effectiveInterval = intervalMs / speed;
  const fadeInMs = 1400 / speed;
  const fadeOutMs = 1000 / speed;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, effectiveInterval);
    return () => clearInterval(timer);
  }, [images.length, effectiveInterval]);

  if (images.length === 0) return null;

  // The zoom runs for the full time a slide is visible (its hold time plus the
  // fade it takes to arrive) so the motion reads as continuous, not restarted.
  const zoomDurationMs = effectiveInterval + fadeInMs;

  return (
    <>
      {images.map((src, i) => {
        const active = i === index;
        return (
          <div
            key={src}
            className="absolute inset-0 overflow-hidden transition-opacity ease-luxe"
            style={{ opacity: active ? 1 : 0, transitionDuration: `${active ? fadeInMs : fadeOutMs}ms` }}
          >
            <div className={active ? "kenburns-active relative h-full w-full" : "relative h-full w-full"} style={active ? { animationDuration: `${zoomDurationMs}ms` } : undefined}>
              <Image
                src={src}
                alt={images.length > 1 ? `${alt} — photo ${i + 1}` : alt}
                fill
                sizes={sizes}
                priority={i === 0}
                className={imgClassName}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}
