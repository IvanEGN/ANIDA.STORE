"use client";

import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { EditorialSection } from "@/components/home/EditorialSection";
import { ProductCatalog } from "@/components/shop/ProductCatalog";
import { useStoreData } from "@/context/StoreDataContext";
import Link from "next/link";

export default function HomePage() {
  const { banners } = useStoreData();
  const activeBanner = banners[0];

  return (
    <div className="w-full">
      {/* 1. Hero Section Principal */}
      <HeroSection
        tagline={activeBanner?.tagline}
        title={activeBanner?.title}
        subtitle={activeBanner?.subtitle}
        ctaText={activeBanner?.ctaText}
        ctaLink={activeBanner?.ctaLink}
        mediaType={activeBanner?.mediaType}
        mediaUrl={activeBanner?.mediaUrl}
      />

      {/* 2. Catálogo Principal */}
      <ProductCatalog />

      {/* 3. Sección Editorial y Lookbook */}
      <EditorialSection />
    </div>
  );
}
