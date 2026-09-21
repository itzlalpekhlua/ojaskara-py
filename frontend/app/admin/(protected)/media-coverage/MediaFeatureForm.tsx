"use client";

import { useState } from "react";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { SaveForm } from "@/components/admin/SaveForm";
import { SaveButton } from "@/components/admin/SaveButton";

const inputClass =
  "mt-1 w-full rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:border-gold-400";
const labelClass = "block text-xs uppercase tracking-wide text-bone/50";

const typeOptions = [
  { value: "article", label: "News article" },
  { value: "podcast", label: "Podcast" },
  { value: "interview", label: "Interview" },
  { value: "tv", label: "TV / video feature" },
] as const;

export function MediaFeatureForm({
  action,
  initial,
  submitLabel = "Save",
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: {
    title?: string;
    outlet?: string;
    type?: string;
    url?: string;
    thumbnail?: string | null;
  };
  submitLabel?: string;
}) {
  const [thumbnail, setThumbnail] = useState<string | null>(initial?.thumbnail ?? null);

  return (
    <SaveForm action={action} className="space-y-3">
      <input type="hidden" name="thumbnail" value={thumbnail ?? ""} />

      <div>
        <label className={labelClass}>Title / headline</label>
        <input name="title" required defaultValue={initial?.title} className={inputClass} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Outlet / channel</label>
          <input
            name="outlet"
            required
            placeholder="e.g. Kantipur Daily, ABC Podcast"
            defaultValue={initial?.outlet}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Type</label>
          <select name="type" defaultValue={initial?.type ?? "article"} className={inputClass}>
            {typeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Link</label>
        <input name="url" required placeholder="https://..." defaultValue={initial?.url} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Thumbnail</label>
        {thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumbnail} alt="" className="mt-1 h-24 w-24 rounded-md object-cover" />
        )}
        <div className="mt-1">
          <MediaUploader
            section="media-coverage"
            accept="image/*"
            label={thumbnail ? "Replace thumbnail" : "Upload thumbnail"}
            onUploaded={(r) => setThumbnail(r.url)}
          />
        </div>
      </div>

      <SaveButton label={submitLabel} />
    </SaveForm>
  );
}
