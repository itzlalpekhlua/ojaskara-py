import { apiGet } from "@/lib/api";
import type { Testimonial } from "@/lib/types";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { ReorderButtons } from "@/components/admin/ReorderButtons";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { TestimonialForm } from "./TestimonialForm";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialPublished,
  reorderTestimonial,
} from "./actions";

export default async function TestimonialsAdminPage() {
  const testimonials = (await apiGet<Testimonial[]>("/api/testimonials")).sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl text-gold-metal">Reviews</h1>
      <p className="mt-1 text-sm text-bone/50">
        Written reviews and video testimonials show under “Testimonials” on the site. Photos show under “Moments”.
      </p>

      <details className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-4">
        <summary className="cursor-pointer text-sm font-medium text-gold-300">+ Add a review, video, or photo</summary>
        <div className="mt-4">
          <TestimonialForm action={createTestimonial} submitLabel="Add" />
        </div>
      </details>

      <div className="mt-6 space-y-3">
        {testimonials.map((t, index) => (
          <div key={t.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-3">
              {t.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.thumbnail} alt="" className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="h-12 w-12 rounded-full bg-white/10" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{t.customerName}</p>
                  <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-bone/50">
                    {t.kind === "video" ? "Video" : t.kind === "photo" ? "Photo" : "Review"}
                  </span>
                </div>
                <p className="truncate text-xs text-bone/50">{t.reviewText || "No review text"}</p>
              </div>
              <ReorderButtons
                canMoveUp={index > 0}
                canMoveDown={index < testimonials.length - 1}
                onMoveUp={async () => {
                  "use server";
                  await reorderTestimonial(t.id, "up");
                }}
                onMoveDown={async () => {
                  "use server";
                  await reorderTestimonial(t.id, "down");
                }}
              />
              <PublishToggle
                published={t.published}
                onToggle={async (next) => {
                  "use server";
                  await toggleTestimonialPublished(t.id, next);
                }}
              />
              <ConfirmDeleteButton
                onDelete={async () => {
                  "use server";
                  await deleteTestimonial(t.id);
                }}
              />
            </div>

            <details className="mt-3">
              <summary className="cursor-pointer text-xs text-bone/50">Edit</summary>
              <div className="mt-3">
                <TestimonialForm action={updateTestimonial.bind(null, t.id)} initial={t} submitLabel="Save changes" />
              </div>
            </details>
          </div>
        ))}
        {testimonials.length === 0 && <p className="text-sm text-bone/40">No testimonials yet.</p>}
      </div>
    </div>
  );
}
