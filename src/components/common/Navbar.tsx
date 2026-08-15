"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Search, 
  User, 
  Heart,
  SlidersHorizontal 
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { cartCount, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Novedades", href: "/shop?filter=new" },
    { name: "Sastrería", href: "/shop?category=Sastrería" },
    { name: "Vestidos", href: "/shop?category=Vestidos" },
    { name: "Pantalones", href: "/shop?category=Pantalones" },
    { name: "Tops", href: "/shop?category=Tops" },
    { name: "Lookbook", href: "/#editorial" },
  ];

  return (
    <>
      {/* Barra de Anuncios Superior */}
      <aside aria-label="Anuncios de la tienda" className="w-full bg-charcoal-900 text-white py-2 px-4 text-center text-[10px] sm:text-xs font-light tracking-widest uppercase transition-all duration-300">
        <span>Envío express sin costo en órdenes mayores a $1,499 MXN &nbsp;•&nbsp; Devoluciones sin cargo</span>
      </aside>

      {/* Header Principal */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-background/90 backdrop-blur-md border-b border-charcoal-200 py-3.5 shadow-sm"
            : "bg-background py-5 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
          {/* Menú Mobile Trigger & Links Izquierda */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-charcoal-900 hover:text-charcoal-600 focus:outline-none"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5" />
            </button>

            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs tracking-widest uppercase font-normal text-charcoal-800 hover:text-charcoal-950 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-charcoal-900 hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Logo Central anida.store */}
          <div className="text-center">
            <Link
              href="/"
              className="font-sans text-2xl sm:text-3xl font-light tracking-[0.25em] text-charcoal-950 uppercase select-none hover:opacity-90 transition-opacity"
            >
              ANIDA<span className="font-extralight text-charcoal-400 text-lg sm:text-xl tracking-normal">.store</span>
            </Link>
          </div>

          {/* Iconos de Acción Derecha */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* Buscador */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-charcoal-800 hover:text-charcoal-950 transition-colors"
              aria-label="Buscar productos"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Acceso Admin / Perfil */}
            <Link
              href="/admin"
              className="text-charcoal-800 hover:text-charcoal-950 transition-colors hidden sm:block"
              title="Panel Administrativo CMS"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Link>

            {/* Botón Carrito */}
            <button
              onClick={openCart}
              className="relative text-charcoal-800 hover:text-charcoal-950 transition-colors flex items-center"
              aria-label={`Ver carrito de compras con ${cartCount} productos`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-charcoal-900 text-white text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Buscador Desplegable */}
        {searchOpen && (
          <div className="w-full bg-background border-t border-b border-charcoal-200 py-4 px-6 transition-all duration-300 animate-fadeIn">
            <div className="max-w-2xl mx-auto flex items-center space-x-3">
              <Search className="w-4 h-4 text-charcoal-400" />
              <input
                type="text"
                placeholder="BUSCAR PRENDAS, VESTIDOS, LINO, COLORES..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm tracking-wider uppercase placeholder:text-charcoal-400 focus:outline-none"
                autoFocus
              />
              <Link
                href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                onClick={() => setSearchOpen(false)}
                className="text-xs uppercase tracking-widest font-semibold text-charcoal-900 hover:text-charcoal-600 px-2"
              >
                Buscar
              </Link>
              <button onClick={() => setSearchOpen(false)} aria-label="Cerrar barra de búsqueda">
                <X className="w-4 h-4 text-charcoal-500 hover:text-charcoal-900" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Menú Lateral Móvil (Drawer) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-background h-full p-6 flex flex-col justify-between shadow-2xl z-10 animate-slideRight">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-charcoal-200">
                <span className="font-light tracking-[0.2em] text-lg uppercase">
                  ANIDA<span className="text-charcoal-400 text-sm">.store</span>
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-charcoal-800 hover:text-charcoal-950"
                  aria-label="Cerrar menú de navegación móvil"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-8 flex flex-col space-y-5">
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm tracking-widest uppercase font-medium text-charcoal-900"
                >
                  Ver Todo el Catálogo
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs tracking-widest uppercase font-normal text-charcoal-700 hover:text-charcoal-950"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-charcoal-200 space-y-3">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 text-xs tracking-wider uppercase text-charcoal-600 hover:text-charcoal-900"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Panel de Control (CMS)</span>
              </Link>
              <p className="text-[10px] text-charcoal-400 uppercase tracking-widest">
                Moneda: MXN ($) • Envíos a todo México
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
