import Image from "next/image";

export function LionMark({ size = 44, className = "" }: { size?: number; className?: string }) {
  const glowSize = size * 2.1;
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full opacity-70 blur-md"
        style={{
          width: glowSize,
          height: glowSize,
          background:
            "radial-gradient(circle, rgba(220,184,90,0.55) 0%, rgba(19,79,64,0.35) 45%, transparent 72%)",
        }}
      />
      <span
        className="relative inline-flex overflow-hidden rounded-full ring-1 ring-gold-300/70 shadow-[0_0_16px_rgba(220,184,90,0.45)]"
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo-mark.png"
          alt="Ojaskaraa Builders"
          fill
          sizes={`${size}px`}
          className="object-cover"
          priority
        />
      </span>
    </span>
  );
}
