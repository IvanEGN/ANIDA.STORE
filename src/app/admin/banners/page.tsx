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
  Smartphone,
  Monitor,
  Megaphone,
  ToggleLeft,
  ToggleRight
} from "lucide-react";

export default function AdminBannersPage() {
  const {
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    announcementText,
    updateAnnouncementText,
  } = useStoreData();

  const [selectedBannerId, setSelectedBannerId] = useState<string>(banners[0]?.id || "");
  const [isOptimizingDesktop, setIsOptimizingDesktop] = useState(false);
  const [isOptimizingMobile, setIsOptimizingMobile] = useState(false);
  const [compressionInfoDesktop, setCompressionInfoDesktop] = useState<string | null>(null);
  const [compressionInfoMobile, setCompressionInfoMobile] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // Barra de anuncios estado
  const [formAnnouncement, setFormAnnouncement] = useState<string>(announcementText);
  const [announcementSaved, setAnnouncementSaved] = useState(false);

  // Sincronizar texto de anuncio cuando cargue
  React.useEffect(() => {
    if (announcementText) {
      setFormAnnouncement(announcementText);
    }
  }, [announcementText]);

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
    mobileMediaUrl: "",
    isActive: true,
  };

  const [formState, setFormState] = useState<HomeBannerData>(currentBanner);

  // Sincronizar formulario cuando cambia el slide seleccionado
  const handleSelectBanner = (banner: HomeBannerData) => {
    setSelectedBannerId(banner.id);
    setFormState(banner);
    setCompressionInfoDesktop(null);
    setCompressionInfoMobile(null);
  };

  const handleAddNewBanner = async () => {
    const newSlide: HomeBannerData = {
      id: `banner-${Date.now()}`,
      tagline: "ANIDA // NUEVA COLECCIÓN",
      title: "TÍTULO DEL BANNER",
      subtitle: "Descripción de la prenda o lanzamiento de temporada.",
      ctaText: "VER COLECCIÓN",
      ctaLink: "/shop",
      mediaType: "IMAGE",
      mediaUrl: "",
      mobileMediaUrl: "",
      isActive: true,
      displayOrder: banners.length + 1,
    };
    await addBanner(newSlide);
    handleSelectBanner(newSlide);
  };

  const handleDeleteBanner = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este slide del carrusel?")) {
      await deleteBanner(id);
      const remaining = banners.filter((b) => b.id !== id);
      if (remaining.length > 0) {
        handleSelectBanner(remaining[0]);
      } else {
        setSelectedBannerId("");
        setFormState({
          id: `banner-${Date.now()}`,
          tagline: "ANIDA // NUEVA COLECCIÓN",
          title: "",
          subtitle: "",
          ctaText: "VER COLECCIÓN",
          ctaLink: "/shop",
          mediaType: "IMAGE",
          mediaUrl: "",
          mobileMediaUrl: "",
          isActive: true,
        });
      }
    }
  };

  // Imagen para Escritorio (Desktop)
  const handleDesktopImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOptimizingDesktop(true);
    try {
      const result = await convertImageToWebP(file, 1920, 0.85);
      let finalUrl = result.dataUrl;
      try {
        const formData = new FormData();
        formData.append("file", result.file);
        const upRes = await fetch("/api/upload", { method: "POST", body: formData });
        const upData = await upRes.json();
        if (upRes.ok && upData.success && upData.url) {
          finalUrl = upData.url;
        }
      } catch (_) {}

      const updated = { ...formState, mediaUrl: finalUrl };
      setFormState(updated);
      await updateBanner(updated);
      const savings = Math.round((1 - result.optimizedSize / result.originalSize) * 100);
      setCompressionInfoDesktop(
        `✓ Foto escritorio lista (${Math.round(result.optimizedSize / 1024)} KB - ${savings}% optimizada)`
      );
    } catch (err) {
      console.error(err);
      alert("Error al procesar la imagen de escritorio.");
    } finally {
      setIsOptimizingDesktop(false);
    }
  };

  // Imagen para Celular (Mobile - Vertical)
  const handleMobileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOptimizingMobile(true);
    try {
      const result = await convertImageToWebP(file, 1080, 0.85);
      let finalUrl = result.dataUrl;
      try {
        const formData = new FormData();
        formData.append("file", result.file);
        const upRes = await fetch("/api/upload", { method: "POST", body: formData });
        const upData = await upRes.json();
        if (upRes.ok && upData.success && upData.url) {
          finalUrl = upData.url;
        }
      } catch (_) {}

      const updated = { ...formState, mobileMediaUrl: finalUrl };
      setFormState(updated);
      await updateBanner(updated);
      const savings = Math.round((1 - result.optimizedSize / result.originalSize) * 100);
      setCompressionInfoMobile(
        `✓ Foto móvil lista (${Math.round(result.optimizedSize / 1024)} KB - ${savings}% optimizada)`
      );
    } catch (err) {
      console.error(err);
      alert("Error al procesar la imagen para móvil.");
    } finally {
      setIsOptimizingMobile(false);
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateBanner(formState);
    if (!res.success) {
      alert("Error al guardar banner: " + (res.error || "Error de base de datos"));
    } else {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateAnnouncementText(formAnnouncement);
    if (!res.success) {
      alert("Error al guardar anuncio: " + (res.error || "Error de base de datos"));
    } else {
      setAnnouncementSaved(true);
      setTimeout(() => setAnnouncementSaved(false), 2500);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-200">
        <div>
          <span className="text-[11px] font-semibold tracking-widest text-charcoal-500 uppercase">
            Gestión de Contenido & Banners
          </span>
          <h1 className="text-2xl font-light tracking-tight text-charcoal-950 uppercase">
            Banners de Portada & Anuncios
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

      {/* SECCIÓN 1: EDITOR DE LA BARRA DE ANUNCIOS SUPERIOR */}
      <div className="bg-white p-6 border border-charcoal-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-charcoal-100">
          <div className="flex items-center space-x-2">
            <Megaphone className="w-4 h-4 text-charcoal-900" />
            <h2 className="text-xs font-semibold tracking-widest uppercase text-charcoal-900">
              Barra Superior de Envíos / Promociones
            </h2>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-charcoal-400 font-medium">
            Se actualiza en vivo en todos los dispositivos
          </span>
        </div>

        <form onSubmit={handleSaveAnnouncement} className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-charcoal-600 font-medium">
              Texto de la cinta negra superior:
            </label>
            <input
              type="text"
              required
              value={formAnnouncement}
              onChange={(e) => setFormAnnouncement(e.target.value)}
              placeholder="ENVÍO SIN COSTO EN COMPRAS MAYORES A $1,499 MXN • DISEÑADO PARA ALMAS LIBRES Y AUDACES"
              className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white text-xs tracking-wider focus:border-charcoal-900 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            {announcementSaved ? (
              <span className="inline-flex items-center space-x-1.5 text-emerald-700 text-xs font-medium">
                <Check className="w-4 h-4" />
                <span>¡Texto de barra guardado y visible en todos los dispositivos!</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-5 py-2.5 bg-charcoal-950 text-white text-xs font-semibold uppercase tracking-widest hover:bg-charcoal-800 transition-colors"
            >
              Guardar Barra de Anuncios
            </button>
          </div>
        </form>
      </div>

      {/* SECCIÓN 2: LISTA DE SLIDES DISPONIBLES */}
      <div className="bg-white p-5 border border-charcoal-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-900 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-charcoal-700" />
            Diapositivas Activas ({banners.length})
          </span>
          <span className="text-[11px] text-charcoal-500">
            Haz clic en un slide para editar sus fotos y textos
          </span>
        </div>

        {banners.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-charcoal-200 p-6 space-y-3">
            <p className="text-xs text-charcoal-500 font-light">No tienes banners en el carrusel de inicio.</p>
            <button
              type="button"
              onClick={handleAddNewBanner}
              className="px-4 py-2 bg-charcoal-950 text-white text-xs uppercase tracking-wider font-semibold hover:bg-charcoal-800"
            >
              + Agregar Primer Slide
            </button>
          </div>
        ) : (
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
      )}
    </div>

      {/* SECCIÓN 3: EDITOR DEL SLIDE & PREVISUALIZACIÓN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulario de Edición */}
        <form onSubmit={handleSaveBanner} className="lg:col-span-7 bg-white p-6 sm:p-8 border border-charcoal-200 shadow-xs space-y-5 text-xs">
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
              onClick={async () => {
                const updated = { ...formState, isActive: !formState.isActive };
                setFormState(updated);
                await updateBanner(updated);
              }}
              className="flex items-center space-x-1.5 text-xs font-medium uppercase tracking-wider text-charcoal-700"
            >
              {formState.isActive ? (
                <>
                  <ToggleRight className="w-5 h-5 text-emerald-700" />
                  <span className="text-emerald-800">Visible en Tienda</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-5 h-5 text-charcoal-400" />
                  <span className="text-charcoal-500">Slide Oculto</span>
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

          {/* FOTOGRAFÍAS: DUAL UPLOAD (ESCRITORIO & MÓVIL) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Foto 1: Escritorio */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-charcoal-700 font-semibold flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5" />
                <span>Foto para Escritorio (16:9 / Horizontal) *</span>
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-charcoal-200 hover:border-charcoal-900 p-5 cursor-pointer bg-charcoal-50 transition-colors h-36">
                <Upload className="w-5 h-5 text-charcoal-400 mb-1" />
                <span className="text-[11px] text-charcoal-800 font-medium text-center">
                  {formState.mediaUrl ? "Reemplazar foto de escritorio" : "Subir foto horizontal"}
                </span>
                <span className="text-[9px] text-charcoal-400 mt-0.5">Se optimiza en WebP</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDesktopImageChange}
                  className="hidden"
                />
              </label>
              {compressionInfoDesktop && (
                <div className="text-[10px] text-emerald-700 bg-emerald-50 p-2 border border-emerald-200">
                  {compressionInfoDesktop}
                </div>
              )}
            </div>

            {/* Foto 2: Celular / Móvil */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-charcoal-700 font-semibold flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Foto para Móvil (9:16 / Vertical)</span>
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-charcoal-200 hover:border-charcoal-900 p-5 cursor-pointer bg-charcoal-50 transition-colors h-36">
                <Upload className="w-5 h-5 text-charcoal-400 mb-1" />
                <span className="text-[11px] text-charcoal-800 font-medium text-center">
                  {formState.mobileMediaUrl ? "Reemplazar foto para móvil" : "Subir foto vertical para celular"}
                </span>
                <span className="text-[9px] text-charcoal-400 mt-0.5">Ajuste perfecto en pantallas móviles</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMobileImageChange}
                  className="hidden"
                />
              </label>
              {compressionInfoMobile && (
                <div className="text-[10px] text-emerald-700 bg-emerald-50 p-2 border border-emerald-200">
                  {compressionInfoMobile}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-charcoal-200">
            {savedSuccess ? (
              <span className="inline-flex items-center space-x-1.5 text-emerald-700 text-xs font-medium">
                <Check className="w-4 h-4" />
                <span>¡Slide guardado en base de datos MySQL!</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              disabled={isOptimizingDesktop || isOptimizingMobile}
              className="px-6 py-3 bg-charcoal-950 text-white uppercase tracking-widest font-semibold hover:bg-charcoal-800 transition-colors shadow-xs disabled:opacity-50"
            >
              {isOptimizingDesktop || isOptimizingMobile ? "Procesando WebP..." : "Guardar Cambios del Slide"}
            </button>
          </div>
        </form>

        {/* Vista Previa Interactiva (Switch Desktop / Móvil) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-charcoal-500">
            <div className="flex items-center space-x-1.5">
              <Eye className="w-4 h-4" />
              <span>Vista Previa en Vivo</span>
            </div>

            {/* Switch Desktop / Celular */}
            <div className="flex border border-charcoal-300 overflow-hidden text-[10px]">
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`px-3 py-1 flex items-center gap-1 ${
                  previewDevice === "desktop" ? "bg-charcoal-950 text-white" : "bg-white text-charcoal-700"
                }`}
              >
                <Monitor className="w-3 h-3" />
                <span>Escritorio</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`px-3 py-1 flex items-center gap-1 ${
                  previewDevice === "mobile" ? "bg-charcoal-950 text-white" : "bg-white text-charcoal-700"
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>Celular</span>
              </button>
            </div>
          </div>

          <div
            className={`mx-auto bg-charcoal-900 overflow-hidden shadow-lg border border-charcoal-300 transition-all ${
              previewDevice === "desktop" ? "w-full aspect-[16/10]" : "w-[260px] aspect-[9/16] rounded-2xl border-4 border-charcoal-950"
            }`}
          >
            <div className="relative w-full h-full">
              {(previewDevice === "mobile" && formState.mobileMediaUrl ? formState.mobileMediaUrl : formState.mediaUrl) ? (
                <img
                  src={
                    previewDevice === "mobile" && formState.mobileMediaUrl
                      ? formState.mobileMediaUrl
                      : formState.mediaUrl
                  }
                  alt="Vista previa"
                  className="w-full h-full object-cover object-center opacity-90"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-charcoal-400 p-6 text-center space-y-2">
                  <ImageIcon className="w-8 h-8 stroke-1" />
                  <p className="text-[10px] uppercase tracking-wider">Sube imagen para previsualizar</p>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white space-y-1.5">
                <span className="text-[8px] uppercase tracking-widest text-pastel-sand font-medium">
                  {formState.tagline}
                </span>
                <h3 className="text-sm sm:text-base uppercase font-light leading-snug">
                  {formState.title}
                </h3>
                <p className="text-[10px] text-white/80 line-clamp-2">
                  {formState.subtitle}
                </p>
                <div className="pt-1.5">
                  <span className="inline-block px-3 py-1.5 bg-white text-charcoal-950 text-[9px] uppercase font-semibold tracking-widest">
                    {formState.ctaText}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
