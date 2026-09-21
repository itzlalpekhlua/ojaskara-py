"use client";

import { useState } from "react";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { SaveForm } from "@/components/admin/SaveForm";
import { SaveButton } from "@/components/admin/SaveButton";

const inputClass =
  "mt-1 w-full rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:border-gold-400";
const labelClass = "block text-xs uppercase tracking-wide text-bone/50";

export function ConstructionProjectForm({
  action,
  initial,
  submitLabel = "Save",
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: { title?: string; categoryLabel?: string | null; location?: string | null; featuredImage?: string | null };
  submitLabel?: string;
}) {
  const [featuredImage, setFeaturedImage] = useState<string | null>(initial?.featuredImage ?? null);

  return (
    <SaveForm action={action} className="space-y-3">
      <input type="hidden" name="featuredImage" value={featuredImage ?? ""} />

      <div>
        <label className={labelClass}>Title</label>
        <input name="title" required defaultValue={initial?.title} className={inputClass} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Category label</label>
          <input name="categoryLabel" defaultValue={initial?.categoryLabel ?? ""} placeholder="e.g. Warehouse" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input name="location" defaultValue={initial?.location ?? ""} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Featured image</label>
        {featuredImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={featuredImage} alt="" className="mt-1 h-28 w-28 rounded-md object-cover" />
        )}
        <div className="mt-1">
          <MediaUploader
            section="construction-projects"
            accept="image/*"
            label={featuredImage ? "Replace featured image" : "Upload featured image"}
            onUploaded={(r) => setFeaturedImage(r.url)}
          />
        </div>
      </div>

      <SaveButton label={submitLabel} />
    </SaveForm>
  );
}
