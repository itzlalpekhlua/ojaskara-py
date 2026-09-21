"use client";

import { useState, useTransition } from "react";

export type MediaGridItem = {
  id: string;
  url: string;
  mediaType?: "image" | "video";
  alt?: string | null;
};

export function MediaGrid({
  items,
  onDelete,
  onReorder,
  onSetFeatured,
  featuredUrl,
}: {
  items: MediaGridItem[];
  onDelete: (id: string) => Promise<void>;
  onReorder: (id: string, direction: "up" | "down") => Promise<void>;
  onSetFeatured?: (item: MediaGridItem) => Promise<void>;
  featuredUrl?: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);

  function run(id: string, action: () => Promise<void>) {
    setPendingId(id);
    startTransition(async () => {
      await action();
      setPendingId(null);
    });
  }

  if (items.length === 0) {
    return <p className="text-sm text-bone/40">No media yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {items.map((item, index) => {
        const busy = pending && pendingId === item.id;
        const isFeatured = featuredUrl && featuredUrl === item.url;
        return (
          <div key={item.id} className="group relative overflow-hidden rounded-md border border-white/10 bg-black/20">
            <div className="relative aspect-square">
              {item.mediaType === "video" ? (
                <video src={item.url} className="h-full w-full object-cover" muted />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={item.alt ?? ""} className="h-full w-full object-cover" />
              )}
              {item.mediaType === "video" && (
                <span className="absolute left-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] uppercase text-bone/80">
                  Video
                </span>
              )}
              {isFeatured && (
                <span className="absolute right-1 top-1 rounded bg-gold-400 px-1.5 py-0.5 text-[10px] font-semibold text-ink-950">
                  Featured
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-1 bg-black/40 px-1.5 py-1">
              <div className="flex gap-0.5">
                <button
                  type="button"
                  disabled={busy || index === 0}
                  onClick={() => run(item.id, () => onReorder(item.id, "up"))}
                  className="rounded px-1 text-xs text-bone/70 hover:text-bone disabled:opacity-20"
                  title="Move earlier"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={busy || index === items.length - 1}
                  onClick={() => run(item.id, () => onReorder(item.id, "down"))}
                  className="rounded px-1 text-xs text-bone/70 hover:text-bone disabled:opacity-20"
                  title="Move later"
                >
                  ↓
                </button>
              </div>
              <div className="flex gap-1">
                {onSetFeatured && !isFeatured && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => run(item.id, () => onSetFeatured(item))}
                    className="rounded px-1 text-xs text-gold-300 hover:text-gold-200"
                    title="Set as featured"
                  >
                    ★
                  </button>
                )}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    if (window.confirm("Delete this file? This cannot be undone.")) {
                      run(item.id, () => onDelete(item.id));
                    }
                  }}
                  className="rounded px-1 text-xs text-red-400 hover:text-red-300"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
