import { apiGet } from "@/lib/api";
import type { MediaFeature } from "@/lib/types";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { ReorderButtons } from "@/components/admin/ReorderButtons";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { MediaFeatureForm } from "./MediaFeatureForm";
import {
  createMediaFeature,
  updateMediaFeature,
  deleteMediaFeature,
  toggleMediaFeaturePublished,
  reorderMediaFeature,
} from "./actions";

export default async function MediaCoverageAdminPage() {
  const features = (await apiGet<MediaFeature[]>("/api/media-features")).sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl text-gold-metal">Media Coverage</h1>
      <p className="mt-1 text-sm text-bone/50">
        Press mentions, podcast appearances, interviews, and newspaper features shown on the homepage.
      </p>

      <details className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-4">
        <summary className="cursor-pointer text-sm font-medium text-gold-300">+ Add feature</summary>
        <div className="mt-4">
          <MediaFeatureForm action={createMediaFeature} submitLabel="Add" />
        </div>
      </details>

      <div className="mt-6 space-y-3">
        {features.map((f, index) => (
          <div key={f.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-3">
              {f.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.thumbnail} alt="" className="h-12 w-12 rounded-md object-cover" />
              ) : (
                <div className="h-12 w-12 rounded-md bg-white/10" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">{f.title}</p>
                  <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-bone/50">
                    {f.type}
                  </span>
                </div>
                <p className="truncate text-xs text-bone/50">{f.outlet}</p>
              </div>
              <ReorderButtons
                canMoveUp={index > 0}
                canMoveDown={index < features.length - 1}
                onMoveUp={async () => {
                  "use server";
                  await reorderMediaFeature(f.id, "up");
                }}
                onMoveDown={async () => {
                  "use server";
                  await reorderMediaFeature(f.id, "down");
                }}
              />
              <PublishToggle
                published={f.published}
                onToggle={async (next) => {
                  "use server";
                  await toggleMediaFeaturePublished(f.id, next);
                }}
              />
              <ConfirmDeleteButton
                onDelete={async () => {
                  "use server";
                  await deleteMediaFeature(f.id);
                }}
              />
            </div>

            <details className="mt-3">
              <summary className="cursor-pointer text-xs text-bone/50">Edit</summary>
              <div className="mt-3">
                <MediaFeatureForm action={updateMediaFeature.bind(null, f.id)} initial={f} submitLabel="Save changes" />
              </div>
            </details>
          </div>
        ))}
        {features.length === 0 && <p className="text-sm text-bone/40">No media coverage yet.</p>}
      </div>
    </div>
  );
}
