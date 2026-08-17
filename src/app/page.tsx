"use client";

import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { EditorialSection } from "@/components/home/EditorialSection";
import { ProductCatalog } from "@/components/shop/ProductCatalog";

export default function HomePage() {

  return (
    <div className="w-full">
      {/* 1. Hero Carousel Principal */}
      <HeroSection />

      {/* 2. Catálogo Principal con las 6 Categorías */}
      <ProductCatalog />

      {/* 3. Sección Editorial y Manifiesto ANIDA */}
      <EditorialSection />
    </div>
  );
}

