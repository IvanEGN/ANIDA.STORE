"use client";

import React, { useState } from "react";
import { useStoreData } from "@/context/StoreDataContext";
import { convertImageToWebP } from "@/lib/imageOptimizer";
import { HomeBannerData } from "@/types";
import { 
  Plus, 
  Trash2, 
  Check, 
  Eye, 
  Upload, 
  Image as ImageIcon, 
  Layers, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ToggleLeft,
  ToggleRight
} from "lucide-react";

export default function AdminBannersPage() {
  const { banners, addBanner, updateBanner, deleteBanner } = useStoreData();
  const [selectedBannerId, setSelectedBannerId] = useState<string>(banners[0]?.id || "");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Slide actual en edición
  const currentBanner = banners.find((b) => b.id === selectedBannerId) || banners[0] || {
    id: `banner-${Date.now()}`,
    tagline: "ANIDA // ALTO RENDIMIENTO",
    title: "VIVE SIN LÍMITES",
    subtitle: "Ropa deportiva con tecnología textil de vanguardia.",
    ctaText: "VER COLECCIÓN",
    ctaLink: "/shop",
    mediaType: "IMAGE" as const,
    mediaUrl: "",
    isActive: true,
  };

  const [formState, setFormState] = useState<HomeBannerData>(currentBanner);

  // Sincronizar formulario cuando cambia el slide seleccionado
  const handleSelectBanner = (banner: HomeBannerData) => {
    setSelectedBannerId(banner.id);
    setFormState(banner);
    setCompressionInfo(null);
  };

  const handleAddNewBanner = () => {
    const newSlide: HomeBannerData = {
      id: `banner-${Date.now()}`,
      tagline: "ANIDA // NUEVA COLECCIÓN",
      title: "NUEVO LANZAMIENTO EXCLUSIVO",
      subtitle: "Prendas de compresión anatómica y cortes de vanguardia.",
      ctaText: "EXPLORAR AHORA",
      ctaLink: "/shop",
      mediaType: "IMAGE",
      mediaUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=2000&q=85",
      isActive: true,
      displayOrder: banners.length + 1,
    };
    addBanner(newSlide);
    handleSelectBanner(newSlide);
  };

  const handleDeleteBanner = (id: string) => {
    if (banners.length <= 1) {
      alert("Debes mantener al menos 1 slide en el carrusel de inicio.");
      return;
    }
    if (confirm("¿Estás seguro de eliminar este slide del carrusel?")) {
      deleteBanner(id);
      const remaining = banners.filter((b) => b.id !== id);
      if (remaining.length > 0) {
        handleSelectBanner(remaining[0]);
      }
    }
  };

  const handleBannerImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOptimizing(true);
    try {
      const result = await convertImageToWebP(file, 2000, 0.88);
      const updated = { ...formState, mediaUrl: result.dataUrl };
      setFormState(updated);
      updateBanner(updated);
      const savings = Math.round((1 - result.optimizedSize / result.originalSize) * 100);
      setCompressionInfo(
        `✓ Imagen convertida a WebP (${Math.round(result.optimizedSize / 1024)} KB - ${savings}% optimizada)`
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
    updateBanner(formState);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-200">
        <div>
          <span className="text-[11px] font-semibold tracking-widest text-charcoal-500 uppercase">
            Gestión de Contenido (CMS)
          </span>
          <h1 className="text-2xl font-light tracking-tight text-charcoal-950 uppercase">
            Carrusel de Inicio (Hero Banners)
          </h1>
        </div>

        <button
          type="button"
          onClick={handleAddNewBanner}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-charcoal-950 text-white text-xs tracking-wider uppercase font-semibold hover:bg-charcoal-800 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ Agregar Nuevo Slide</span>
        </button>
      </div>

      {/* Lista de Slides Disponibles como Pestañas / Miniaturas */}
      <div className="bg-white p-5 border border-charcoal-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-900 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-charcoal-700" />
            Diapositivas Activas ({banners.length})
          </span>
          <span className="text-[11px] text-charcoal-500">
            Haz clic en un slide para editar su texto e imagen
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
          {banners.map((b, idx) => {
            const isSelected = b.id === formState.id;
            return (
              <div
                key={b.id}
                onClick={() => handleSelectBanner(b)}
                className={`relative p-3 border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? "border-charcoal-950 bg-charcoal-50 ring-2 ring-charcoal-950"
                    : "border-charcoal-200 hover:border-charcoal-400 bg-white"
                }`}
              >
                <div className="flex justify-between items-center text-[10px] uppercase tracking-wider">
                  <span className="font-semibold text-charcoal-900">Slide #{idx + 1}</span>
                  <span className={`px-1.5 py-0.5 text-[9px] font-semibold uppercase ${
                    b.isActive ? "bg-emerald-100 text-emerald-800" : "bg-charcoal-100 text-charcoal-500"
                  }`}>
                    {b.isActive ? "Activo" : "Oculto"}
                  </span>
                </div>

                <div className="aspect-[16/9] bg-charcoal-900 overflow-hidden relative border border-charcoal-200">
                  {b.mediaUrl ? (
                    <img src={b.mediaUrl} alt={b.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-charcoal-400 text-[10px]">
                      Sin Imagen
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-end p-2 text-white text-[10px] font-medium line-clamp-1">
                    {b.title}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1 text-[11px]">
                  <span className="text-charcoal-500 font-mono text-[10px] truncate max-w-[120px]">
                    {b.ctaLink}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBanner(b.id);
                    }}
                    className="text-rose-600 hover:text-rose-800 p-1"
                    title="Eliminar slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor del Slide Seleccionado & Previsualización */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulario de Edición */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white p-6 sm:p-8 border border-charcoal-200 shadow-xs space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-100">
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-4 h-4 text-charcoal-700" />
              <h2 className="text-xs font-semibold tracking-widest uppercase text-charcoal-900">
                Editando Slide: {formState.title || "Sin Título"}
              </h2>
            </div>

            {/* Toggle Activo / Pausado */}
            <button
              type="button"
              onClick={() => {
                const updated = { ...formState, isActive: !formState.isActive };
                setFormState(updated);
                updateBanner(updated);
              }}
              className="flex items-center space-x-1.5 text-xs font-medium uppercase tracking-wider text-charcoal-700"
            >
              {formState.isActive ? (
                <>
                  <ToggleRight className="w-5 h-5 text-emerald-700" />
                  <span className="text-emerald-800">Visible en Carrusel</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-5 h-5 text-charcoal-400" />
                  <span className="text-charcoal-500">Slide Pausado</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider text-charcoal-600 font-medium">
              Tagline Superior / Campaña
            </label>
            <input
              type="text"
              value={formState.tagline || ""}
              onChange={(e) => setFormState({ ...formState, tagline: e.target.value })}
              placeholder="ej. ANIDA // ALTO RENDIMIENTO & ESTÉTICA CONTEMPORÁNEA"
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
              value={formState.title}
              onChange={(e) => setFormState({ ...formState, title: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white uppercase tracking-wider text-sm font-medium focus:border-charcoal-900 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wider text-charcoal-600 font-medium">
              Descripción / Subtítulo
            </label>
            <textarea
              rows={3}
              value={formState.subtitle}
              onChange={(e) => setFormState({ ...formState, subtitle: e.target.value })}
              placeholder="Descripción sobre la prenda, inspiración deportiva o propósito."
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
                value={formState.ctaText}
                onChange={(e) => setFormState({ ...formState, ctaText: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white uppercase tracking-wider focus:border-charcoal-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] uppercase tracking-wider text-charcoal-600 font-medium">
                Enlace de Destino (URL / Categoría)
              </label>
              <select
                value={formState.ctaLink}
                onChange={(e) => setFormState({ ...formState, ctaLink: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white focus:border-charcoal-900 focus:outline-none font-mono uppercase text-xs"
              >
                <option value="/shop">/shop (Todo el Catálogo)</option>
                <option value="/shop?category=Tops">/shop?category=Tops</option>
                <option value="/shop?category=Bottoms">/shop?category=Bottoms</option>
                <option value="/shop?category=Jackets">/shop?category=Jackets</option>
                <option value="/shop?category=Leotardos">/shop?category=Leotardos</option>
                <option value="/shop?category=Accesorios">/shop?category=Accesorios</option>
                <option value="/shop?category=Sales">/shop?category=Sales</option>
                <option value="/#editorial">/#editorial (Manifiesto)</option>
              </select>
            </div>
          </div>

          {/* Subida de Imagen con Conversión WebP */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-charcoal-600 font-medium">
              Fotografía de Portada (Conversión Automática a WebP)
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-charcoal-200 hover:border-charcoal-900 p-6 cursor-pointer bg-charcoal-50 transition-colors">
              <Upload className="w-6 h-6 text-charcoal-400 mb-2" />
              <span className="text-xs text-charcoal-800 font-medium">
                {formState.mediaUrl ? "Seleccionar otra imagen para reemplazar este slide" : "Seleccionar imagen local"}
              </span>
              <span className="text-[10px] text-charcoal-400 mt-0.5">JPG, PNG o WEBP (se optimizará a alta definición)</span>
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
                <span>¡Slide guardado y reflejado en el carrusel de inicio!</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              disabled={isOptimizing}
              className="px-6 py-3 bg-charcoal-950 text-white uppercase tracking-widest font-semibold hover:bg-charcoal-800 transition-colors shadow-xs disabled:opacity-50"
            >
              {isOptimizing ? "Procesando WebP..." : "Guardar Cambios del Slide"}
            </button>
          </div>
        </form>

        {/* Vista Previa en Vivo */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-charcoal-500">
            <Eye className="w-4 h-4" />
            <span>Vista Previa del Slide Seleccionado</span>
          </div>

          <div className="relative aspect-[3/4] bg-charcoal-900 overflow-hidden shadow-lg border border-charcoal-300">
            {formState.mediaUrl ? (
              <img
                src={formState.mediaUrl}
                alt="Vista previa"
                className="w-full h-full object-cover object-top opacity-90"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-charcoal-400 p-6 text-center space-y-2">
                <ImageIcon className="w-10 h-10 stroke-1" />
                <p className="text-xs uppercase tracking-wider">Sube una imagen para previsualizar</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <span className="text-[9px] uppercase tracking-widest text-pastel-sand font-medium">
                {formState.tagline}
              </span>
              <h3 className="text-base sm:text-lg uppercase font-light leading-snug">
                {formState.title}
              </h3>
              <p className="text-[11px] text-white/80 line-clamp-2">
                {formState.subtitle}
              </p>
              <div className="pt-2">
                <span className="inline-block px-4 py-2 bg-white text-charcoal-950 text-[10px] uppercase font-semibold tracking-widest">
                  {formState.ctaText}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

