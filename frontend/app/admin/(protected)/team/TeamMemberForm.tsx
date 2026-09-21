"use client";

import { useState } from "react";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { SaveForm } from "@/components/admin/SaveForm";
import { SaveButton } from "@/components/admin/SaveButton";

const inputClass =
  "mt-1 w-full rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:border-gold-400";
const labelClass = "block text-xs uppercase tracking-wide text-bone/50";

export function TeamMemberForm({
  action,
  initial,
  submitLabel = "Save",
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: { name?: string; role?: string; description?: string | null; image?: string | null };
  submitLabel?: string;
}) {
  const [image, setImage] = useState<string | null>(initial?.image ?? null);

  return (
    <SaveForm action={action} className="space-y-3">
      <input type="hidden" name="image" value={image ?? ""} />

      <div>
        <label className={labelClass}>Photo</label>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="mt-1 h-24 w-24 rounded-md object-cover" />
        )}
        <div className="mt-1">
          <MediaUploader section="team" accept="image/*" label={image ? "Replace photo" : "Upload photo"} onUploaded={(r) => setImage(r.url)} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Name</label>
          <input name="name" required defaultValue={initial?.name} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Role</label>
          <input name="role" defaultValue={initial?.role} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea name="description" rows={2} defaultValue={initial?.description ?? ""} className={inputClass} />
      </div>

      <SaveButton label={submitLabel} />
    </SaveForm>
  );
}
