const glyphs: Record<string, React.ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </>
  ),
  facebook: (
    <path
      d="M14.5 8.5H16.5V5.5H14.5C12.29 5.5 10.5 7.29 10.5 9.5V11.5H8.5V14.5H10.5V19.5H13.5V14.5H15.7L16.2 11.5H13.5V9.5C13.5 8.95 13.95 8.5 14.5 8.5Z"
      fill="currentColor"
    />
  ),
  tiktok: (
    <path
      d="M15.5 4c.3 1.9 1.6 3.4 3.5 3.7v2.6c-1.3 0-2.5-.4-3.5-1.1v6.1c0 3-2.4 5.2-5.2 5.2S5 18.3 5 15.3s2.4-5.2 5.2-5.2c.3 0 .6 0 .9.1v2.7a2.5 2.5 0 1 0 1.7 2.4V4h2.7Z"
      fill="currentColor"
    />
  ),
  whatsapp: (
    <path
      d="M16.02 3c-7.18 0-13 5.82-13 13 0 2.3.6 4.46 1.66 6.33L3 29l6.86-1.63A12.9 12.9 0 0 0 16.02 29c7.18 0 13-5.82 13-13s-5.82-13-13-13Zm0 23.6a10.5 10.5 0 0 1-5.36-1.47l-.38-.23-4.07.97.98-3.97-.25-.4a10.55 10.55 0 1 1 9.08 5.1Zm5.8-7.86c-.32-.16-1.88-.93-2.17-1.03-.29-.1-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.19.21-.37.24-.69.08-.32-.16-1.34-.5-2.55-1.59-.94-.84-1.58-1.88-1.76-2.2-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.55-.08-.16-.71-1.72-.98-2.35-.26-.62-.52-.54-.71-.55h-.6c-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.63 0 1.55 1.13 3.05 1.29 3.26.16.21 2.22 3.39 5.38 4.75.75.32 1.34.52 1.8.66.76.24 1.44.21 1.99.13.61-.09 1.88-.77 2.14-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37Z"
      fill="currentColor"
      transform="scale(0.72) translate(1.5,1.5)"
    />
  ),
};

export type SocialPlatformKey = keyof typeof glyphs;

export function SocialIcon({ platform, size = 20 }: { platform: SocialPlatformKey; size?: number }) {
  const viewBox = platform === "whatsapp" ? "0 0 32 32" : "0 0 24 24";
  return (
    <svg width={size} height={size} viewBox={viewBox}>
      {glyphs[platform]}
    </svg>
  );
}

const platformOrder: { key: SocialPlatformKey; label: string }[] = [
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "tiktok", label: "TikTok" },
  { key: "whatsapp", label: "WhatsApp" },
];

export function SocialIconRow({
  instagramUrl,
  facebookUrl,
  tiktokUrl,
  whatsappUrl,
  size = "md",
}: {
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  tiktokUrl?: string | null;
  whatsappUrl?: string | null;
  size?: "sm" | "md";
}) {
  const urls: Record<SocialPlatformKey, string | null | undefined> = {
    instagram: instagramUrl,
    facebook: facebookUrl,
    tiktok: tiktokUrl,
    whatsapp: whatsappUrl,
  };
  const dim = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const iconSize = size === "sm" ? 16 : 18;

  return (
    <div className="flex items-center gap-3">
      {platformOrder.map(({ key, label }) => {
        const url = urls[key];
        if (!url) return null;
        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`group relative flex ${dim} items-center justify-center border border-gold-600/40 text-bone/70 transition-all duration-300 hover:border-gold-300 hover:text-gold-200`}
          >
            <svg className="absolute inset-0" viewBox="0 0 44 44">
              <rect
                x="6"
                y="6"
                width="32"
                height="32"
                transform="rotate(45 22 22)"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-gold-600/30 transition-colors duration-300 group-hover:text-gold-400/60"
              />
            </svg>
            <span className="relative">
              <SocialIcon platform={key} size={iconSize} />
            </span>
          </a>
        );
      })}
    </div>
  );
}
