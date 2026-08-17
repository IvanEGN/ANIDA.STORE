"use client";

import React from "react";
import Link from "next/link";

import { ArrowRight, Instagram, Facebook, MessageCircle, Mail, Phone } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-charcoal-950 text-white pt-16 pb-12 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-charcoal-800">
          {/* Columna 1: Marca & Filosofía */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-block">
              {/* Logo SVG Vectorizado */}
              <div className="bg-white px-3 py-1.5 rounded-xs inline-block">
                <img
                  src="/img/anida-wordmark.svg"
                  alt="ANIDA"
                  className="h-6 sm:h-7 w-auto object-contain"
                />
              </div>
            </Link>

            <p className="text-xs text-charcoal-400 font-light leading-relaxed">
              Moda deportiva de alto rendimiento y estética contemporánea. Diseñada para almas libres, modernas y audaces.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href="https://www.instagram.com/anidabyad?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-charcoal-900 flex items-center justify-center text-charcoal-400 hover:text-white hover:bg-charcoal-800 transition-colors"
                aria-label="Instagram de ANIDA"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/share/1H7m1uPa2Z/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-charcoal-900 flex items-center justify-center text-charcoal-400 hover:text-white hover:bg-charcoal-800 transition-colors"
                aria-label="Facebook de ANIDA"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/529999963334?text=Hola%20ANIDA,%20deseo%20m%C3%A1s%20informaci%C3%B3n"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-charcoal-900 flex items-center justify-center text-emerald-400 hover:text-white hover:bg-emerald-800 transition-colors"
                aria-label="WhatsApp de Atención a Clientes"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Columna 2: Categorías Oficiales */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-pastel-sand">
              Colecciones
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-400 font-light">
              <li><Link href="/shop?category=Tops" className="hover:text-white transition-colors">Tops Deportivos</Link></li>
              <li><Link href="/shop?category=Bottoms" className="hover:text-white transition-colors">Bottoms & Leggings</Link></li>
              <li><Link href="/shop?category=Jackets" className="hover:text-white transition-colors">Jackets & Cortavientos</Link></li>
              <li><Link href="/shop?category=Leotardos" className="hover:text-white transition-colors">Leotardos Performance</Link></li>
              <li><Link href="/shop?category=Accesorios" className="hover:text-white transition-colors">Accesorios</Link></li>
              <li><Link href="/shop?category=Sales" className="text-rose-400 hover:text-rose-300 transition-colors font-medium">Sales & Ofertas</Link></li>
            </ul>
          </div>

          {/* Columna 3: Atención al Cliente & Contacto Directo */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-pastel-sand">
              Atención a Clientes
            </h4>
            <ul className="space-y-2.5 text-xs text-charcoal-400 font-light">
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="https://wa.me/529999963334" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp: 999 996 3334
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-charcoal-400 shrink-0" />
                <a href="mailto:anidabyad@gmail.com" className="hover:text-white transition-colors">
                  anidabyad@gmail.com
                </a>
              </li>
              <li><Link href="/#editorial" className="hover:text-white transition-colors">Manifiesto de Marca</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Guía de Tallas & Medidas</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Mi Cuenta / Portal</Link></li>
            </ul>
          </div>

          {/* Columna 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-pastel-sand">
              Comunidad ANIDA
            </h4>
            <p className="text-xs text-charcoal-400 font-light leading-relaxed">
              Recibe primicias de lanzamientos exclusivos y 10% de descuento en tu primer pedido con el código <strong>ANIDA10</strong>.
            </p>
            <form className="flex" onSubmit={(e) => { e.preventDefault(); alert("¡Gracias por suscribirte a ANIDA!"); }}>
              <input
                type="email"
                required
                placeholder="TU CORREO ELECTRÓNICO"
                className="w-full bg-charcoal-900 border border-charcoal-700 px-3 py-2.5 text-[11px] uppercase tracking-wider text-white placeholder:text-charcoal-500 focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="bg-white text-charcoal-950 px-3 py-2.5 hover:bg-pastel-sand transition-colors shrink-0"
                aria-label="Suscribirse al boletín"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Derechos y Métodos de Pago */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-charcoal-500 font-light space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} ANIDA (anidabyad) — Todos los derechos reservados. Vive sin límites.</p>
          <div className="flex flex-wrap items-center justify-center space-x-3 tracking-widest uppercase text-[10px]">
            <span>Tarjetas de Crédito / Débito</span>
            <span>•</span>
            <span>Transferencias SPEI</span>
          </div>

        </div>
      </div>
    </footer>
  );
};

