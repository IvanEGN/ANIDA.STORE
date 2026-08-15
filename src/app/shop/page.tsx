"use client";

import React, { Suspense } from "react";
import { ProductCatalog } from "@/components/shop/ProductCatalog";
import { useSearchParams } from "next/navigation";

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || (searchParams.get("filter") === "new" ? "Novedades" : "ALL");
  const searchQuery = searchParams.get("search") || "";

  return (
    <ProductCatalog
      initialCategory={categoryParam}
      searchQuery={searchQuery}
    />
  );
}

export default function ShopPage() {
  return (
    <div className="pt-4 pb-16">
      <Suspense fallback={<div className="text-center py-20 text-xs text-charcoal-400">Cargando catálogo...</div>}>
        <ShopContent />
      </Suspense>
    </div>
  );
}
