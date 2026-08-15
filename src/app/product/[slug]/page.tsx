import React from "react";
import { notFound } from "next/navigation";
import { INITIAL_PRODUCTS } from "@/data/initialData";
import { ProductDetailsView } from "@/components/product/ProductDetailsView";
import { ProductCard } from "@/components/shop/ProductCard";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return INITIAL_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = INITIAL_PRODUCTS.find((p) => p.slug === params.slug);

  if (!product) {
    return notFound();
  }

  const relatedProducts = INITIAL_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div>
      {/* Vista Detallada de la Prenda */}
      <ProductDetailsView product={product} />

      {/* Sección de Recomendaciones / Look Completo */}
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
    </div>
  );
}
