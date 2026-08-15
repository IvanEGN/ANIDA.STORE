"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { SizeGuideModal } from "@/components/shop/SizeGuideModal";
import { 
  ChevronDown, 
  Ruler, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Heart,
  Share2 
} from "lucide-react";

interface ProductDetailsViewProps {
  product: Product;
}

export const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: "Default", hex: "#161616" });
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || "S");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Acordeones abiertos
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    details: true,
    materials: false,
    shipping: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddToCart = () => {
    const matchingVariant = product.variants.find(
      (v) => v.size === selectedSize && v.colorName === selectedColor.name
    ) || product.variants.find((v) => v.size === selectedSize) || {
      id: `v-${selectedSize}`,
      sku: `${product.id}-${selectedSize}`,
      size: selectedSize,
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
      stock: 10,
    };

    addToCart({
      productId: product.id,
      variantId: matchingVariant.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      size: selectedSize,
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
      image: product.images.primary,
      quantity: 1,
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12 bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        {/* Columna Izquierda: Galería Vertical de Fotos Sticky */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {product.images.gallery.map((imgUrl, index) => (
              <div
                key={index}
                className={`bg-charcoal-100 overflow-hidden ${
                  index === 0 ? "sm:col-span-2 aspect-[3/4]" : "aspect-[3/4]"
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${product.title} vista ${index + 1}`}
                  className="w-full h-full object-cover object-top hover:scale-102 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Columna Derecha: Panel de Compra Sticky */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 h-fit space-y-6">
          {/* Categoría & Título */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-editorial uppercase text-charcoal-400">
                {product.category}
              </span>
              {product.isNew && (
                <span className="px-2 py-0.5 bg-pastel-sage/90 text-charcoal-950 text-[10px] font-semibold tracking-widest uppercase">
                  Nuevo Atelier
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-charcoal-950 uppercase leading-snug">
              {product.title}
            </h1>
          </div>

          {/* Precio */}
          <div className="flex items-center space-x-3 text-lg">
            <span className="font-light text-charcoal-900">
              {formatPrice(product.price)} MXN
            </span>
            {product.compareAtPrice && (
              <span className="text-charcoal-400 line-through text-sm">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <hr className="border-charcoal-200" />

          {/* Selector de Color */}
          <div className="space-y-2.5">
            <div className="flex justify-between text-xs">
              <span className="text-charcoal-500 uppercase tracking-wider">Color:</span>
              <strong className="text-charcoal-900 font-medium">{selectedColor.name}</strong>
            </div>
            <div className="flex items-center space-x-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`w-7 h-7 rounded-full transition-all flex items-center justify-center ${
                    selectedColor.name === color.name
                      ? "ring-2 ring-charcoal-900 ring-offset-2 scale-110"
                      : "border border-charcoal-300 hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Selector de Talla */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-charcoal-500 uppercase tracking-wider">Selecciona Talla:</span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="inline-flex items-center space-x-1 text-charcoal-700 hover:text-charcoal-950 underline text-[11px] uppercase tracking-wider"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Guía de Tallas</span>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-xs font-medium tracking-wider uppercase border transition-all ${
                    selectedSize === size
                      ? "bg-charcoal-900 border-charcoal-900 text-white shadow-xs"
                      : "bg-transparent border-charcoal-200 text-charcoal-800 hover:border-charcoal-900"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Botón Añadir a la Bolsa */}
          <div className="pt-2 space-y-3">
            <button
              onClick={handleAddToCart}
              className={`w-full py-4.5 text-xs font-semibold tracking-widest uppercase transition-all duration-300 flex items-center justify-center space-x-2 ${
                addedSuccess
                  ? "bg-emerald-800 text-white"
                  : "bg-charcoal-950 hover:bg-charcoal-800 text-white shadow-md"
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Añadido al Carrito</span>
                </>
              ) : (
                <span>Añadir a la Bolsa</span>
              )}
            </button>
          </div>

          {/* Micro Beneficios */}
          <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-charcoal-200 text-[11px] text-charcoal-600">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-charcoal-500 shrink-0" />
              <span>Envío Gratis sobre $1,499</span>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCcw className="w-4 h-4 text-charcoal-500 shrink-0" />
              <span>30 Días para Devolución</span>
            </div>
          </div>

          {/* Acordeones de Información */}
          <div className="divide-y divide-charcoal-200 pt-2">
            {/* Detalles */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion("details")}
                className="w-full flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-charcoal-900 text-left"
              >
                <span>Descripción & Corte</span>
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${
                    openAccordions.details ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordions.details && (
                <p className="mt-2 text-xs text-charcoal-600 font-light leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {/* Materiales & Cuidados */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion("materials")}
                className="w-full flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-charcoal-900 text-left"
              >
                <span>Composición & Cuidados</span>
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${
                    openAccordions.materials ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordions.materials && (
                <p className="mt-2 text-xs text-charcoal-600 font-light leading-relaxed">
                  {product.materialsCare || "100% Hilaturas nobles seleccionadas. Seguir instrucciones en etiqueta."}
                </p>
              )}
            </div>

            {/* Envíos & Pagos */}
            <div className="py-3">
              <button
                onClick={() => toggleAccordion("shipping")}
                className="w-full flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-charcoal-900 text-left"
              >
                <span>Envíos & Pasarelas de Pago</span>
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${
                    openAccordions.shipping ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordions.shipping && (
                <div className="mt-2 space-y-2 text-xs text-charcoal-600 font-light leading-relaxed">
                  <p>• Entrega estándar de 2 a 4 días hábiles a todo México.</p>
                  <p>• Pasarelas integradas: Tarjetas (Stripe), Mercado Pago, Transferencias SPEI en tiempo real y PayPal Smart Checkout.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Guía de Tallas */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </div>
  );
};
