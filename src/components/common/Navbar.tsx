"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Search, 
  User, 
  SlidersHorizontal,
  LogOut 
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { cartCount, openCart } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Tops", href: "/shop?category=Tops" },
    { name: "Bottoms", href: "/shop?category=Bottoms" },
    { name: "Jackets", href: "/shop?category=Jackets" },
    { name: "Leotardos", href: "/shop?category=Leotardos" },
    { name: "Accesorios", href: "/shop?category=Accesorios" },
    { name: "Sales", href: "/shop?category=Sales", isHighlight: true },
  ];

  return (
    <>
      {/* Barra de Anuncios Superior */}
      <aside aria-label="Anuncios de la tienda" className="w-full bg-charcoal-950 text-white py-2 px-4 text-center text-[10px] sm:text-xs font-light tracking-widest uppercase transition-all duration-300">
        <span>Envío sin costo en compras mayores a $1,499 MXN &nbsp;•&nbsp; Diseñado para almas libres y audaces</span>
      </aside>

      {/* Header Principal */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-b border-charcoal-200 py-3 shadow-xs"
            : "bg-background py-4.5 border-b border-charcoal-100"
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

            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-7">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs tracking-widest uppercase font-medium transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-charcoal-950 hover:after:w-full after:transition-all after:duration-300 ${
                    link.isHighlight
                      ? "text-rose-700 font-semibold hover:text-rose-900"
                      : "text-charcoal-800 hover:text-charcoal-950"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Logo Central Vectorizado SVG */}
          <div className="text-center py-1">
            <Link
              href="/"
              className="inline-flex items-center group select-none"
              aria-label="ANIDA Inicio"
            >
              {/* Logo SVG Wordmark Vectorizado Grande */}
              <img
                src="/img/anida-wordmark.svg"
                alt="ANIDA"
                className="h-8 sm:h-11 md:h-12 w-auto object-contain transition-transform group-hover:scale-103 duration-300"
              />
            </Link>
          </div>


          {/* Iconos de Acción Derecha */}
          <div className="flex items-center space-x-3.5 sm:space-x-5">
            {/* Buscador */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-charcoal-800 hover:text-charcoal-950 transition-colors p-1"
              aria-label="Buscar prendas"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Cuenta / Inicio de Sesión */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-1.5 text-xs text-charcoal-900 font-medium hover:text-charcoal-600 uppercase tracking-wider p-1"
                  title="Mi Cuenta"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden md:inline text-[11px] font-normal">{user.name.split(" ")[0]}</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="text-charcoal-800 hover:text-charcoal-950 transition-colors flex items-center space-x-1 p-1"
                  title="Iniciar Sesión"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              )}

              {/* Menú de Usuario autenticado */}
              {userDropdownOpen && user && (
                <div className="absolute right-0 mt-3 w-52 bg-white border border-charcoal-200 shadow-xl py-2 z-50 animate-fadeIn text-xs">
                  <div className="px-4 py-2 border-b border-charcoal-100">
                    <p className="font-medium text-charcoal-950 truncate">{user.name}</p>
                    <p className="text-[10px] text-charcoal-400 truncate">{user.email}</p>
                  </div>

                  {/* Acceso exclusivo al CMS solo si es administrador */}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-charcoal-900 hover:bg-charcoal-50 font-semibold text-[11px] uppercase tracking-wider"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Panel CMS ANIDA</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-left text-rose-600 hover:bg-rose-50 text-[11px] uppercase tracking-wider"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              )}
            </div>

            {/* Disparador de Carrito */}
            <button
              onClick={openCart}
              className="relative text-charcoal-800 hover:text-charcoal-950 transition-colors flex items-center p-1"
              aria-label={`Ver bolsa con ${cartCount} prendas`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-charcoal-950 text-white text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center animate-scaleIn">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Buscador Desplegable */}
        {searchOpen && (
          <div className="w-full bg-background border-t border-b border-charcoal-200 py-4 px-6 transition-all duration-300">
            <div className="max-w-2xl mx-auto flex items-center space-x-3">
              <Search className="w-4 h-4 text-charcoal-400" />
              <input
                type="text"
                placeholder="BUSCAR TOPS, BOTTOMS, JACKETS, LEOTARDOS..."
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
              <button onClick={() => setSearchOpen(false)} aria-label="Cerrar búsqueda">
                <X className="w-4 h-4 text-charcoal-500 hover:text-charcoal-900" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Menú Lateral Móvil */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-background h-full p-6 flex flex-col justify-between shadow-2xl z-10">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-charcoal-200">
                <img
                  src="/img/anida-wordmark.svg"
                  alt="ANIDA"
                  className="h-8 w-auto object-contain"
                />

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-charcoal-800 hover:text-charcoal-950"
                  aria-label="Cerrar menú"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 flex flex-col space-y-4">
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs tracking-widest uppercase font-semibold text-charcoal-950 pb-2 border-b border-charcoal-100"
                >
                  Ver Todo el Catálogo
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-xs tracking-widest uppercase font-medium ${
                      link.isHighlight ? "text-rose-700 font-semibold" : "text-charcoal-700 hover:text-charcoal-950"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-charcoal-200 space-y-3">
              {user ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-charcoal-900">{user.name}</p>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs uppercase font-medium text-charcoal-900 tracking-wider"
                    >
                      Acceso al Panel CMS
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-rose-600 uppercase tracking-wider"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-block text-xs uppercase font-medium text-charcoal-900 tracking-wider"
                >
                  Iniciar Sesión / Cuenta
                </Link>
              )}
              <p className="text-[10px] text-charcoal-400 uppercase tracking-widest pt-2">
                ANIDA • Envíos a todo México
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

