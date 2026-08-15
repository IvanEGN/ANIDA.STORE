"use client";

import React from "react";
import { notFound } from "next/navigation";
import { useStoreData } from "@/context/StoreDataContext";
import { ProductDetailsView } from "@/components/product/ProductDetailsView";
import { ProductCard } from "@/components/shop/ProductCard";
import Link from "next/link";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const { products } = useStoreData();
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
        <h1 className="text-xl uppercase font-light text-charcoal-900 tracking-widest">
          Prenda no encontrada
        </h1>
        <p className="text-xs text-charcoal-500">
          La prenda solicitada no está disponible o ha sido actualizada.
        </p>
        <Link
          href="/shop"
          className="px-6 py-3 bg-charcoal-950 text-white text-xs uppercase tracking-widest font-medium"
        >
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div>
      {/* Vista Detallada de la Prenda */}
      <ProductDetailsView product={product} />

      {/* Sección de Recomendaciones si hay más prendas */}
      {relatedProducts.length > 0 && (
        <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-16 border-t border-charcoal-200">
          <div className="mb-8">
            <span className="text-[11px] font-semibold tracking-editorial uppercase text-charcoal-400">
              Completa el Estilo
            </span>
            <h2 className="text-xl sm:text-2xl font-light tracking-tight text-charcoal-950 uppercase">
              Piezas Complementarias
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
