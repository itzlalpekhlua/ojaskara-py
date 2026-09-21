import { apiGet } from "@/lib/api";
import type { SiteSettings } from "@/lib/types";
import { HeroVideoManager } from "@/components/admin/HeroVideoManager";
import { setHeroVideo, resetHeroVideo } from "./actions";

export default async function HeroAdminPage() {
  const settings = await apiGet<SiteSettings>("/api/settings");

  return (
    <div>
      <h1 className="font-display text-2xl text-gold-metal">Introduction Video</h1>
      <p className="mt-1 text-sm text-bone/50">The background video on the homepage's first page.</p>

      <div className="mt-6">
        <HeroVideoManager currentUrl={settings?.heroVideoUrl ?? null} onSet={setHeroVideo} onReset={resetHeroVideo} />
      </div>
    </div>
  );
}
