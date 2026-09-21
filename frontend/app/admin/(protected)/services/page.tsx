import { apiGet } from "@/lib/api";
import type { Service } from "@/lib/types";
import { PublishToggle } from "@/components/admin/PublishToggle";
import { ReorderButtons } from "@/components/admin/ReorderButtons";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { ServiceForm } from "./ServiceForm";
import { createService, updateService, deleteService, toggleServicePublished, reorderService } from "./actions";

export default async function ServicesAdminPage() {
  const all = await apiGet<Service[]>("/api/services");
  const topLevel = all
    .filter((s) => !s.parentId)
    .sort((a, b) => a.order - b.order)
    .map((s) => ({
      ...s,
      children: all.filter((c) => c.parentId === s.id).sort((a, b) => a.order - b.order),
    }));

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl text-gold-metal">Services</h1>
      <p className="mt-1 text-sm text-bone/50">Top-level services and their sub-services.</p>

      <details className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-4">
        <summary className="cursor-pointer text-sm font-medium text-gold-300">+ Add service</summary>
        <div className="mt-4">
          <ServiceForm action={createService} submitLabel="Add service" parentOptions={topLevel.map((s) => ({ id: s.id, title: s.title }))} />
        </div>
      </details>

      <div className="mt-6 space-y-3">
        {topLevel.map((service, index) => (
          <div key={service.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-3">
              {service.image && service.mediaType === "video" ? (
                <video src={service.image} className="h-12 w-12 rounded-md object-cover" muted />
              ) : service.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={service.image} alt="" className="h-12 w-12 rounded-md object-cover" />
              ) : (
                <div className="h-12 w-12 rounded-md bg-white/10" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{service.title}</p>
              </div>
              <ReorderButtons
                canMoveUp={index > 0}
                canMoveDown={index < topLevel.length - 1}
                onMoveUp={async () => {
                  "use server";
                  await reorderService(service.id, "up");
                }}
                onMoveDown={async () => {
                  "use server";
                  await reorderService(service.id, "down");
                }}
              />
              <PublishToggle
                published={service.published}
                onToggle={async (next) => {
                  "use server";
                  await toggleServicePublished(service.id, next);
                }}
              />
              <ConfirmDeleteButton
                onDelete={async () => {
                  "use server";
                  await deleteService(service.id);
                }}
              />
            </div>

            <details className="mt-3">
              <summary className="cursor-pointer text-xs text-bone/50">Edit</summary>
              <div className="mt-3">
                <ServiceForm action={updateService.bind(null, service.id)} initial={service} submitLabel="Save changes" />
              </div>
            </details>

            {service.children.length > 0 && (
              <div className="ml-6 mt-4 space-y-2 border-l border-white/10 pl-4">
                {service.children.map((child, childIndex) => (
                  <div key={child.id} className="rounded-md border border-white/10 bg-white/[0.02] p-3">
                    <div className="flex items-center gap-3">
                      {child.image && child.mediaType === "video" ? (
                        <video src={child.image} className="h-9 w-9 rounded-md object-cover" muted />
                      ) : child.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={child.image} alt="" className="h-9 w-9 rounded-md object-cover" />
                      ) : (
                        <div className="h-9 w-9 rounded-md bg-white/10" />
                      )}
                      <p className="min-w-0 flex-1 truncate text-sm">{child.title}</p>
                      <ReorderButtons
                        canMoveUp={childIndex > 0}
                        canMoveDown={childIndex < service.children.length - 1}
                        onMoveUp={async () => {
                          "use server";
                          await reorderService(child.id, "up");
                        }}
                        onMoveDown={async () => {
                          "use server";
                          await reorderService(child.id, "down");
                        }}
                      />
                      <PublishToggle
                        published={child.published}
                        onToggle={async (next) => {
                          "use server";
                          await toggleServicePublished(child.id, next);
                        }}
                      />
                      <ConfirmDeleteButton
                        onDelete={async () => {
                          "use server";
                          await deleteService(child.id);
                        }}
                      />
                    </div>
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-bone/50">Edit</summary>
                      <div className="mt-3">
                        <ServiceForm action={updateService.bind(null, child.id)} initial={child} submitLabel="Save changes" />
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {topLevel.length === 0 && <p className="text-sm text-bone/40">No services yet.</p>}
      </div>
    </div>
  );
}
