"use client";

import React, { useState } from "react";
import { Lock, ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";

export const AdminAuthForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Recarga la página — el server component ahora leerá la cookie y mostrará el panel
        window.location.href = "/admin";
      } else {
        setError(data.error || "Credenciales incorrectas.");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo / Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl mb-6 shadow-2xl">
          <Lock className="w-7 h-7 text-white" />
        </div>
        <p className="text-[10px] font-bold tracking-[0.3em] text-white/40 uppercase mb-2">
          Acceso Administrativo
        </p>
        <h1 className="text-3xl font-extralight tracking-[0.15em] text-white uppercase">
          ANIDA CMS
        </h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl space-y-5"
      >
        {/* Email */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-semibold tracking-widest text-white/50 uppercase">
            Correo Electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="admin@ejemplo.com"
            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-4 py-3 text-sm outline-none focus:border-white/50 focus:bg-white/15 transition-all"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-semibold tracking-widest text-white/50 uppercase">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••••"
              className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-4 py-3 pr-12 text-sm outline-none focus:border-white/50 focus:bg-white/15 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 text-xs rounded-lg px-4 py-3 text-center">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-white text-charcoal-950 font-semibold text-xs tracking-widest uppercase py-3.5 rounded-lg hover:bg-white/90 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          )}
          {loading ? "Verificando..." : "Entrar al Panel"}
        </button>

        <p className="text-center text-[11px] text-white/30 pt-1">
          Acceso exclusivo para administradores ANIDA
        </p>
      </form>

      {/* Back link */}
      <div className="text-center mt-6">
        <a
          href="/"
          className="text-[11px] text-white/40 hover:text-white/70 transition-colors underline tracking-wider uppercase"
        >
          ← Volver a la Tienda
        </a>
      </div>
    </div>
  );
};
