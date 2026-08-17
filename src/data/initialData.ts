import { Product, HomeBannerData, OrderRecord, SizeRequestRecord } from "@/types";

export const INITIAL_BANNERS: HomeBannerData[] = [
  {
    id: "banner-1",
    tagline: "ANIDA // ALTO RENDIMIENTO & ESTÉTICA CONTEMPORÁNEA",
    title: "VIVE SIN LÍMITES EN CADA MOVIMIENTO",
    subtitle: "Diseñada para almas libres, modernas y audaces. Ropa deportiva que fusiona tecnología textil con siluetas contemporáneas.",
    ctaText: "VER COLECCIÓN",
    ctaLink: "/shop",
    mediaType: "IMAGE",
    mediaUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=2000&q=85",
    isActive: true,
    displayOrder: 1,
  },
  {
    id: "banner-2",
    tagline: "NEW ARRIVALS // LEOTARDOS & TOPS",
    title: "MÁS ALLÁ DEL ESCENARIO",
    subtitle: "La verdadera grandeza no está solo en el momento de la victoria, sino en cada paso del camino y en cada gota de sudor.",
    ctaText: "EXPLORAR LEOTARDOS",
    ctaLink: "/shop?category=Leotardos",
    mediaType: "IMAGE",
    mediaUrl: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=2000&q=85",
    isActive: true,
    displayOrder: 2,
  },
  {
    id: "banner-3",
    tagline: "EDICIÓN ESPECIAL // JACKETS & BOTTOMS",
    title: "DETERMINACIÓN, PASIÓN Y ESTILO",
    subtitle: "Acompañándote en cada momento del proceso, desde la preparación hasta la celebración de tus mayores logros.",
    ctaText: "VER NOVEDADES",
    ctaLink: "/shop?category=Jackets",
    mediaType: "IMAGE",
    mediaUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=2000&q=85",
    isActive: true,
    displayOrder: 3,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-top-1",
    title: "Top Deportivo Aerodynamic Sculpt",
    slug: "top-deportivo-aerodynamic-sculpt",
    category: "Tops",
    price: 890,
    compareAtPrice: 1100,
    description: "Top de compresión media con tecnología de secado rápido, soporte elástico ergonómico y espalda cruzada que maximiza el rango de movimiento.",
    materialsCare: "82% Microfibra Poliamida Reciclada, 18% Elastano. Lavar en ciclo delicado con agua fría.",
    isNew: true,
    featured: true,
    images: {
      primary: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1200&q=85",
      hover: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1200&q=85",
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=85",
      ],
    },
    colors: [
      { name: "Black Onyx", hex: "#121212" },
      { name: "Raw Sand", hex: "#E8E2D5" },
    ],
    sizes: ["XS", "S", "M", "L"],
    variants: [
      { id: "v-top1-xs", sku: "TOP-SCULPT-XS", size: "XS", colorName: "Black Onyx", colorHex: "#121212", stock: 12 },
      { id: "v-top1-s", sku: "TOP-SCULPT-S", size: "S", colorName: "Black Onyx", colorHex: "#121212", stock: 20 },
      { id: "v-top1-m", sku: "TOP-SCULPT-M", size: "M", colorName: "Black Onyx", colorHex: "#121212", stock: 15 },
      { id: "v-top1-l", sku: "TOP-SCULPT-L", size: "L", colorName: "Black Onyx", colorHex: "#121212", stock: 8 },
    ],
  },
  {
    id: "prod-bottom-1",
    title: "Leggings High-Rise Infinity Motion",
    slug: "leggings-high-rise-infinity-motion",
    category: "Bottoms",
    price: 1390,
    compareAtPrice: 1650,
    description: "Mallas de tiro alto con compresión estratégica de 4 vías, costuras planas anti-rozaduras y soporte lumbar reforzado para entrenamiento y uso diario.",
    materialsCare: "78% Poliéster Trazable de Alto Rendimiento, 22% Spandex. No usar suavizante ni secadora.",
    isNew: true,
    featured: true,
    images: {
      primary: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85",
      hover: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1200&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85",
      ],
    },
    colors: [
      { name: "Deep Charcoal", hex: "#1E1E1E" },
      { name: "Sage Earth", hex: "#8A9A86" },
    ],
    sizes: ["XS", "S", "M", "L"],
    variants: [
      { id: "v-bot1-xs", sku: "BOT-INF-XS", size: "XS", colorName: "Deep Charcoal", colorHex: "#1E1E1E", stock: 10 },
      { id: "v-bot1-s", sku: "BOT-INF-S", size: "S", colorName: "Deep Charcoal", colorHex: "#1E1E1E", stock: 18 },
      { id: "v-bot1-m", sku: "BOT-INF-M", size: "M", colorName: "Deep Charcoal", colorHex: "#1E1E1E", stock: 14 },
      { id: "v-bot1-l", sku: "BOT-INF-L", size: "L", colorName: "Deep Charcoal", colorHex: "#1E1E1E", stock: 6 },
    ],
  },
  {
    id: "prod-jacket-1",
    title: "Chaqueta Cortavientos Windrunner Pro",
    slug: "chaqueta-cortavientos-windrunner-pro",
    category: "Jackets",
    price: 1890,
    compareAtPrice: 2200,
    description: "Chaqueta ultraligera repelente al agua con ventilación dorsal microperforada, cremallera sellada y capucha ajustable con visera.",
    materialsCare: "100% Nylon Ripstop repelente al agua DWR. Lavado a máquina en frío.",
    isNew: true,
    featured: true,
    images: {
      primary: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=1200&q=85",
      hover: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=1200&q=85",
      ],
    },
    colors: [
      { name: "Matte Black", hex: "#161616" },
      { name: "Silver Ice", hex: "#D6D9DC" },
    ],
    sizes: ["S", "M", "L", "XL"],
    variants: [
      { id: "v-jkt1-s", sku: "JKT-WIND-S", size: "S", colorName: "Matte Black", colorHex: "#161616", stock: 8 },
      { id: "v-jkt1-m", sku: "JKT-WIND-M", size: "M", colorName: "Matte Black", colorHex: "#161616", stock: 12 },
      { id: "v-jkt1-l", sku: "JKT-WIND-L", size: "L", colorName: "Matte Black", colorHex: "#161616", stock: 10 },
      { id: "v-jkt1-xl", sku: "JKT-WIND-XL", size: "XL", colorName: "Matte Black", colorHex: "#161616", stock: 5 },
    ],
  },
  {
    id: "prod-leotardo-1",
    title: "Leotardo Performance Contour Elite",
    slug: "leotardo-performance-contour-elite",
    category: "Leotardos",
    price: 1590,
    compareAtPrice: 1950,
    description: "Pieza insignia de una sola silueta diseñada para gimnasia, danza y entrenamiento funcional. Corte estilizado que abraza las líneas del cuerpo con elasticidad de grado profesional.",
    materialsCare: "80% Poliamida Premium, 20% Elastano de alta tensión. Secar a la sombra.",
    isNew: true,
    featured: true,
    images: {
      primary: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=85",
      hover: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=85",
      ],
    },
    colors: [
      { name: "Midnight Black", hex: "#0E0E10" },
      { name: "Burgundy Velvet", hex: "#4A1521" },
    ],
    sizes: ["XS", "S", "M", "L"],
    variants: [
      { id: "v-leo1-xs", sku: "LEO-CONTOUR-XS", size: "XS", colorName: "Midnight Black", colorHex: "#0E0E10", stock: 15 },
      { id: "v-leo1-s", sku: "LEO-CONTOUR-S", size: "S", colorName: "Midnight Black", colorHex: "#0E0E10", stock: 22 },
      { id: "v-leo1-m", sku: "LEO-CONTOUR-M", size: "M", colorName: "Midnight Black", colorHex: "#0E0E10", stock: 16 },
      { id: "v-leo1-l", sku: "LEO-CONTOUR-L", size: "L", colorName: "Midnight Black", colorHex: "#0E0E10", stock: 9 },
    ],
  },
  {
    id: "prod-accesorio-1",
    title: "Bolsa Duffle Gym & Studio Waterproof",
    slug: "bolsa-duffle-gym-studio-waterproof",
    category: "Accesorios",
    price: 950,
    compareAtPrice: 1200,
    description: "Maleta de viaje y entrenamiento con compartimento ventilado para calzado, asas acolchadas ergonómicas y tejido impermeable de alta resistencia.",
    materialsCare: "Lona técnica resinada resistente al agua. Limpiar con paño húmedo.",
    isNew: true,
    featured: false,
    images: {
      primary: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85",
      hover: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85",
      ],
    },
    colors: [
      { name: "Stealth Black", hex: "#1A1A1A" },
    ],
    sizes: ["ÚNICA"],
    variants: [
      { id: "v-acc1-u", sku: "ACC-DUFFLE-U", size: "ÚNICA", colorName: "Stealth Black", colorHex: "#1A1A1A", stock: 30 },
    ],
  },
  {
    id: "prod-sale-1",
    title: "Shorts Compresión Biker Pro (Oferta Especial)",
    slug: "shorts-compresion-biker-pro-oferta",
    category: "Sales",
    price: 690,
    compareAtPrice: 990,
    description: "Shorts estilo ciclista con tiro alto anatómico, bolsillo lateral oculto para teléfono y tecnología sin transparencias.",
    materialsCare: "75% Poliamida, 25% Spandex.",
    isNew: false,
    featured: true,
    images: {
      primary: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85",
      hover: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1200&q=85",
      gallery: [
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85",
      ],
    },
    colors: [
      { name: "Onyx Black", hex: "#111111" },
    ],
    sizes: ["XS", "S", "M", "L"],
    variants: [
      { id: "v-sal1-xs", sku: "SAL-BIKER-XS", size: "XS", colorName: "Onyx Black", colorHex: "#111111", stock: 5 },
      { id: "v-sal1-s", sku: "SAL-BIKER-S", size: "S", colorName: "Onyx Black", colorHex: "#111111", stock: 8 },
      { id: "v-sal1-m", sku: "SAL-BIKER-M", size: "M", colorName: "Onyx Black", colorHex: "#111111", stock: 6 },
      { id: "v-sal1-l", sku: "SAL-BIKER-L", size: "L", colorName: "Onyx Black", colorHex: "#111111", stock: 4 },
    ],
  },
];

export const INITIAL_ORDERS: OrderRecord[] = [];
export const INITIAL_SIZE_REQUESTS: SizeRequestRecord[] = [];

