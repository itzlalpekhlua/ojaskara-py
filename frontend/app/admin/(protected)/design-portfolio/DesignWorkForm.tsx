"use client";

import { useState } from "react";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { SaveForm } from "@/components/admin/SaveForm";
import { SaveButton } from "@/components/admin/SaveButton";

const inputClass =
  "mt-1 w-full rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:border-gold-400";
const labelClass = "block text-xs uppercase tracking-wide text-bone/50";

const kindLabels: Record<string, string> = { interior: "Interior", exterior: "Exterior" };
const scopeLabels: Record<string, string> = { residential: "Residential", commercial: "Commercial" };

export function DesignWorkForm({
  action,
  initial,
  submitLabel = "Save",
  lockKindScope = false,
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: { title?: string; kind?: string; scope?: string; roomType?: string | null; description?: string | null; featuredImage?: string | null };
  submitLabel?: string;
  /** When true, kind/scope are fixed (shown as a label, not a dropdown) — used when
   * adding an item directly inside one of the four grouped sections, so it can't
   * accidentally land in a different section than the one it was added from. */
  lockKindScope?: boolean;
}) {
  const [featuredImage, setFeaturedImage] = useState<string | null>(initial?.featuredImage ?? null);
  const kind = initial?.kind ?? "interior";
  const scope = initial?.scope ?? "residential";

  return (
    <SaveForm action={action} className="space-y-3">
      <input type="hidden" name="featuredImage" value={featuredImage ?? ""} />

      <div>
        <label className={labelClass}>Title</label>
        <input name="title" required defaultValue={initial?.title} className={inputClass} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {lockKindScope ? (
          <div className="sm:col-span-2">
            <label className={labelClass}>Section</label>
            <input type="hidden" name="kind" value={kind} />
            <input type="hidden" name="scope" value={scope} />
            <p className={`${inputClass} flex items-center text-bone/70`}>
              {kindLabels[kind]} · {scopeLabels[scope]}
            </p>
          </div>
        ) : (
          <>
            <div>
              <label className={labelClass}>Kind</label>
              <select name="kind" defaultValue={kind} className={inputClass}>
                <option value="interior">Interior</option>
                <option value="exterior">Exterior</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Scope</label>
              <select name="scope" defaultValue={scope} className={inputClass}>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
          </>
        )}
        <div>
          <label className={labelClass}>Room type</label>
          <input name="roomType" defaultValue={initial?.roomType ?? ""} placeholder="e.g. Living Room" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea name="description" rows={3} defaultValue={initial?.description ?? ""} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Featured image</label>
        {featuredImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={featuredImage} alt="" className="mt-1 h-28 w-28 rounded-md object-cover" />
        )}
        <div className="mt-1">
          <MediaUploader
            section="design-portfolio"
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
