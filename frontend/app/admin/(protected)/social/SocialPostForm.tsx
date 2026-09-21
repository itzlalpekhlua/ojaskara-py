"use client";

import { useState } from "react";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { SaveForm } from "@/components/admin/SaveForm";
import { SaveButton } from "@/components/admin/SaveButton";

const inputClass =
  "mt-1 w-full rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:border-gold-400";
const labelClass = "block text-xs uppercase tracking-wide text-bone/50";

export function SocialPostForm({
  action,
  initial,
  submitLabel = "Save",
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: { platform?: string; embedUrl?: string; caption?: string | null; thumbnail?: string | null };
  submitLabel?: string;
}) {
  const [thumbnail, setThumbnail] = useState<string | null>(initial?.thumbnail ?? null);

  return (
    <SaveForm action={action} className="space-y-3">
      <input type="hidden" name="thumbnail" value={thumbnail ?? ""} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Platform</label>
          <select name="platform" defaultValue={initial?.platform ?? "instagram"} className={inputClass}>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="tiktok">TikTok</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Post link</label>
          <input name="embedUrl" required defaultValue={initial?.embedUrl} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Caption</label>
        <textarea name="caption" rows={2} defaultValue={initial?.caption ?? ""} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Thumbnail</label>
        {thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbnail} alt="" className="mt-1 h-24 w-24 rounded-md object-cover" />
        )}
        <div className="mt-1">
          <MediaUploader section="social" accept="image/*" label={thumbnail ? "Replace thumbnail" : "Upload thumbnail"} onUploaded={(r) => setThumbnail(r.url)} />
        </div>
      </div>

      <SaveButton label={submitLabel} />
    </SaveForm>
  );
}
