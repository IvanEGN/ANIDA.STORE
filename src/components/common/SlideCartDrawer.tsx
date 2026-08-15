"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Tag } from "lucide-react";

export const SlideCartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    cartCount,
    subtotal,
    shippingThreshold,
    shippingCost,
    freeShippingProgress,
    discountCode,
    discountAmount,
    applyDiscount,
    removeDiscount,
    total,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyDiscount(promoInput);
    setPromoMessage({ text: res.message, error: !res.success });
    if (res.success) setPromoInput("");
  };

  const remainingForFreeShipping = Math.max(0, shippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Fondo desenfocado oscuro */}
      <div
        className="fixed inset-0 bg-charcoal-950/50 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-background shadow-2xl flex flex-col justify-between">
          {/* Header del Carrito */}
          <div className="px-6 py-5 border-b border-charcoal-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold tracking-editorial uppercase text-charcoal-900">
                Tu Carrito
              </span>
              <span className="text-xs text-charcoal-400">({cartCount} {cartCount === 1 ? "artículo" : "artículos"})</span>
            </div>
            <button
              onClick={closeCart}
              className="text-charcoal-500 hover:text-charcoal-950 transition-colors p-1"
              aria-label="Cerrar carrito de compras"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Barra de Progreso de Envío Gratis */}
          <div className="px-6 py-3.5 bg-charcoal-50 border-b border-charcoal-200">
            <div className="flex justify-between items-center text-[11px] font-medium tracking-wider uppercase mb-1.5">
              <span className="text-charcoal-700">
                {remainingForFreeShipping === 0
                  ? "🎉 ¡Felicidades! Tienes Envío Gratis"
                  : `Agrega ${formatPrice(remainingForFreeShipping)} más para Envío Gratis`}
              </span>
              <span className="text-charcoal-500">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-1 bg-charcoal-200 overflow-hidden">
              <div
                className="h-full bg-charcoal-900 transition-all duration-500 ease-out"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Lista de Productos o Carrito Vacío */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-charcoal-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-charcoal-100 flex items-center justify-center text-charcoal-400">
                  <Tag className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium tracking-wider uppercase text-charcoal-800">
                  Tu bolsa de compras está vacía
                </p>
                <p className="text-xs text-charcoal-500 max-w-xs">
                  Explora las prendas exclusivas de nuestra nueva colección Atelier 2026.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-4 px-6 py-3 bg-charcoal-900 text-white text-xs tracking-widest uppercase hover:bg-charcoal-800 transition-colors"
                >
                  Explorar Prendas
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex space-x-4">
                  {/* Foto de la prenda */}
                  <div className="w-20 h-28 bg-charcoal-100 shrink-0 overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {/* Detalles */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-medium uppercase tracking-wider text-charcoal-900 line-clamp-1">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-charcoal-400 hover:text-charcoal-900 transition-colors ml-2"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-3 text-[11px] text-charcoal-500 mt-1">
                        <span>Talla: <strong className="text-charcoal-800 font-semibold">{item.size}</strong></span>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <span
                            className="w-2 h-2 rounded-full border border-charcoal-300"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <span>{item.colorName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      {/* Cantidad */}
                      <div className="flex items-center border border-charcoal-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-charcoal-600 hover:text-charcoal-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-medium text-charcoal-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-charcoal-600 hover:text-charcoal-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Precio */}
                      <span className="text-xs font-semibold text-charcoal-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer del Carrito con Resumen y Checkout */}
          {cart.length > 0 && (
            <div className="p-6 bg-charcoal-50 border-t border-charcoal-200 space-y-4">
              {/* Formulario Cupón */}
              {!discountCode ? (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="CUPÓN DE DESCUENTO (ej. ANIDA10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-[11px] uppercase tracking-wider bg-white border border-charcoal-200 focus:outline-none focus:border-charcoal-900"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-charcoal-200 text-charcoal-800 text-[11px] font-semibold tracking-widest uppercase hover:bg-charcoal-900 hover:text-white transition-colors"
                  >
                    Aplicar
                  </button>
                </form>
              ) : (
                <div className="flex justify-between items-center bg-pastel-butter/80 px-3 py-2 text-xs border border-charcoal-200">
                  <span className="font-medium text-charcoal-900">{discountCode}</span>
                  <button
                    onClick={removeDiscount}
                    className="text-[11px] text-charcoal-500 hover:text-charcoal-900 underline"
                  >
                    Quitar
                  </button>
                </div>
              )}

              {promoMessage && (
                <p className={`text-[10px] tracking-wide ${promoMessage.error ? "text-red-500" : "text-emerald-700"}`}>
                  {promoMessage.text}
                </p>
              )}

              {/* Desglose de Costes */}
              <div className="space-y-1.5 text-xs text-charcoal-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Descuento aplicado</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Envío estimado</span>
                  <span>{shippingCost === 0 ? "GRATIS" : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-charcoal-900 pt-2 border-t border-charcoal-200">
                  <span>Total Final</span>
                  <span>{formatPrice(total)} MXN</span>
                </div>
              </div>

              {/* Botón de Checkout */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center py-4 bg-charcoal-950 text-white text-xs font-semibold tracking-widest uppercase hover:bg-charcoal-800 transition-all duration-300 shadow-md group"
              >
                <span>Proceder al Pago</span>
                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Sellos de Pasarelas Aceptadas */}
              <div className="pt-2 flex flex-col items-center justify-center space-y-1 text-[10px] text-charcoal-400">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-charcoal-600" />
                  <span>Pago Seguro Encriptado SSL</span>
                </div>
                <span className="tracking-widest uppercase">Stripe • Mercado Pago • SPEI • PayPal</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
