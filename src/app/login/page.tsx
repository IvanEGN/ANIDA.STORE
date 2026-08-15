"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, ADMIN_EMAIL } from "@/context/AuthContext";
import { Lock, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const res = login(email, password);
    if (!res.success) {
      setErrorMessage(res.error || "Ocurrió un error.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      router.push("/admin");
    } else {
      router.push("/shop");
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-background">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 border border-charcoal-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-charcoal-400">
            anida.store
          </span>
          <h1 className="text-2xl font-light tracking-tight text-charcoal-950 uppercase">
            Iniciar Sesión
          </h1>
          <p className="text-xs text-charcoal-500 font-light max-w-xs mx-auto">
            Accede a tu cuenta personal o administración.
          </p>
        </div>

        {/* Nota informativa para clientes */}
        <div className="bg-charcoal-50 p-3.5 border border-charcoal-200 text-[11px] text-charcoal-600 space-y-1">
          <p className="font-semibold text-charcoal-900 uppercase tracking-wider">
            💡 ¿Vas a comprar una prenda?
          </p>
          <p>
            No es obligatorio iniciar sesión para realizar pedidos en anida.store, pero tener cuenta te permite consultar el estado de tus envíos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {errorMessage}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-charcoal-600 font-medium">
              Correo Electrónico *
            </label>
            <input
              required
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white focus:outline-none focus:border-charcoal-900 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-charcoal-600 font-medium">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white focus:outline-none focus:border-charcoal-900 text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-charcoal-950 text-white text-xs font-semibold tracking-widest uppercase hover:bg-charcoal-800 transition-colors shadow-xs flex items-center justify-center space-x-2"
          >
            <span>{isSubmitting ? "Ingresando..." : "Acceder"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] text-charcoal-400">
          <Link href="/shop" className="hover:underline hover:text-charcoal-900">
            ← Continuar comprando como invitado
          </Link>
        </div>
      </div>
    </div>
  );
}
