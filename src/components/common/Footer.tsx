import React from "react";
import Link from "next/link";
import { ArrowRight, Instagram, Facebook } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-charcoal-950 text-white pt-16 pb-12 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-charcoal-800">
          {/* Columna 1: Marca & Filosofía */}
          <div className="space-y-4 md:col-span-1">
            <span className="font-light tracking-[0.25em] text-xl uppercase">
              ANIDA<span className="text-charcoal-400 text-sm">.store</span>
            </span>
            <p className="text-xs text-charcoal-400 font-light leading-relaxed">
              Prendas de alta sastrería contemporánea, siluetas depuradas y materiales de origen ético. Diseñado para perdurar en el tiempo.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-charcoal-400 hover:text-white transition-colors" aria-label="Instagram de anida.store">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-charcoal-400 hover:text-white transition-colors" aria-label="Facebook de anida.store">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Columna 2: Colecciones */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-pastel-sand">
              Colecciones
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-400 font-light">
              <li><Link href="/shop?category=Sastrería" className="hover:text-white transition-colors">Sastrería Atelier</Link></li>
              <li><Link href="/shop?category=Vestidos" className="hover:text-white transition-colors">Vestidos & Monos</Link></li>
              <li><Link href="/shop?category=Pantalones" className="hover:text-white transition-colors">Pantalones Wide-Leg</Link></li>
              <li><Link href="/shop?category=Tops" className="hover:text-white transition-colors">Tops & Camisas</Link></li>
              <li><Link href="/shop?filter=new" className="hover:text-white transition-colors">Novedades</Link></li>
            </ul>
          </div>

          {/* Columna 3: Atención al Cliente */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-pastel-sand">
              Ayuda & Guías
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-400 font-light">
              <li><Link href="/#guia-tallas" className="hover:text-white transition-colors">Guía de Tallas</Link></li>
              <li><Link href="/#envios" className="hover:text-white transition-colors">Envíos & Rastreo</Link></li>
              <li><Link href="/#devoluciones" className="hover:text-white transition-colors">Cambios y Devoluciones</Link></li>
              <li><Link href="/#pagos" className="hover:text-white transition-colors">Pagos (Stripe, MP, SPEI, PayPal)</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Mi Cuenta</Link></li>
            </ul>
          </div>

          {/* Columna 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-pastel-sand">
              Únete al Atelier
            </h4>
            <p className="text-xs text-charcoal-400 font-light leading-relaxed">
              Recibe acceso anticipado a nuestras ediciones cápsula y 10% de descuento en tu primer pedido con el código <strong>ANIDA10</strong>.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="TU CORREO ELECTRÓNICO"
                className="w-full bg-charcoal-900 border border-charcoal-700 px-3 py-2.5 text-[11px] uppercase tracking-wider text-white placeholder:text-charcoal-500 focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="bg-white text-charcoal-950 px-3 py-2.5 hover:bg-pastel-sand transition-colors"
                aria-label="Suscribirse al boletín de noticias"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Derechos y Métodos de Pago */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-charcoal-500 font-light space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} anida.store — Todos los derechos reservados. Moda minimalista.</p>
          <div className="flex items-center space-x-4 tracking-widest uppercase text-[10px]">
            <span>Tarjetas de Crédito / Débito</span>
            <span>•</span>
            <span>Mercado Pago</span>
            <span>•</span>
            <span>Transferencias SPEI</span>
            <span>•</span>
            <span>PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
