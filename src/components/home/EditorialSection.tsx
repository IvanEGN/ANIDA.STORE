import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const EditorialSection: React.FC = () => {
  return (
    <section id="editorial" className="w-full bg-charcoal-50 py-16 md:py-28 border-t border-b border-charcoal-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Bloque Izquierdo: Imagen Vertical Editorial */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/5] bg-charcoal-200 overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85"
                alt="Editorial Lookbook anida.store"
                className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-xs px-3 py-1 text-[10px] uppercase tracking-widest font-semibold text-charcoal-900">
                Look 04 // Sastrería de Verano
              </div>
            </div>
          </div>

          {/* Bloque Derecho: Manifiesto Editorial y Destacados */}
          <div className="lg:col-span-5 space-y-6 lg:pl-4">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-charcoal-500">
              El Manifiesto de anida
            </span>

            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-charcoal-950 uppercase leading-snug">
              Moda concebida desde la serenidad y la precisión.
            </h2>

            <p className="text-xs sm:text-sm text-charcoal-600 font-light leading-relaxed">
              En anida.store eliminamos lo superfluo para destacar la nobleza de los materiales. Nuestras piezas son elaboradas con fibras 100% trazables, patronaje tridimensional y acabados que respetan el movimiento natural del cuerpo.
            </p>

            {/* Micro-Features de Calidad */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-charcoal-200 text-xs">
              <div>
                <strong className="block text-charcoal-900 font-medium tracking-wider uppercase mb-1">
                  Hilaturas Nobles
                </strong>
                <p className="text-charcoal-500 text-[11px]">Lino italiano, algodón Supima mercerizado y sedas lavadas.</p>
              </div>
              <div>
                <strong className="block text-charcoal-900 font-medium tracking-wider uppercase mb-1">
                  Producción Consciente
                </strong>
                <p className="text-charcoal-500 text-[11px]">Tirajes limitados que evitan sobreproducción textil.</p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/shop"
                className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest uppercase text-charcoal-950 hover:text-charcoal-600 transition-colors group"
              >
                <span>Explorar Todos los Looks</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
