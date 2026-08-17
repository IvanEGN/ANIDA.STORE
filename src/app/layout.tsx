import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { StoreDataProvider } from "@/context/StoreDataContext";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/common/Navbar";
import { SlideCartDrawer } from "@/components/common/SlideCartDrawer";
import { Footer } from "@/components/common/Footer";
import { WhatsAppFloatingButton } from "@/components/common/WhatsAppFloatingButton";

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


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-background text-charcoal-950 antialiased font-sans">
        <AuthProvider>
          <StoreDataProvider>
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

