"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
  tagline = "ATELIER // NUEVA TEMPORADA",
  title = "SILUETAS PURAS & ESTRUCTURA MINIMAL",
  subtitle = "Prendas de alta confección y materiales de origen ético.",
  ctaText = "DESCUBRIR COLECCIÓN",
  ctaLink = "/shop",
  mediaType = "IMAGE",
  mediaUrl = "",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <section className="relative w-full h-[85vh] md:h-[92vh] overflow-hidden bg-charcoal-950 select-none">
      {/* Contenedor Visual */}
      <div className="absolute inset-0 w-full h-full">
        {mediaUrl ? (
          <img
            src={mediaUrl}
            alt="anida.store portada"
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover object-top transition-all duration-1000 scale-103 ${
              isLoaded ? "scale-100 opacity-90" : "opacity-0"
            }`}
          />
        ) : (
          /* Fondo de degradado estético y minimalista si no se ha subido foto todavía */
          <div className="w-full h-full bg-gradient-to-tr from-charcoal-950 via-charcoal-900 to-charcoal-800" />
        )}

        {/* Gradiente cinematográfico */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-charcoal-950/20 to-black/30" />
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
              href="/shop"
              className="inline-flex items-center justify-center px-7 py-4 border border-white/50 text-white backdrop-blur-xs text-xs font-medium tracking-widest uppercase hover:border-white hover:bg-white/10 transition-all duration-300"
            >
              Ver Catálogo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
