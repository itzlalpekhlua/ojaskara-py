import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { apiAdmin } from "@/lib/api";
import type { Enquiry } from "@/lib/types";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/login");
  }

  const enquiries = await apiAdmin<Enquiry[]>("/api/admin/enquiries");
  const newEnquiryCount = enquiries.filter((e) => e.status === "new").length;

  return (
    <div className="flex min-h-screen bg-ink-950 text-bone">
      <AdminSidebar email={user.email} newEnquiryCount={newEnquiryCount} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
