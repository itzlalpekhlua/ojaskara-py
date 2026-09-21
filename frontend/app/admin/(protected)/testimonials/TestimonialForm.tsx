"use client";

import { useState } from "react";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { SaveForm } from "@/components/admin/SaveForm";
import { SaveButton } from "@/components/admin/SaveButton";

const inputClass =
  "mt-1 w-full rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:border-gold-400";
const labelClass = "block text-xs uppercase tracking-wide text-bone/50";

const kindOptions = [
  { value: "review", label: "Written review", hint: "Shows under “Testimonials” as a text quote." },
  { value: "video", label: "Video testimonial", hint: "Shows under “Testimonials” as a playable video." },
  { value: "photo", label: "Photo", hint: "Shows under “Moments” as a photo." },
] as const;

export function TestimonialForm({
  action,
  initial,
  submitLabel = "Save",
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: {
    kind?: string;
    customerName?: string;
    reviewText?: string | null;
    location?: string | null;
    rating?: number | null;
    response?: string | null;
    videoUrl?: string | null;
    thumbnail?: string | null;
  };
  submitLabel?: string;
}) {
  const [kind, setKind] = useState<"review" | "video" | "photo">(
    initial?.kind === "video" || initial?.kind === "photo" ? initial.kind : "review"
  );
  const [videoUrl, setVideoUrl] = useState<string | null>(initial?.videoUrl ?? null);
  const [thumbnail, setThumbnail] = useState<string | null>(initial?.thumbnail ?? null);

  return (
    <SaveForm action={action} className="space-y-3">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="videoUrl" value={kind === "video" ? videoUrl ?? "" : ""} />
      <input type="hidden" name="thumbnail" value={kind !== "review" ? thumbnail ?? "" : ""} />

      <div>
        <label className={labelClass}>What is this?</label>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {kindOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setKind(opt.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                kind === opt.value ? "bg-gold-400 text-ink-950" : "bg-white/10 text-bone/60 hover:bg-white/15"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-bone/40">{kindOptions.find((o) => o.value === kind)?.hint}</p>
      </div>

      <div>
        <label className={labelClass}>{kind === "photo" ? "Caption" : "Customer name"}</label>
        <input name="customerName" required defaultValue={initial?.customerName} className={inputClass} />
      </div>

      {kind === "review" && (
        <div>
          <label className={labelClass}>Review text</label>
          <textarea name="reviewText" rows={3} defaultValue={initial?.reviewText ?? ""} className={inputClass} />
        </div>
      )}

      {kind !== "photo" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Location (optional)</label>
            <input
              name="location"
              placeholder="e.g. Bharatpur, Chitwan"
              defaultValue={initial?.location ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Star rating (optional)</label>
            <select name="rating" defaultValue={initial?.rating ? String(initial.rating) : ""} className={inputClass}>
              <option value="">No rating</option>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n === 1 ? "" : "s"}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {kind === "video" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Video</label>
            {videoUrl && <video src={videoUrl} className="mt-1 h-28 w-full rounded-md object-cover" muted />}
            <div className="mt-1">
              <MediaUploader section="testimonials" accept="video/*" label={videoUrl ? "Replace video" : "Upload video"} onUploaded={(r) => setVideoUrl(r.url)} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Cover photo (optional)</label>
            {thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbnail} alt="" className="mt-1 h-28 w-full rounded-md object-cover" />
            )}
            <div className="mt-1">
              <MediaUploader section="testimonials" accept="image/*" label={thumbnail ? "Replace photo" : "Upload photo"} onUploaded={(r) => setThumbnail(r.url)} />
            </div>
          </div>
        </div>
      )}

      {kind === "photo" && (
        <div>
          <label className={labelClass}>Photo</label>
          {thumbnail && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumbnail} alt="" className="mt-1 h-28 w-full rounded-md object-cover" />
          )}
          <div className="mt-1">
            <MediaUploader section="testimonials" accept="image/*" label={thumbnail ? "Replace photo" : "Upload photo"} onUploaded={(r) => setThumbnail(r.url)} />
          </div>
        </div>
      )}

      {kind !== "photo" && (
        <div>
          <label className={labelClass}>Our response (optional)</label>
          <textarea name="response" rows={2} defaultValue={initial?.response ?? ""} className={inputClass} />
        </div>
      )}

      <SaveButton label={submitLabel} />
    </SaveForm>
  );
}
