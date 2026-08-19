import { Product, HomeBannerData, OrderRecord, SizeRequestRecord } from "@/types";

export const INITIAL_BANNERS: HomeBannerData[] = [
  {
    id: "banner-1",
    tagline: "ANIDA // ALTO RENDIMIENTO & ESTÉTICA CONTEMPORÁNEA",
    title: "VIVE SIN LÍMITES EN CADA MOVIMIENTO",
    subtitle: "Ropa deportiva que fusiona tecnología textil con siluetas contemporáneas para entrenamiento y alta intensidad.",
    ctaText: "VER COLECCIÓN",
    ctaLink: "/shop",
    mediaType: "IMAGE",
    mediaUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=2000&q=85",
    isActive: true,
    displayOrder: 1,
  },
];

// Catálogo limpio y vacío para que el administrador agregue sus prendas reales
export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_ORDERS: OrderRecord[] = [];
export const INITIAL_SIZE_REQUESTS: SizeRequestRecord[] = [];
