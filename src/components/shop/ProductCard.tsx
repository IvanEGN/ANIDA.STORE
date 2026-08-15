"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: "Default", hex: "#161616" });
  const [recentlyAddedSize, setRecentlyAddedSize] = useState<string | null>(null);

  const handleQuickAdd = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();

    const matchingVariant = product.variants.find(
      (v) => v.size === size && v.colorName === selectedColor.name
    ) || product.variants.find((v) => v.size === size) || {
      id: `v-${size}`,
      sku: `${product.id}-${size}`,
      size,
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
      stock: 10,
    };

    addToCart({
      productId: product.id,
      variantId: matchingVariant.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      size: size,
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
      image: product.images.primary,
      quantity: 1,
    });

    setRecentlyAddedSize(size);
    setTimeout(() => setRecentlyAddedSize(null), 1500);
  };

  return (
    <article
      className="group flex flex-col cursor-pointer select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Contenedor de la Imagen Editorial con proporción 3:4 */}
      <div className="relative w-full aspect-[3/4] bg-charcoal-100 overflow-hidden mb-3">
        {/* Badges Pastel */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.isNew && (
            <span className="px-2 py-0.5 bg-pastel-sage/95 text-charcoal-950 text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase shadow-xs">
              Nuevo
            </span>
          )}
          {product.compareAtPrice && (
            <span className="px-2 py-0.5 bg-pastel-rose/95 text-charcoal-950 text-[9px] sm:text-[10px] font-semibold tracking-widest uppercase shadow-xs">
              Sale
            </span>
          )}
        </div>

        {/* Imagen Primaria & Hover Lookbook */}
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images.primary}
            alt={product.title}
            className={`w-full h-full object-cover object-top transition-all duration-700 ${
              isHovered ? "opacity-0 scale-103" : "opacity-100 scale-100"
            }`}
            loading="lazy"
          />
          <img
            src={product.images.hover}
            alt={`${product.title} ángulo alternativo`}
            className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ${
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-103"
            }`}
            loading="lazy"
          />
        </Link>

        {/* Barra de Selección Rápida de Talla en Hover (Estilo Zara / Alo Yoga) */}
        <div
          className={`absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md py-2.5 px-2 flex justify-center items-center gap-1.5 transition-all duration-300 transform ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          <span className="text-[10px] uppercase text-charcoal-500 font-medium mr-1 hidden sm:inline tracking-wider">
            Añadir:
          </span>
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={(e) => handleQuickAdd(e, size)}
              className={`w-7 h-7 text-[11px] font-medium transition-all duration-150 flex items-center justify-center ${
                recentlyAddedSize === size
                  ? "bg-emerald-800 text-white"
                  : "bg-charcoal-100 text-charcoal-800 hover:bg-charcoal-900 hover:text-white"
              }`}
              title={`Añadir talla ${size}`}
            >
              {recentlyAddedSize === size ? <Check className="w-3 h-3" /> : size}
            </button>
          ))}
        </div>
      </div>

      {/* Metadatos y Precios */}
      <div className="flex flex-col space-y-1">
        {/* Muestrarios de Colores */}
        <div className="flex items-center space-x-1.5 mb-0.5">
          {product.colors.map((c) => (
            <button
              key={c.name}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedColor(c);
              }}
              title={c.name}
              className={`w-2.5 h-2.5 rounded-full transition-transform ${
                selectedColor.name === c.name
                  ? "scale-125 ring-1 ring-charcoal-900 ring-offset-1"
                  : "hover:scale-110 border border-charcoal-300"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>

        {/* Título de la prenda */}
        <Link
          href={`/product/${product.slug}`}
          className="text-xs sm:text-sm font-light text-charcoal-950 tracking-tight hover:underline line-clamp-1 uppercase"
        >
          {product.title}
        </Link>

        {/* Precios */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="font-normal text-charcoal-900">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-charcoal-400 line-through text-[11px]">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
