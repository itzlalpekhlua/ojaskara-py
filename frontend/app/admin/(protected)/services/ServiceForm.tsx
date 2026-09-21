"use client";

import { useState } from "react";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { SaveForm } from "@/components/admin/SaveForm";
import { SaveButton } from "@/components/admin/SaveButton";

const inputClass =
  "mt-1 w-full rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:border-gold-400";
const labelClass = "block text-xs uppercase tracking-wide text-bone/50";

export function ServiceForm({
  action,
  initial,
  parentOptions,
  submitLabel = "Save",
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: { title?: string; description?: string | null; image?: string | null; mediaType?: string };
  parentOptions?: { id: string; title: string }[];
  submitLabel?: string;
}) {
  const [image, setImage] = useState<string | null>(initial?.image ?? null);
  const [mediaType, setMediaType] = useState<"image" | "video">(
    initial?.mediaType === "video" ? "video" : "image"
  );

  return (
    <SaveForm action={action} className="space-y-3">
      <input type="hidden" name="image" value={image ?? ""} />
      <input type="hidden" name="mediaType" value={mediaType} />

      {parentOptions && (
        <div>
          <label className={labelClass}>Parent service</label>
          <select name="parentId" defaultValue="" className={inputClass}>
            <option value="">None (top-level service)</option>
            {parentOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className={labelClass}>Title</label>
        <input name="title" required defaultValue={initial?.title} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea name="description" rows={2} defaultValue={initial?.description ?? ""} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Photo or video</label>
        <div className="mt-1.5 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setMediaType("image");
              setImage(null);
            }}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              mediaType === "image" ? "bg-gold-400 text-ink-950" : "bg-white/10 text-bone/60 hover:bg-white/15"
            }`}
          >
            Photo
          </button>
          <button
            type="button"
            onClick={() => {
              setMediaType("video");
              setImage(null);
            }}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              mediaType === "video" ? "bg-gold-400 text-ink-950" : "bg-white/10 text-bone/60 hover:bg-white/15"
            }`}
          >
            Video
          </button>
        </div>

        {image && mediaType === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="mt-3 h-24 w-24 rounded-md object-cover" />
        )}
        {image && mediaType === "video" && (
          <video src={image} className="mt-3 h-24 w-40 rounded-md object-cover" muted />
        )}

        <div className="mt-2">
          <MediaUploader
            section="services"
            accept={mediaType === "video" ? "video/*" : "image/*"}
            label={image ? `Replace ${mediaType}` : `Upload ${mediaType}`}
            onUploaded={(r) => setImage(r.url)}
          />
        </div>
      </div>

      <SaveButton label={submitLabel} />
    </SaveForm>
  );
}
