"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

export type FlowService = {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  mediaType?: string;
  children: { id: string; title: string; description: string | null; image: string | null; mediaType?: string }[];
};

const ease = [0.22, 1, 0.36, 1] as const;

function stepId(index: number) {
  return `service-step-${index}`;
}

function scrollToStep(index: number) {
  document.getElementById(stepId(index))?.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function ServicesFlow({ services }: { services: FlowService[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 35%"],
  });
  const trackPercent = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const markerOpacity = useTransform(scrollYProgress, [0, 0.03, 0.95, 1], [0, 1, 1, 0]);

  return (
    <div ref={containerRef} className="relative">
      <div className="absolute left-6 top-2 bottom-2 w-px bg-gold-700/15 md:left-1/2 md:-translate-x-1/2" />
      <motion.div
        style={{ height: trackPercent }}
        className="absolute left-6 top-2 w-px bg-gradient-to-b from-gold-300 via-gold-400 to-gold-600 shadow-[0_0_12px_rgba(234, 190, 58,0.6)] md:left-1/2 md:-translate-x-1/2"
      />

      <TravelingDiamond top={trackPercent} opacity={markerOpacity} />

      <div className="flex flex-col gap-20 md:gap-32">
        {services.map((service, i) => (
          <StepBlock key={service.id} service={service} index={i} reversed={i % 2 === 1} />
        ))}
      </div>
    </div>
  );
}

function TravelingDiamond({
  top,
  opacity,
}: {
  top: MotionValue<string>;
  opacity: MotionValue<number>;
}) {
  return (
    <motion.div
      aria-hidden="true"
      style={{ top, opacity }}
      className="pointer-events-none absolute left-6 z-20 -translate-x-1/2 -translate-y-1/2 md:left-1/2"
    >
      <div className="relative flex h-6 w-6 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-none bg-gold-400/30" style={{ clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" }} />
        <svg width="24" height="24" viewBox="0 0 24 24" className="relative drop-shadow-[0_0_6px_rgba(234, 190, 58,0.9)]">
          <rect x="4" y="4" width="16" height="16" transform="rotate(45 12 12)" fill="#eabe3a" stroke="#fdf3d0" strokeWidth="1" />
        </svg>
      </div>
    </motion.div>
  );
}

function StepBlock({
  service,
  index,
  reversed,
}: {
  service: FlowService;
  index: number;
  reversed: boolean;
}) {
  return (
    <div id={stepId(index)} className="relative grid grid-cols-1 items-center gap-10 scroll-mt-32 md:grid-cols-2 md:gap-0">
      <Node index={index + 1} onClick={() => scrollToStep(index)} />

      <ImagePanel
        image={service.image}
        mediaType={service.mediaType}
        title={service.title}
        className={`pl-16 md:pl-0 ${reversed ? "md:order-2 md:pl-16" : "md:pr-16"}`}
      />

      <TextPanel
        title={service.title}
        description={service.description}
        className={`pl-16 md:pl-0 ${reversed ? "md:order-1 md:pr-16 md:text-right" : "md:pl-16"}`}
        alignEnd={reversed}
      />

      {service.children.length > 0 && (
        <div className="col-span-1 mt-4 pl-16 md:col-span-2 md:pl-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:mx-auto md:max-w-3xl">
            {service.children.map((child, ci) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: ci * 0.12, ease }}
                className="group relative overflow-hidden ring-1 ring-gold-700/25 bg-ink-900/60 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.8)]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  {child.image && child.mediaType === "video" ? (
                    <video
                      src={child.image}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="h-full w-full object-contain saturate-[1.08] contrast-[1.03] transition-transform duration-[1200ms] ease-luxe group-hover:scale-110"
                    />
                  ) : child.image ? (
                    <Image
                      src={child.image}
                      alt={child.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 380px"
                      className="object-contain saturate-[1.08] contrast-[1.03] transition-transform duration-[1200ms] ease-luxe group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-bone/30">[FILL]</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/15 via-transparent to-gold-500/10 mix-blend-overlay" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(8,4,14,0.55)_100%)]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/15 to-transparent" />
                  <p className="absolute bottom-3 left-4 text-[11px] uppercase tracking-widest2 text-gold-200">
                    {child.title}
                  </p>
                </div>
                <p className="p-5 text-sm leading-relaxed text-bone/60">
                  {child.description || "[FILL: deliverables]"}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Node({ index, onClick }: { index: number; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={`Jump to step ${index}`}
      initial={{ scale: 0.6, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.96 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease }}
      className="group absolute left-6 top-0 z-10 -translate-x-1/2 cursor-pointer md:left-1/2"
    >
      <div className="relative flex h-12 w-12 items-center justify-center">
        <svg className="absolute inset-0" width="48" height="48" viewBox="0 0 48 48">
          <rect
            x="10"
            y="10"
            width="28"
            height="28"
            transform="rotate(45 24 24)"
            fill="#120b1d"
            stroke="#eabe3a"
            strokeWidth="1"
            className="transition-all duration-300 group-hover:stroke-[#fdf3d0]"
          />
        </svg>
        <span className="relative font-display text-sm text-gold-3d">{String(index).padStart(2, "0")}</span>
      </div>
    </motion.button>
  );
}

function ImagePanel({
  image,
  mediaType,
  title,
  className = "",
}: {
  image: string | null;
  mediaType?: string;
  title: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9, ease }}
      className={className}
    >
      <div className="group relative aspect-[4/3] w-full overflow-hidden bg-ink-900 ring-1 ring-gold-500/25 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.85)]">
        {image && mediaType === "video" ? (
          <video
            src={image}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-contain saturate-[1.08] contrast-[1.04] transition-transform duration-[1400ms] ease-luxe group-hover:scale-105"
          />
        ) : image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-contain saturate-[1.08] contrast-[1.04] transition-transform duration-[1400ms] ease-luxe group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-bone/30">[FILL: Image]</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/15 via-transparent to-gold-500/10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(8,4,14,0.5)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/55 via-transparent to-ink-950/10" />
        <svg className="absolute right-3 top-3 opacity-60" width="18" height="18" viewBox="0 0 18 18">
          <rect x="3" y="3" width="12" height="12" transform="rotate(45 9 9)" fill="none" stroke="#f3d266" strokeWidth="1" />
        </svg>
      </div>
    </motion.div>
  );
}

function TextPanel({
  title,
  description,
  className = "",
  alignEnd = false,
}: {
  title: string;
  description: string | null;
  className?: string;
  alignEnd?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: 0.15, ease }}
      className={className}
    >
      <div className={`flex flex-col gap-4 ${alignEnd ? "md:items-end" : "md:items-start"}`}>
        <span
          className={`h-px w-10 bg-gradient-to-r from-gold-400 to-transparent ${
            alignEnd ? "md:bg-gradient-to-l" : ""
          }`}
        />
        <h3 className="font-display text-3xl font-semibold text-gold-3d md:text-4xl">{title}</h3>
        {description && (
          <p className="max-w-md text-sm leading-relaxed text-bone/60 sm:text-base">{description}</p>
        )}
      </div>
    </motion.div>
  );
}
