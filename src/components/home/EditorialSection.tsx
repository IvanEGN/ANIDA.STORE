"use client";

import React from "react";
import Link from "next/link";

import { ArrowRight, Flame, Shield, Sparkles } from "lucide-react";

export const EditorialSection: React.FC = () => {
  return (
    <section id="editorial" className="w-full bg-charcoal-50 py-16 md:py-24 border-t border-b border-charcoal-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Bloque Izquierdo: Composición Visual con Logo Monograma */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] bg-charcoal-900 overflow-hidden shadow-xl border border-charcoal-200 group">
              <img
                src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=85"
                alt="ANIDA Manifiesto Deportivo"
                className="w-full h-full object-cover object-center transform group-hover:scale-103 transition-transform duration-700 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Badge Flotante Superior */}
              <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-3.5 py-1.5 text-[10px] uppercase tracking-widest font-semibold text-charcoal-950 flex items-center space-x-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse" />
                <span>ANIDA • ALTO RENDIMIENTO</span>
              </div>

              {/* Sello Monograma inferior */}
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <p className="text-[10px] tracking-widest uppercase text-pastel-sand font-mono">
                  #VIVESINLIMITES
                </p>
                <h3 className="text-xl font-light uppercase tracking-wider">
                  Más que ropa deportiva, un símbolo de determinación.
                </h3>
              </div>
            </div>
          </div>

          {/* Bloque Derecho: Manifiesto Completo de Marca */}
          <div className="lg:col-span-6 space-y-6 lg:pl-2">
            <div className="inline-flex items-center space-x-2">
              <span className="w-6 h-[1px] bg-charcoal-400" />
              <span className="text-[11px] font-semibold tracking-widest uppercase text-charcoal-600">
                El Manifiesto de ANIDA
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-charcoal-950 uppercase leading-snug">
              Porque la vida va más allá del escenario.
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-charcoal-700 font-light leading-relaxed">
              <p>
                Trasciende lo que captura la cámara y no se limita a la euforia de un torneo. La verdadera grandeza no está solo en el momento de la victoria, sino en cada paso del camino, en cada gota de sudor, en cada decisión que te acerca a tu mejor versión.
              </p>
              <p>
                Por eso <strong>ANIDA</strong> quiere acompañarte en cada momento del proceso, siendo más que ropa deportiva un símbolo de determinación, de pasión y de estilo. Estando contigo desde la preparación hasta la celebración de tus logros.
              </p>
              <p className="text-charcoal-900 font-normal">
                Diseñada para almas libres, modernas y audaces, nuestra ropa fusiona el alto rendimiento con la estética contemporánea, adaptándose a tu ritmo, dentro y fuera del entrenamiento.
              </p>
              <p className="italic text-charcoal-800 pt-1 border-l-2 border-charcoal-900 pl-3">
                “Porque cada día es una oportunidad para avanzar, para desafiarte y para escribir tu propia historia. Siempre listo para vivir sin límites.”
              </p>
            </div>

            {/* Pilares de Marca */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-charcoal-200 text-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5 text-charcoal-950 font-semibold text-[11px] uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-charcoal-900" />
                  <span>Pasión</span>
                </div>
                <p className="text-[10px] text-charcoal-500 font-light">Compromiso en cada repetición.</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-1.5 text-charcoal-950 font-semibold text-[11px] uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5 text-charcoal-900" />
                  <span>Técnica</span>
                </div>
                <p className="text-[10px] text-charcoal-500 font-light">Tejidos de máxima elasticidad.</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-1.5 text-charcoal-950 font-semibold text-[11px] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-charcoal-900" />
                  <span>Estilo</span>
                </div>
                <p className="text-[10px] text-charcoal-500 font-light">Estética contemporánea audaz.</p>
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-4">
              <Link
                href="/shop"
                className="inline-flex items-center space-x-2 px-6 py-3.5 bg-charcoal-950 text-white text-xs font-semibold tracking-widest uppercase hover:bg-charcoal-800 transition-colors group shadow-xs"
              >
                <span>Explorar Colección</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

