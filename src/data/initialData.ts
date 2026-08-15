import { Product, HomeBannerData, OrderRecord } from "@/types";

export const INITIAL_BANNERS: HomeBannerData[] = [
  {
    id: "banner-main",
    tagline: "COLECCIÓN ATELIER // EDICIÓN LIMITADA",
    title: "SILUETAS PURAS & ESTRUCTURA MINIMAL",
    subtitle: "Prendas de corte depurado y materiales de la más alta calidad.",
    ctaText: "DESCUBRIR COLECCIÓN",
    ctaLink: "/shop",
    mediaType: "IMAGE",
    mediaUrl: "", // Limpio para carga de imagen WebP por el usuario
    isActive: true,
  },
];

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_ORDERS: OrderRecord[] = [];
