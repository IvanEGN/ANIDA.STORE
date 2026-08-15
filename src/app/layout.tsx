import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/common/Navbar";
import { SlideCartDrawer } from "@/components/common/SlideCartDrawer";
import { Footer } from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "anida.store | Moda Minimalista & Sastrería Contemporánea",
  description:
    "Tienda en línea de moda minimalista, cortes contemporáneos, lino orgánico y siluetas depuradas. Inspirado en el diseño limpio.",
  keywords: ["anida", "moda minimalista", "ropa online", "sastrería", "lino orgánico", "vestidos", "zara aesthetic"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-background text-charcoal-950 antialiased font-sans">
        <CartProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <SlideCartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
