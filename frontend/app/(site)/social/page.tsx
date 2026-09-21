import Image from "next/image";
import { apiGet } from "@/lib/api";
import type { SiteSettings, SocialPost } from "@/lib/types";
import { GoldLabel } from "@/components/ui/GoldLabel";
import { Reveal } from "@/components/ui/Reveal";
import { LionMark } from "@/components/LionMark";
import { SocialIcon, SocialIconRow, type SocialPlatformKey } from "@/components/SocialIcons";
import { getSocialEmbed } from "@/lib/socialEmbed";

const platformKeyMap: Record<string, { urlField: "instagramUrl" | "facebookUrl" | "tiktokUrl"; icon: SocialPlatformKey }> = {
  INSTAGRAM: { urlField: "instagramUrl", icon: "instagram" },
  FACEBOOK: { urlField: "facebookUrl", icon: "facebook" },
  TIKTOK: { urlField: "tiktokUrl", icon: "tiktok" },
};

const platformBadge: Record<string, string> = {
  INSTAGRAM: "bg-gradient-to-br from-fuchsia-500 via-pink-500 to-amber-400 text-white",
  FACEBOOK: "bg-[#1877F2] text-white",
  TIKTOK: "bg-ink-950 text-cyan-300 ring-1 ring-cyan-400/50",
};

function handleFromUrl(url?: string | null) {
  if (!url) return null;
  const match = url.replace(/\/+$/, "").match(/([^/]+)$/);
  return match ? `@${match[1].replace(/^@/, "")}` : null;
}

function splitCaption(caption: string | null | undefined) {
  if (!caption) return { body: null, tags: [] as string[] };
  const words = caption.split(/\s+/);
  const tags = words.filter((w) => w.startsWith("#"));
  const body = words.filter((w) => !w.startsWith("#")).join(" ");
  return { body: body || null, tags };
}

export default async function SocialPage() {
  const [allPosts, settings] = await Promise.all([
    apiGet<SocialPost[]>("/api/social-posts"),
    apiGet<SiteSettings>("/api/settings"),
  ]);
  const posts = allPosts.filter((p) => p.published).sort((a, b) => a.order - b.order);
  const primaryHandle = handleFromUrl(settings?.instagramUrl) || "@ojaskaraa_builders";

  return (
    <div className="relative overflow-hidden bg-ink-950 pt-32 pb-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-purple-900/25 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6 text-center md:px-10">
        <Reveal>
          <GoldLabel>Official Social Media & Reels Feed</GoldLabel>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-4 font-display text-5xl font-bold text-gold-3d sm:text-6xl md:text-7xl">
            Direct from {primaryHandle}
          </h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-xl text-base text-bone/60 sm:text-lg">
            Real moments from our job sites and finished projects — straight from our Instagram, Facebook and TikTok pages.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-8 flex justify-center">
            <SocialIconRow
              instagramUrl={settings?.instagramUrl}
              facebookUrl={settings?.facebookUrl}
              tiktokUrl={settings?.tiktokUrl}
              whatsappUrl={settings?.whatsappUrl}
            />
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.length === 0 && <p className="text-bone/40">[FILL: Social posts coming soon]</p>}
          {posts.map((p, i) => {
            const meta = platformKeyMap[p.platform];
            const href = (meta && settings?.[meta.urlField]) || p.embedUrl || "#";
            const handle = handleFromUrl(p.embedUrl);
            const { body, tags } = splitCaption(p.caption);
            const badgeClass = platformBadge[p.platform] || "bg-ink-800 text-bone";
            const embed = getSocialEmbed(p.platform, p.embedUrl);

            return (
              <Reveal key={p.id} delay={i * 0.08}>
                <div className="group relative overflow-hidden rounded-2xl bg-ink-900 text-left ring-1 ring-gold-700/25 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.8)] transition-transform duration-500 hover:-translate-y-1">
                  <div className="flex items-center gap-2.5 px-4 py-3">
                    <LionMark size={26} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-bone">Ojaskaraa Builders</p>
                      {handle && <p className="truncate text-[11px] text-bone/45">{handle}</p>}
                    </div>
                    <span
                      className={`shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide shadow-lg ${badgeClass}`}
                    >
                      {meta && <SocialIcon platform={meta.icon} size={12} />}
                      {p.platform === "TIKTOK" ? "TikTok" : p.platform.charAt(0) + p.platform.slice(1).toLowerCase()}
                    </span>
                  </div>

                  {embed ? (
                    <div className={`relative w-full overflow-hidden bg-black ${embed.aspect === "tall" ? "aspect-[9/16]" : "aspect-[4/5]"}`}>
                      <iframe
                        src={embed.src}
                        loading="lazy"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full border-0"
                      />
                    </div>
                  ) : (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="relative block aspect-[9/16] w-full overflow-hidden">
                      {p.thumbnail ? (
                        <Image
                          src={p.thumbnail}
                          alt={p.caption || p.platform}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-contain saturate-[1.08] contrast-[1.03] transition-transform duration-[1200ms] ease-luxe group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-bone/30 text-xs">[FILL]</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/15 via-transparent to-gold-500/10 mix-blend-overlay" />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(8,4,14,0.55)_100%)]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/10 to-transparent" />

                      <div className="absolute right-3 top-3 flex flex-col items-center gap-4 text-bone">
                        <ReactionGlyph kind="like" />
                        <ReactionGlyph kind="comment" />
                        <ReactionGlyph kind="share" />
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-4">
                        {body && <p className="text-sm leading-snug text-bone/90">{body}</p>}
                        {tags.length > 0 && (
                          <p className="mt-1.5 text-xs font-semibold text-gold-300">{tags.join(" ")}</p>
                        )}
                      </div>
                    </a>
                  )}

                  {embed && (body || tags.length > 0) && (
                    <div className="px-4 py-3">
                      {body && <p className="text-sm leading-snug text-bone/80">{body}</p>}
                      {tags.length > 0 && <p className="mt-1 text-xs font-semibold text-gold-300">{tags.join(" ")}</p>}
                    </div>
                  )}

                  {embed && (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="block px-4 pb-3 text-[11px] text-bone/40 hover:text-gold-300">
                      Open in {p.platform === "TIKTOK" ? "TikTok" : p.platform.charAt(0) + p.platform.slice(1).toLowerCase()} ↗
                    </a>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ReactionGlyph({ kind }: { kind: "like" | "comment" | "share" }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-950/50 backdrop-blur-sm ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105">
      {kind === "like" && (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
        </svg>
      )}
      {kind === "comment" && (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
        </svg>
      )}
      {kind === "share" && (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2 11 13" />
          <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
        </svg>
      )}
    </span>
  );
}
