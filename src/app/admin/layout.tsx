"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, ADMIN_EMAIL } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Lock, ShieldAlert, ArrowRight } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isLoading } = useAuth();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (user && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xs text-charcoal-400 uppercase tracking-widest">
        Verificando credenciales de seguridad...
      </div>
    );
  }

  // Si no es el correo autorizado anida.store.mid@gmail.com
  if (!authorized) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 bg-charcoal-50">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 border border-charcoal-200 shadow-xl space-y-6 text-center">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-charcoal-400">
              Área Restringida
            </span>
            <h1 className="text-xl font-light tracking-tight text-charcoal-950 uppercase">
              Panel Administrativo CMS
            </h1>
            <p className="text-xs text-charcoal-500 font-light leading-relaxed">
              El acceso a este módulo está restringido exclusivamente a la cuenta oficial de administración: <br />
              <strong className="text-charcoal-900 font-mono">{ADMIN_EMAIL}</strong>
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full py-3.5 bg-charcoal-950 text-white text-xs font-semibold tracking-widest uppercase hover:bg-charcoal-800 transition-colors shadow-xs"
            >
              <span>Iniciar Sesión como Administrador</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>

            <Link
              href="/"
              className="block text-[11px] text-charcoal-500 hover:text-charcoal-950 underline uppercase tracking-wider"
            >
              Volver a la Tienda Pública
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-charcoal-50">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-x-auto">{children}</main>
    </div>
  );
}
