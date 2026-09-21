function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18A13.98 13.98 0 0 1 10.94 24c0-1.45.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className}>
      <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.9l-5.2 2.61.99-5.79-4.21-4.1 5.82-.85z" />
    </svg>
  );
}

export function GoogleRatingBadge({
  rating = 5.0,
  label = "Rated on Google",
  className = "",
}: {
  rating?: number;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-3 rounded-full border border-gold-700/30 bg-ink-900/60 px-5 py-2.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] ${className}`}
    >
      <GoogleG className="h-5 w-5 shrink-0" />
      <span className="h-5 w-px bg-gold-700/30" />
      <span className="font-display text-lg text-gold-metal leading-none">{rating.toFixed(1)}</span>
      <span className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(rating) ? "fill-gold-400" : "fill-white/15"}`} />
        ))}
      </span>
      <span className="text-xs uppercase tracking-widest2 text-bone/60">{label}</span>
    </div>
  );
}
