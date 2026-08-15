import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin CMS | anida.store",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-charcoal-50">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-x-auto">{children}</main>
    </div>
  );
}
