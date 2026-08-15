"use client";

import React, { useState } from "react";
import { useStoreData } from "@/context/StoreDataContext";
import { convertImageToWebP } from "@/lib/imageOptimizer";
import { HomeBannerData } from "@/types";
import { Save, Check, Eye, Upload, Image as ImageIcon } from "lucide-react";

export default function AdminBannersPage() {
  const { banners, updateBanner } = useStoreData();
  const currentBanner = banners[0] || {
    id: "banner-main",
    tagline: "COLECCIÓN ATELIER",
    title: "SILUETAS PURAS & ESTRUCTURA MINIMAL",
    subtitle: "Prendas de alta confección.",
    ctaText: "DESCUBRIR COLECCIÓN",
    ctaLink: "/shop",
    mediaType: "IMAGE",
    mediaUrl: "",
    isActive: true,
  };

  const [banner, setBanner] = useState<HomeBannerData>(currentBanner);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);

  const handleBannerImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOptimizing(true);
    try {
      const result = await convertImageToWebP(file, 2000, 0.88);
      setBanner({ ...banner, mediaUrl: result.dataUrl });
      const savings = Math.round((1 - result.optimizedSize / result.originalSize) * 100);
      setCompressionInfo(
        `✓ Imagen de banner convertida a WebP (${Math.round(result.optimizedSize / 1024)} KB - ${savings}% optimizada)`
      );
    } catch (err) {
      console.error(err);
      alert("Error al procesar la imagen del banner.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBanner(banner);
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
          Los cambios se guardan y reflejan inmediatamente en la portada de la tienda.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulario de Edición */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white p-6 sm:p-8 border border-charcoal-200 shadow-xs space-y-5 text-xs">
          <div className="flex items-center space-x-2 pb-2 border-b border-charcoal-100">
            <ImageIcon className="w-4 h-4 text-charcoal-700" />
            <h2 className="text-xs font-semibold tracking-widest uppercase text-charcoal-900">
              Hero Principal de Portada
            </h2>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider text-charcoal-600 font-medium">
              Tagline Superior / Campaña
            </label>
            <input
              type="text"
              value={banner.tagline || ""}
              onChange={(e) => setBanner({ ...banner, tagline: e.target.value })}
              placeholder="ej. ATELIER 2026 // EDICIÓN CÁPSULA"
              className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white uppercase tracking-wider focus:border-charcoal-900 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider text-charcoal-600 font-medium">
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
            <label className="text-[11px] uppercase tracking-wider text-charcoal-600 font-medium">
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
              <label className="text-[11px] uppercase tracking-wider text-charcoal-600 font-medium">
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
              <label className="text-[11px] uppercase tracking-wider text-charcoal-600 font-medium">
                Enlace del Botón
              </label>
              <input
                type="text"
                value={banner.ctaLink}
                onChange={(e) => setBanner({ ...banner, ctaLink: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white focus:border-charcoal-900 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Subida de Imagen de Portada con Conversión a WebP */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-charcoal-600 font-medium">
              Fotografía de Portada (Conversión a WebP Automática)
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-charcoal-200 hover:border-charcoal-900 p-6 cursor-pointer bg-charcoal-50 transition-colors">
              <Upload className="w-6 h-6 text-charcoal-400 mb-2" />
              <span className="text-xs text-charcoal-800 font-medium">
                {banner.mediaUrl ? "Seleccionar otra imagen para reemplazar" : "Seleccionar imagen local de portada"}
              </span>
              <span className="text-[10px] text-charcoal-400 mt-0.5">Formatos: JPG, PNG, WEBP (se optimizará a alta resolución)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerImageChange}
                className="hidden"
              />
            </label>
          </div>

          {compressionInfo && (
            <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2.5 border border-emerald-200">
              {compressionInfo}
            </div>
          )}

          <div className="pt-4 flex items-center justify-between border-t border-charcoal-200">
            {savedSuccess ? (
              <span className="inline-flex items-center space-x-1.5 text-emerald-700 text-xs font-medium">
                <Check className="w-4 h-4" />
                <span>¡Banner actualizado y publicado en portada!</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              disabled={isOptimizing}
              className="px-6 py-3 bg-charcoal-950 text-white uppercase tracking-widest font-semibold hover:bg-charcoal-800 transition-colors shadow-xs disabled:opacity-50"
            >
              {isOptimizing ? "Procesando WebP..." : "Guardar & Publicar"}
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
            {banner.mediaUrl ? (
              <img
                src={banner.mediaUrl}
                alt="Vista previa de portada"
                className="w-full h-full object-cover object-top opacity-90"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-charcoal-400 p-6 text-center space-y-2">
                <ImageIcon className="w-10 h-10 stroke-1" />
                <p className="text-xs uppercase tracking-wider">Sube una imagen para previsualizar tu banner WebP</p>
              </div>
            )}
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
