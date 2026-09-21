import { apiAdmin } from "@/lib/api";
import type { Enquiry } from "@/lib/types";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { markEnquiryStatus, deleteEnquiry } from "./actions";

const statusStyle: Record<string, string> = {
  new: "bg-gold-400/20 text-gold-300",
  read: "bg-white/10 text-bone/60",
  handled: "bg-emerald-500/20 text-emerald-300",
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}

export default async function EnquiriesAdminPage() {
  const enquiries = await apiAdmin<Enquiry[]>("/api/admin/enquiries");
  const newCount = enquiries.filter((e) => e.status === "new").length;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl text-gold-metal">Enquiries</h1>
      <p className="mt-1 text-sm text-bone/50">
        Messages people send through the “Contact” form on your website.
        {newCount > 0 && <span className="ml-2 text-gold-300">{newCount} new</span>}
      </p>

      <div className="mt-6 space-y-3">
        {enquiries.length === 0 && (
          <p className="text-sm text-bone/40">No enquiries yet. They'll show up here as soon as someone submits the contact form.</p>
        )}

        {enquiries.map((e) => (
          <div key={e.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-bone">{e.name}</p>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${statusStyle[e.status] || statusStyle.new}`}>
                    {e.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-bone/50">{formatDate(e.createdAt)}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                {e.status !== "read" && (
                  <form action={async () => { "use server"; await markEnquiryStatus(e.id, "read"); }}>
                    <button type="submit" className="rounded-md border border-white/15 px-2.5 py-1 text-xs text-bone/60 hover:bg-white/5">
                      Mark read
                    </button>
                  </form>
                )}
                {e.status !== "handled" && (
                  <form action={async () => { "use server"; await markEnquiryStatus(e.id, "handled"); }}>
                    <button type="submit" className="rounded-md border border-emerald-400/30 px-2.5 py-1 text-xs text-emerald-300 hover:bg-emerald-400/10">
                      Mark handled
                    </button>
                  </form>
                )}
                <ConfirmDeleteButton onDelete={async () => { "use server"; await deleteEnquiry(e.id); }} />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
              <a href={`mailto:${e.email}`} className="text-gold-300 hover:underline">{e.email}</a>
              {e.phone && <a href={`tel:${e.phone}`} className="text-gold-300 hover:underline">{e.phone}</a>}
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm text-bone/70">{e.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
