"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";

interface HeroProps {
  title?: string;
  tagline?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  mediaType?: "IMAGE" | "VIDEO";
  mediaUrl?: string;
}

export const HeroSection: React.FC<HeroProps> = ({
  tagline = "ATELIER 2026 // EDICIÓN CÁPSULA",
  title = "SILUETAS PURAS & ESTRUCTURA MINIMAL",
  subtitle = "Prendas arquitectónicas confeccionadas en lino europeo y sedas orgánicas para un armario contemporáneo.",
  ctaText = "DESCUBRIR COLECCIÓN",
  ctaLink = "/shop",
  mediaType = "IMAGE",
  mediaUrl = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="relative w-full h-[90vh] md:h-[94vh] overflow-hidden bg-charcoal-900 select-none">
      {/* Contenedor Visual */}
      <div className="absolute inset-0 w-full h-full">
        {mediaType === "VIDEO" ? (
          <video
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onLoadedData={() => setIsLoaded(true)}
            className={`w-full h-full object-cover object-center transition-opacity duration-1000 ${
              isLoaded ? "opacity-95" : "opacity-0"
            }`}
          >
            <source src={mediaUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={mediaUrl}
            alt="anida.store campaña editorial"
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover object-top transition-all duration-1000 scale-105 ${
              isLoaded ? "scale-100 opacity-90" : "opacity-0"
            }`}
          />
        )}

        {/* Gradiente y atmósfera editorial tipo Zara/Alo */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-charcoal-950/20 to-black/20" />
      </div>

      {/* Capa de Texto Editorial */}
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-end pb-14 md:pb-20">
        <div className="max-w-2xl text-white space-y-4">
          <div className="inline-flex items-center space-x-2">
            <span className="w-6 h-[1px] bg-pastel-sand/80" />
            <span className="text-[11px] md:text-xs font-semibold tracking-widest text-pastel-sand uppercase">
              {tagline}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-tight uppercase font-sans">
            {title}
          </h1>

          <p className="text-xs sm:text-sm font-light text-white/80 max-w-lg leading-relaxed">
            {subtitle}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-3.5 items-start">
            <Link
              href={ctaLink}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-charcoal-950 text-xs font-semibold tracking-widest uppercase hover:bg-pastel-butter hover:text-charcoal-900 transition-all duration-300 shadow-md group"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1.5 transition-transform" />
            </Link>

            <Link
              href="/shop?filter=new"
              className="inline-flex items-center justify-center px-7 py-4 border border-white/50 text-white backdrop-blur-xs text-xs font-medium tracking-widest uppercase hover:border-white hover:bg-white/10 transition-all duration-300"
            >
              Ver Novedades
            </Link>
          </div>
        </div>
      </div>

      {/* Control de Audio en caso de video */}
      {mediaType === "VIDEO" && (
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-8 right-8 z-20 text-white/80 hover:text-white p-2 rounded-full bg-black/30 backdrop-blur-xs transition-colors"
          aria-label={isMuted ? "Activar sonido" : "Silenciar sonido"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      )}

      {/* Indicador de scroll */}
      <div className="absolute bottom-6 right-6 md:right-12 z-10 flex items-center space-x-2 text-white/70 text-[10px] tracking-widest uppercase">
        <span className="w-8 h-[1px] bg-white/40" />
        <span>Colección 2026</span>
      </div>
    </section>
  );
};
