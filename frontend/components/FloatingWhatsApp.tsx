"use client";

import { motion } from "framer-motion";

export function FloatingWhatsApp({ phone }: { phone?: string | null }) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  const intlNumber = digits.startsWith("977") ? digits : `977${digits.replace(/^0/, "")}`;

  return (
    <motion.a
      href={`https://wa.me/${intlNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Ojaskaraa Builders on WhatsApp"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group fixed bottom-6 right-6 z-40 flex items-center gap-3"
    >
      <span className="hidden whitespace-nowrap rounded-full border border-gold-600/40 bg-ink-950/95 px-4 py-2 text-xs uppercase tracking-widest2 text-bone/80 shadow-lg backdrop-blur-sm sm:group-hover:inline-block">
        Chat With Us
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_8px_24px_rgba(0,0,0,0.5)] ring-2 ring-gold-400/50 transition-transform duration-300 group-hover:scale-105">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-40" />
        <svg viewBox="0 0 32 32" width="28" height="28" fill="#ffffff" className="relative">
          <path d="M16.02 3c-7.18 0-13 5.82-13 13 0 2.3.6 4.46 1.66 6.33L3 29l6.86-1.63A12.9 12.9 0 0 0 16.02 29c7.18 0 13-5.82 13-13s-5.82-13-13-13Zm0 23.6a10.5 10.5 0 0 1-5.36-1.47l-.38-.23-4.07.97.98-3.97-.25-.4a10.55 10.55 0 1 1 9.08 5.1Zm5.8-7.86c-.32-.16-1.88-.93-2.17-1.03-.29-.1-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.19.21-.37.24-.69.08-.32-.16-1.34-.5-2.55-1.59-.94-.84-1.58-1.88-1.76-2.2-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.55-.08-.16-.71-1.72-.98-2.35-.26-.62-.52-.54-.71-.55h-.6c-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.63 0 1.55 1.13 3.05 1.29 3.26.16.21 2.22 3.39 5.38 4.75.75.32 1.34.52 1.8.66.76.24 1.44.21 1.99.13.61-.09 1.88-.77 2.14-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37Z" />
        </svg>
      </span>
    </motion.a>
  );
}
