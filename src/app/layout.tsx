import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { StoreDataProvider } from "@/context/StoreDataContext";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/common/Navbar";
import { SlideCartDrawer } from "@/components/common/SlideCartDrawer";
import { Footer } from "@/components/common/Footer";
import { WhatsAppFloatingButton } from "@/components/common/WhatsAppFloatingButton";
import { prisma } from "@/lib/prisma";
import { Product, HomeBannerData } from "@/types";

export const metadata: Metadata = {
  title: "ANIDA | Alto Rendimiento & Estética Contemporánea",
  description:
    "Ropa deportiva de alto rendimiento diseñada para almas libres, modernas y audaces. Tops, bottoms, jackets, leotardos y accesorios.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

// Leer todos los datos de MySQL en el servidor antes de renderizar
async function getServerData(): Promise<{
  products: Product[];
  banners: HomeBannerData[];
  announcement: string;
}> {
  try {
    const [dbProducts, dbBanners, dbSettings] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        include: { variants: true, images: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.homeBanner.findMany({
        orderBy: { displayOrder: "asc" },
      }),
      prisma.storeSetting.findUnique({ where: { key: "announcement_bar" } }),
    ]);

    const products: Product[] = dbProducts.map((p) => {
      const rawImgs = p.rawImagesJson as any;
      const rawCols = p.rawColorsJson as any;
      const rawSzs = p.rawSizesJson as any;
      const primaryImg =
        rawImgs?.primary ||
        p.images.find((i) => i.isPrimary)?.imageUrl ||
        p.images[0]?.imageUrl ||
        "";
      const hoverImg = rawImgs?.hover || p.images[1]?.imageUrl || primaryImg;
      const gallery = rawImgs?.gallery || p.images.map((i) => i.imageUrl);
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category,
        price: Number(p.basePrice),
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
        description: p.description,
        materialsCare: p.materialsCare || undefined,
        isNew: p.isNew,
        featured: p.featured,
        images: {
          primary: primaryImg,
          hover: hoverImg,
          gallery: gallery.length > 0 ? gallery : [primaryImg],
        },
        colors: Array.isArray(rawCols) ? rawCols : [{ name: "Off White", hex: "#F4F1EA" }],
        sizes: Array.isArray(rawSzs) ? rawSzs : ["XS", "S", "M", "L"],
        variants: p.variants.map((v) => ({
          id: v.id,
          sku: v.sku,
          size: v.size,
          colorName: v.colorName,
          colorHex: v.colorHex,
          stock: v.stockQuantity,
          priceAdjustment: Number(v.priceAdjustment),
        })),
      };
    });

    const banners: HomeBannerData[] = dbBanners.map((b) => ({
      id: b.id,
      title: b.title,
      subtitle: b.subtitle || "",
      ctaText: b.ctaText || "",
      ctaLink: b.ctaLink || "",
      mediaType: (b.mediaType as "IMAGE" | "VIDEO") || "IMAGE",
      mediaUrl: b.mediaUrl || "",
      mobileMediaUrl: b.mobileMediaUrl || "",
      tagline: b.tagline || undefined,
      isActive: b.isActive,
      displayOrder: b.displayOrder,
    }));

    const announcement =
      dbSettings?.value || "Envío sin costo en compras mayores a $1,499 MXN • Diseñado para almas libres y audaces";

    return { products, banners, announcement };
  } catch (e) {
    console.error("[RootLayout] Error leyendo MySQL:", e);
    return {
      products: [],
      banners: [],
      announcement: "Envío sin costo en compras mayores a $1,499 MXN • Diseñado para almas libres y audaces",
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { products, banners, announcement } = await getServerData();

  return (
    <html lang="es" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-background text-charcoal-950 antialiased font-sans">
        <AuthProvider>
          <StoreDataProvider
            initialProducts={products}
            initialBanners={banners}
            initialAnnouncement={announcement}
          >
            <CartProvider>
              <Navbar />
              <main className="flex-1 w-full">{children}</main>
              <SlideCartDrawer />
              <Footer />
              <WhatsAppFloatingButton />
            </CartProvider>
          </StoreDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
