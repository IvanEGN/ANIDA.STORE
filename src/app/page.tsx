import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { EditorialSection } from "@/components/home/EditorialSection";
import { ProductCatalog } from "@/components/shop/ProductCatalog";
import { INITIAL_PRODUCTS, INITIAL_BANNERS } from "@/data/initialData";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function HomePage() {
  const activeBanner = INITIAL_BANNERS[0];

  return (
    <div className="w-full">
      {/* 1. Hero Section Principal */}
      <HeroSection
        tagline={activeBanner.tagline}
        title={activeBanner.title}
        subtitle={activeBanner.subtitle}
        ctaText={activeBanner.ctaText}
        ctaLink={activeBanner.ctaLink}
        mediaType={activeBanner.mediaType}
        mediaUrl={activeBanner.mediaUrl}
      />

      {/* 2. Barra de Categorías Visuales Cápsula */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/shop?category=Sastrería"
            className="group relative aspect-[3/4] overflow-hidden bg-charcoal-100 flex items-end p-5"
          >
            <img
              src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80"
              alt="Sastrería anida"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent" />
            <div className="relative z-10 text-white">
              <span className="text-[10px] tracking-widest uppercase text-pastel-sand font-medium block">
                Cápsula 01
              </span>
              <h3 className="text-sm sm:text-base font-light tracking-wider uppercase">
                Sastrería
              </h3>
            </div>
          </Link>

          <Link
            href="/shop?category=Vestidos"
            className="group relative aspect-[3/4] overflow-hidden bg-charcoal-100 flex items-end p-5"
          >
            <img
              src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80"
              alt="Vestidos anida"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent" />
            <div className="relative z-10 text-white">
              <span className="text-[10px] tracking-widest uppercase text-pastel-sand font-medium block">
                Cápsula 02
              </span>
              <h3 className="text-sm sm:text-base font-light tracking-wider uppercase">
                Vestidos
              </h3>
            </div>
          </Link>

          <Link
            href="/shop?category=Pantalones"
            className="group relative aspect-[3/4] overflow-hidden bg-charcoal-100 flex items-end p-5"
          >
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"
              alt="Pantalones anida"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent" />
            <div className="relative z-10 text-white">
              <span className="text-[10px] tracking-widest uppercase text-pastel-sand font-medium block">
                Cápsula 03
              </span>
              <h3 className="text-sm sm:text-base font-light tracking-wider uppercase">
                Pantalones
              </h3>
            </div>
          </Link>

          <Link
            href="/shop?category=Tops"
            className="group relative aspect-[3/4] overflow-hidden bg-charcoal-100 flex items-end p-5"
          >
            <img
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80"
              alt="Tops anida"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent" />
            <div className="relative z-10 text-white">
              <span className="text-[10px] tracking-widest uppercase text-pastel-sand font-medium block">
                Cápsula 04
              </span>
              <h3 className="text-sm sm:text-base font-light tracking-wider uppercase">
                Tops & Esenciales
              </h3>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Catálogo Principal con Filtros y Quick Add */}
      <ProductCatalog initialProducts={INITIAL_PRODUCTS} />

      {/* 4. Sección Editorial y Lookbook */}
      <EditorialSection />
    </div>
  );
}
