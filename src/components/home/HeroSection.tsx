"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { useStoreData } from "@/context/StoreDataContext";

export const HeroSection: React.FC = () => {
  const { banners } = useStoreData();
  const activeBanners = banners.filter((b) => b.isActive);
  const slideList = activeBanners.length > 0 ? activeBanners : banners;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState<{ [key: string]: boolean }>({});

  const totalSlides = slideList.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay timer
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(interval);
  }, [totalSlides, isPaused, nextSlide]);

  if (slideList.length === 0) return null;

  const currentBanner = slideList[currentIndex] || slideList[0];

  return (
    <section
      className="relative w-full h-[85vh] md:h-[92vh] overflow-hidden bg-charcoal-950 select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Carrusel Principal ANIDA"
    >
      {/* Diapositivas de fondo con transiciones suaves */}
      {slideList.map((banner, index) => {
        const isCurrent = index === currentIndex;
        return (
          <div
            key={banner.id || index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isCurrent ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {banner.mediaUrl ? (
              <img
                src={banner.mediaUrl}
                alt={banner.title || "ANIDA portada"}
                onLoad={() => setIsImageLoaded((prev) => ({ ...prev, [banner.id]: true }))}
                className={`w-full h-full object-cover object-center transition-transform duration-10000 ease-out scale-105 ${
                  isCurrent ? "scale-100" : "scale-105"
                }`}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-charcoal-950 via-charcoal-900 to-charcoal-800" />
            )}

            {/* Gradientes cinematográficos para legibilidad de textos */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/90 via-charcoal-950/40 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/80 via-charcoal-950/20 to-transparent" />
          </div>
        );
      })}

      {/* Capa de Contenido Editorial */}
      <div className="relative z-20 w-full h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-14 md:pb-20">
        <div className="max-w-2xl text-white space-y-4 animate-fadeIn">
          {/* Tagline */}
          <div className="inline-flex items-center space-x-2">
            <span className="w-6 h-[1px] bg-pastel-sand/90" />
            <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-pastel-sand uppercase">
              {currentBanner.tagline || "ANIDA // ALTO RENDIMIENTO & ESTÉTICA CONTEMPORÁNEA"}
            </span>
          </div>

          {/* Titular Principal H1 */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-tight uppercase font-sans text-white drop-shadow-sm">
            {currentBanner.title}
          </h1>

          {/* Subtítulo / Descripción */}
          <p className="text-xs sm:text-sm font-light text-white/85 max-w-lg leading-relaxed line-clamp-3">
            {currentBanner.subtitle}
          </p>

          {/* Botones de Acción */}
          <div className="pt-4 flex flex-wrap gap-3.5 items-center">
            <Link
              href={currentBanner.ctaLink || "/shop"}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-charcoal-950 text-xs font-semibold tracking-widest uppercase hover:bg-pastel-sand hover:text-charcoal-950 transition-all duration-300 shadow-md group/btn"
            >
              <span>{currentBanner.ctaText || "Descubrir Colección"}</span>
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1.5 transition-transform" />
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-7 py-4 border border-white/60 text-white backdrop-blur-xs text-xs font-medium tracking-widest uppercase hover:border-white hover:bg-white/10 transition-all duration-300"
            >
              Ver Catálogo
            </Link>
          </div>
        </div>
      </div>

      {/* Controles de Navegación del Carrusel (Si hay más de 1 slide) */}
      {totalSlides > 1 && (
        <>
          {/* Flechas Laterales */}
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/30 hover:bg-black/70 text-white backdrop-blur-xs border border-white/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/30 hover:bg-black/70 text-white backdrop-blur-xs border border-white/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Siguiente slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicadores Inferiores y Contador (01 / 03) */}
          <div className="absolute bottom-6 right-6 md:right-12 z-30 flex items-center space-x-4 bg-black/40 backdrop-blur-md px-4 py-2 border border-white/15">
            <span className="text-[11px] font-mono text-white/90 tracking-wider">
              {String(currentIndex + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
            </span>

            {/* Puntos / Barras de progreso */}
            <div className="flex items-center space-x-1.5">
              {slideList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Ir al slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Botón Pausa / Play */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-white/70 hover:text-white transition-colors"
              title={isPaused ? "Reanudar autoplay" : "Pausar carrusel"}
            >
              {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            </button>
          </div>
        </>
      )}
    </section>
  );
};

