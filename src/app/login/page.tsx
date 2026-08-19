"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, ADMIN_EMAILS } from "@/context/AuthContext";
import { ArrowRight, Check, Sparkles, User, Mail, Lock, Phone } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, isAdmin, login, signInWithSocial } = useAuth();

  const [mode, setMode] = useState<"LOGIN" | "REGISTER">("LOGIN");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Si ya está autenticado, redirigir
  React.useEffect(() => {
    if (user) {
      if (isAdmin) {
        router.push("/admin");
      } else {
        router.push("/shop");
      }
    }
  }, [user, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (mode === "REGISTER") {
      if (password !== confirmPassword) {
        setErrorMessage("Las contraseñas no coinciden.");
        return;
      }
      if (password.length < 6) {
        setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
    }

    setIsSubmitting(true);

    const res = login(email, password, name || undefined);
    if (!res.success) {
      setErrorMessage(res.error || "Ocurrió un error.");
      setIsSubmitting(false);
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const isAdminUser = ADMIN_EMAILS.some((adm) => adm.toLowerCase() === cleanEmail);

    if (mode === "REGISTER") {
      try {
        await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email: cleanEmail, phone }),
        });
      } catch (err) {
        console.warn("Error enviando confirmación de correo:", err);
      }
      setSuccessMessage("¡Cuenta creada exitosamente! Se ha enviado un correo de confirmación a tu bandeja de entrada.");
    }

    setTimeout(() => {
      setIsSubmitting(false);
      if (isAdminUser) {
        router.push("/admin");
      } else {
        router.push("/shop");
      }
    }, 1200);
  };

  const handleSocialLogin = async (provider: "Google" | "Facebook") => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const p = provider.toLowerCase() as "google" | "facebook";
      const res = await signInWithSocial(p);
      if (!res.success) {
        setErrorMessage(res.error || `Error al conectar con ${provider}. Verifica las credenciales en Supabase.`);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Error al iniciar sesión.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 md:py-20 bg-background">
      <div className="max-w-md w-full bg-white p-7 sm:p-10 border border-charcoal-200 shadow-sm space-y-6">
        {/* Logo y Encabezado */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block py-1">
            <img
              src="/img/anida-wordmark.svg"
              alt="ANIDA"
              className="h-7 sm:h-9 w-auto object-contain mx-auto"
            />
          </Link>
          <h1 className="text-xl sm:text-2xl font-light tracking-tight text-charcoal-950 uppercase">
            {mode === "LOGIN" ? "Bienvenido a ANIDA" : "Crear Nueva Cuenta"}
          </h1>
          <p className="text-xs text-charcoal-500 font-light max-w-xs mx-auto">
            {mode === "LOGIN"
              ? "Ingresa a tu perfil para gestionar tus pedidos y prendas favoritas."
              : "Regístrate para compras rápidas, seguimiento de órdenes y lanzamientos exclusivos."}
          </p>
        </div>

        {/* Selector de Pestañas: Iniciar Sesión / Registro */}
        <div className="flex border-b border-charcoal-200">
          <button
            type="button"
            onClick={() => {
              setMode("LOGIN");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-center transition-all relative ${
              mode === "LOGIN"
                ? "text-charcoal-950 border-b-2 border-charcoal-950"
                : "text-charcoal-400 hover:text-charcoal-700"
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("REGISTER");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-center transition-all relative ${
              mode === "REGISTER"
                ? "text-charcoal-950 border-b-2 border-charcoal-950"
                : "text-charcoal-400 hover:text-charcoal-700"
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        {/* Botones de Inicio de Sesión Rápido (Google, Facebook, Apple) */}
        <div className="space-y-2.5">
          <span className="block text-[10px] uppercase tracking-widest text-charcoal-400 text-center font-medium">
            Acceso Rápido con Redes
          </span>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleSocialLogin("Google")}
              disabled={isSubmitting}
              className="flex items-center justify-center space-x-2 py-2.5 px-3 border border-charcoal-200 hover:border-charcoal-900 bg-white hover:bg-charcoal-50 text-xs text-charcoal-800 transition-colors shadow-2xs font-medium"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span className="truncate">Google</span>
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={() => handleSocialLogin("Facebook")}
              disabled={isSubmitting}
              className="flex items-center justify-center space-x-2 py-2.5 px-3 border border-charcoal-200 hover:border-charcoal-900 bg-white hover:bg-charcoal-50 text-xs text-charcoal-800 transition-colors shadow-2xs font-medium"
            >
              <svg className="w-4 h-4 shrink-0 fill-[#1877F2]" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="truncate">Facebook</span>
            </button>
          </div>
        </div>

        {/* Separador */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-charcoal-200" />
          <span className="absolute bg-white px-3 text-[10px] uppercase tracking-widest text-charcoal-400 font-medium">
            o con tu correo
          </span>
        </div>

        {/* Mensajes de Alerta */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-1.5">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Formulario Principal */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === "REGISTER" && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-charcoal-700 font-medium">
                  Nombre Completo *
                </label>
                <input
                  required
                  type="text"
                  placeholder="ej. Mariana Torres"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white focus:outline-none focus:border-charcoal-900 text-xs uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-charcoal-700 font-medium">
                  Teléfono / WhatsApp (Opcional)
                </label>
                <input
                  type="tel"
                  placeholder="999 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white focus:outline-none focus:border-charcoal-900 text-xs"
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-charcoal-700 font-medium">
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
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-wider text-charcoal-700 font-medium">
                Contraseña *
              </label>
              {mode === "LOGIN" && (
                <button
                  type="button"
                  onClick={() => alert("Ingresa tu correo para recibir las instrucciones de recuperación.")}
                  className="text-[10px] text-charcoal-500 hover:text-charcoal-950 underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </div>
            <input
              required
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white focus:outline-none focus:border-charcoal-900 text-xs"
            />
          </div>

          {mode === "REGISTER" && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-charcoal-700 font-medium">
                Confirmar Contraseña *
              </label>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white focus:outline-none focus:border-charcoal-900 text-xs"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-charcoal-950 text-white text-xs font-semibold tracking-widest uppercase hover:bg-charcoal-800 transition-colors shadow-xs flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
          >
            <span>
              {isSubmitting
                ? "Procesando..."
                : mode === "LOGIN"
                ? "Iniciar Sesión"
                : "Crear Mi Cuenta"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer */}
        <div className="pt-2 text-center text-[11px] text-charcoal-400 space-y-2">
          {mode === "LOGIN" ? (
            <p>
              ¿Aún no tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => setMode("REGISTER")}
                className="font-semibold text-charcoal-900 underline"
              >
                Regístrate gratis
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes una cuenta?{" "}
              <button
                type="button"
                onClick={() => setMode("LOGIN")}
                className="font-semibold text-charcoal-900 underline"
              >
                Inicia sesión aquí
              </button>
            </p>
          )}

          <div>
            <Link href="/shop" className="hover:underline hover:text-charcoal-900 text-[10px] uppercase tracking-wider">
              ← Continuar comprando como invitado
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

