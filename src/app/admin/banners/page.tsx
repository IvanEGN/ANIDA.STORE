"use client";

import React, { useState } from "react";
import { INITIAL_BANNERS } from "@/data/initialData";
import { HomeBannerData } from "@/types";
import { Save, Check, Eye, Image as ImageIcon } from "lucide-react";

export default function AdminBannersPage() {
  const [banner, setBanner] = useState<HomeBannerData>(INITIAL_BANNERS[0]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-200">
        <div>
          <span className="text-[11px] font-semibold tracking-widest text-charcoal-500 uppercase">
            Gestión de Contenido (CMS)
          </span>
          <h1 className="text-2xl font-light tracking-tight text-charcoal-950 uppercase">
            Banners & Textos del Inicio
          </h1>
        </div>

        <span className="text-xs text-charcoal-500">
          Los cambios se reflejan inmediatamente en la portada de la tienda.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulario de Edición */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white p-6 sm:p-8 border border-charcoal-200 shadow-xs space-y-5 text-xs">
          <div className="flex items-center space-x-2 pb-2 border-b border-charcoal-100">
            <ImageIcon className="w-4 h-4 text-charcoal-700" />
            <h2 className="text-xs font-semibold tracking-widest uppercase text-charcoal-900">
              Hero Principal de Campaña
            </h2>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider text-charcoal-600">
              Tagline Superior / Colección
            </label>
            <input
              type="text"
              value={banner.tagline || ""}
              onChange={(e) => setBanner({ ...banner, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white uppercase tracking-wider focus:border-charcoal-900 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider text-charcoal-600">
              Titular Principal (H1) *
            </label>
            <input
              required
              type="text"
              value={banner.title}
              onChange={(e) => setBanner({ ...banner, title: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white uppercase tracking-wider text-sm font-medium focus:border-charcoal-900 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider text-charcoal-600">
              Subtítulo Descriptivo
            </label>
            <textarea
              rows={3}
              value={banner.subtitle}
              onChange={(e) => setBanner({ ...banner, subtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white focus:border-charcoal-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-charcoal-600">
                Texto del Botón CTA
              </label>
              <input
                type="text"
                value={banner.ctaText}
                onChange={(e) => setBanner({ ...banner, ctaText: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white uppercase tracking-wider focus:border-charcoal-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-charcoal-600">
                Enlace de Destino (Link)
              </label>
              <input
                type="text"
                value={banner.ctaLink}
                onChange={(e) => setBanner({ ...banner, ctaLink: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white focus:border-charcoal-900 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider text-charcoal-600">
              URL de Imagen / Video en Alta Definición
            </label>
            <input
              type="url"
              value={banner.mediaUrl}
              onChange={(e) => setBanner({ ...banner, mediaUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white focus:border-charcoal-900 focus:outline-none font-mono text-[11px]"
            />
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-charcoal-200">
            {savedSuccess ? (
              <span className="inline-flex items-center space-x-1.5 text-emerald-700 text-xs font-medium">
                <Check className="w-4 h-4" />
                <span>¡Cambios publicados en vivo con éxito!</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-6 py-3 bg-charcoal-950 text-white uppercase tracking-widest font-semibold hover:bg-charcoal-800 transition-colors shadow-xs"
            >
              Publicar Cambios
            </button>
          </div>
        </form>

        {/* Vista Previa en Vivo */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-charcoal-500">
            <Eye className="w-4 h-4" />
            <span>Vista Previa en Tiempo Real</span>
          </div>

          <div className="relative aspect-[3/4] bg-charcoal-900 overflow-hidden shadow-lg border border-charcoal-300">
            <img
              src={banner.mediaUrl}
              alt="Vista previa de banner"
              className="w-full h-full object-cover object-top opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <span className="text-[9px] uppercase tracking-widest text-pastel-sand font-medium">
                {banner.tagline}
              </span>
              <h3 className="text-base sm:text-lg uppercase font-light leading-snug">
                {banner.title}
              </h3>
              <p className="text-[11px] text-white/80 line-clamp-2">
                {banner.subtitle}
              </p>
              <div className="pt-2">
                <span className="inline-block px-4 py-2 bg-white text-charcoal-950 text-[10px] uppercase font-semibold tracking-widest">
                  {banner.ctaText}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
