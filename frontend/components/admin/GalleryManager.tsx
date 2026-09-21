"use client";

import { useTransition } from "react";
import { MediaUploader } from "@/components/admin/MediaUploader";
import { MediaGrid, type MediaGridItem } from "@/components/admin/MediaGrid";

export function GalleryManager({
  section,
  accept = "image/*,video/*",
  items,
  featuredUrl,
  onAdd,
  onDelete,
  onReorder,
  onSetFeatured,
}: {
  section: string;
  accept?: string;
  items: MediaGridItem[];
  featuredUrl?: string | null;
  onAdd: (url: string, mediaType: "image" | "video") => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onReorder: (id: string, direction: "up" | "down") => Promise<void>;
  onSetFeatured?: (item: MediaGridItem) => Promise<void>;
}) {
  const [, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <MediaUploader
        section={section}
        accept={accept}
        label="Add to gallery"
        multiple
        onUploaded={(result) => startTransition(() => onAdd(result.url, result.mediaType))}
      />
      <MediaGrid items={items} onDelete={onDelete} onReorder={onReorder} onSetFeatured={onSetFeatured} featuredUrl={featuredUrl} />
    </div>
  );
}
