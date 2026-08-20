import React from "react";
import { cookies } from "next/headers";
import { AdminAuthForm } from "@/components/admin/AdminAuthForm";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const SESSION_COOKIE = "anida_admin_session";
const SESSION_VALUE = "authenticated_admin_2025";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  const isAuthenticated = session?.value === SESSION_VALUE;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal-950 p-4">
        <AdminAuthForm />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-charcoal-50">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-x-auto">{children}</main>
    </div>
  );
}
