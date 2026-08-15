import React from "react";
import { ProductCatalog } from "@/components/shop/ProductCatalog";
import { INITIAL_PRODUCTS } from "@/data/initialData";

interface ShopPageProps {
  searchParams: {
    category?: string;
    filter?: string;
    search?: string;
  };
}

export default function ShopPage({ searchParams }: ShopPageProps) {
  const categoryParam = searchParams.category || (searchParams.filter === "new" ? "Novedades" : "ALL");

  let filtered = INITIAL_PRODUCTS;
  if (searchParams.search) {
    const q = searchParams.search.toLowerCase();
    filtered = INITIAL_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  return (
    <div className="pt-4 pb-16">
      <ProductCatalog
        initialProducts={filtered}
        initialCategory={categoryParam}
      />
    </div>
  );
}
