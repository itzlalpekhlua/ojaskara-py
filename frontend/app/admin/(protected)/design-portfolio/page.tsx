import Link from "next/link";
import { apiGet } from "@/lib/api";
import type { DesignWork } from "@/lib/types";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { ReorderButtons } from "@/components/admin/ReorderButtons";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { DesignWorkForm } from "./DesignWorkForm";
import { createDesignWork, deleteDesignWork, toggleDesignWorkPublished, reorderDesignWork } from "./actions";

// The public site (/design/[kind]/[scope]) always groups work into exactly these
// four sections — mirroring that here (instead of one flat list) is what makes the
// admin view legible: what you see maps 1:1 to what a visitor sees.
const SECTIONS = [
  { kind: "interior", scope: "residential", label: "Interior — Residential" },
  { kind: "interior", scope: "commercial", label: "Interior — Commercial" },
  { kind: "exterior", scope: "residential", label: "Exterior — Residential" },
  { kind: "exterior", scope: "commercial", label: "Exterior — Commercial" },
] as const;

export default async function DesignPortfolioAdminPage() {
  const works = (await apiGet<DesignWork[]>("/api/design-works")).sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl text-gold-metal">Design Portfolio</h1>
      <p className="mt-1 text-sm text-bone/50">
        Split into the same four sections shown on the public site. Add and reorder work within its own
        section below — reordering only moves an item within that section.
      </p>

      <div className="mt-8 space-y-10">
        {SECTIONS.map((section) => {
          const items = works.filter((w) => w.kind === section.kind && w.scope === section.scope);

          return (
            <div key={`${section.kind}-${section.scope}`}>
              <div className="flex items-baseline justify-between border-b border-white/10 pb-2">
                <h2 className="font-display text-lg text-gold-300">{section.label}</h2>
                <span className="text-xs text-bone/40">
                  {items.length} item{items.length === 1 ? "" : "s"}
                </span>
              </div>

              <details className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <summary className="cursor-pointer text-sm font-medium text-gold-300">
                  + Add to {section.label}
                </summary>
                <div className="mt-4">
                  <DesignWorkForm
                    action={createDesignWork}
                    initial={{ kind: section.kind, scope: section.scope }}
                    lockKindScope
                    submitLabel="Create & manage gallery"
                  />
                </div>
              </details>

              <div className="mt-4 space-y-3">
                {items.map((work, index) => (
                  <div key={work.id} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-4">
                    {work.featuredImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={work.featuredImage} alt="" className="h-12 w-12 rounded-md object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-white/10" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{work.title}</p>
                      <p className="truncate text-xs text-bone/50">
                        {work.roomType || "No room type"} · {work.images.length} gallery images
                      </p>
                    </div>
                    <Link href={`/admin/design-portfolio/${work.id}`} className="text-xs text-gold-300 hover:text-gold-200">
                      Manage
                    </Link>
                    <ReorderButtons
                      canMoveUp={index > 0}
                      canMoveDown={index < items.length - 1}
                      onMoveUp={async () => {
                        "use server";
                        await reorderDesignWork(work.id, "up");
                      }}
                      onMoveDown={async () => {
                        "use server";
                        await reorderDesignWork(work.id, "down");
                      }}
                    />
                    <PublishToggle
                      published={work.published}
                      onToggle={async (next) => {
                        "use server";
                        await toggleDesignWorkPublished(work.id, next);
                      }}
                    />
                    <ConfirmDeleteButton
                      onDelete={async () => {
                        "use server";
                        await deleteDesignWork(work.id);
                      }}
                    />
                  </div>
                ))}
                {items.length === 0 && <p className="text-sm text-bone/40">Nothing here yet.</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
