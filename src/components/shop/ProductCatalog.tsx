"use client";

import React, { useState, useMemo } from "react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

interface ProductCatalogProps {
  initialProducts: Product[];
  initialCategory?: string;
  initialFilter?: string;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  initialProducts,
  initialCategory = "ALL",
  initialFilter,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSize, setSelectedSize] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const categories = ["ALL", "Novedades", "Sastrería", "Vestidos", "Pantalones", "Tops", "Faldas"];
  const sizes = ["ALL", "XS", "S", "M", "L"];

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Filtro de Categoría
      if (selectedCategory === "Novedades") {
        if (!product.isNew) return false;
      } else if (selectedCategory !== "ALL" && product.category !== selectedCategory) {
        return false;
      }

      // Filtro de Talla
      if (selectedSize !== "ALL" && !product.sizes.includes(selectedSize)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });
  }, [initialProducts, selectedCategory, selectedSize, sortBy]);

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-10 md:py-16 bg-background">
      {/* Encabezado y Categorías Pills */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-5 border-b border-charcoal-200 gap-4">
        <div>
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-editorial uppercase text-charcoal-400">
            Colección Atelier
          </span>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-charcoal-950 uppercase">
            {selectedCategory === "ALL" ? "Catálogo Completo" : selectedCategory}
          </h2>
        </div>

        {/* Categorías estilo Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-4 py-2 rounded-full tracking-wider uppercase transition-all duration-200 shrink-0 ${
                selectedCategory === cat
                  ? "bg-charcoal-900 text-white font-medium shadow-xs"
                  : "bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200"
              }`}
            >
              {cat === "ALL" ? "Ver Todo" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Barra de Filtros Rápidos (Talla y Orden) */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 text-xs text-charcoal-700">
        <div className="flex items-center space-x-3">
          <span className="text-charcoal-400 uppercase tracking-wider text-[11px]">Talla:</span>
          <div className="flex items-center space-x-1">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                  selectedSize === s
                    ? "border-charcoal-900 bg-charcoal-900 text-white"
                    : "border-charcoal-200 hover:border-charcoal-400 text-charcoal-700"
                }`}
              >
                {s === "ALL" ? "Todas" : s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-charcoal-400 uppercase tracking-wider text-[11px]">Ordenar:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent border border-charcoal-200 px-3 py-1.5 text-xs text-charcoal-800 focus:outline-none focus:border-charcoal-900 uppercase tracking-wider"
          >
            <option value="featured">Destacados</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
          </select>
        </div>
      </div>

      {/* Grid de Productos (2 cols móvil, 4 cols desktop) */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center text-charcoal-500 space-y-3">
          <p className="text-sm uppercase tracking-widest">No se encontraron prendas con estos filtros</p>
          <button
            onClick={() => {
              setSelectedCategory("ALL");
              setSelectedSize("ALL");
            }}
            className="text-xs uppercase tracking-widest font-semibold underline text-charcoal-900"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 lg:gap-y-14">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
