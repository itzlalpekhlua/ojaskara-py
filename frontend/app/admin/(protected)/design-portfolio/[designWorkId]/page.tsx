import Link from "next/link";
import { notFound } from "next/navigation";
import { apiGetOrNull } from "@/lib/api";
import type { DesignWork } from "@/lib/types";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { DesignWorkForm } from "../DesignWorkForm";
import {
  updateDesignWork,
  addDesignWorkImage,
  deleteDesignWorkImage,
  reorderDesignWorkImage,
  setDesignWorkFeaturedImage,
} from "../actions";

export default async function DesignWorkDetailPage({ params }: { params: Promise<{ designWorkId: string }> }) {
  const { designWorkId } = await params;
  const work = await apiGetOrNull<DesignWork>(`/api/design-works/${designWorkId}`);

  if (!work) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/design-portfolio" className="text-xs text-bone/50 hover:text-bone">
        ← Back to Design Portfolio
      </Link>
      <h1 className="mt-2 font-display text-2xl text-gold-metal">{work.title}</h1>
      <p className="mt-1 text-xs capitalize text-bone/40">
        {work.kind} · {work.scope} section
      </p>

      <section className="mt-6">
        <h2 className="text-sm font-medium text-bone/70">Details</h2>
        <div className="mt-2">
          <DesignWorkForm action={updateDesignWork.bind(null, work.id)} initial={work} submitLabel="Save changes" />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-bone/70">Gallery images</h2>
        <div className="mt-2">
          <GalleryManager
            section="design-portfolio"
            accept="image/*"
            items={[...work.images].sort((a, b) => a.order - b.order).map((img) => ({ id: img.id, url: img.url, mediaType: "image" as const, alt: img.alt }))}
            featuredUrl={work.featuredImage}
            onAdd={async (url) => {
              "use server";
              await addDesignWorkImage(work.id, url);
            }}
            onDelete={async (id) => {
              "use server";
              await deleteDesignWorkImage(id);
            }}
            onReorder={async (id, direction) => {
              "use server";
              await reorderDesignWorkImage(id, direction);
            }}
            onSetFeatured={async (item) => {
              "use server";
              await setDesignWorkFeaturedImage(work.id, item.url);
            }}
          />
        </div>
      </section>
    </div>
  );
}
