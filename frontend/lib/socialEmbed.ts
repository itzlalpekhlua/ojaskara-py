export type SocialEmbed = { src: string; aspect: "square" | "tall" | "wide" };

/**
 * Builds a direct iframe embed for a public Instagram/TikTok/Facebook post URL,
 * using each platform's official embed endpoint (no API key needed).
 * Returns null if the URL doesn't look like a single post/reel/video we can embed.
 */
export function getSocialEmbed(platform: string, url: string | null | undefined): SocialEmbed | null {
  if (!url) return null;

  try {
    if (platform === "INSTAGRAM") {
      const match = url.match(/instagram\.com\/(p|reel|tv)\/([^/?#]+)/i);
      if (!match) return null;
      const [, kind, code] = match;
      return { src: `https://www.instagram.com/${kind}/${code}/embed`, aspect: "tall" };
    }

    if (platform === "TIKTOK") {
      const match = url.match(/\/video\/(\d+)/);
      if (!match) return null;
      return { src: `https://www.tiktok.com/embed/v2/${match[1]}`, aspect: "tall" };
    }

    if (platform === "FACEBOOK") {
      const isVideo = /\/(reel|videos|watch)\/[\w.?=&/-]*\d/i.test(url);
      const isPost = /\/(posts|photos|permalink)\//i.test(url) || /story_fbid=/i.test(url);
      if (!isVideo && !isPost) return null;

      const plugin = isVideo ? "video.php" : "post.php";
      const href = encodeURIComponent(url);
      return {
        src: `https://www.facebook.com/plugins/${plugin}?href=${href}&show_text=false&width=400`,
        aspect: isVideo ? "tall" : "wide",
      };
    }
  } catch {
    return null;
  }

  return null;
}
