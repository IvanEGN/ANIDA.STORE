"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { SizeGuideModal } from "@/components/shop/SizeGuideModal";
import { SizeRequestModal } from "@/components/product/SizeRequestModal";
import { 
  ChevronDown, 
  Ruler, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Heart,
  Share2,
  Sparkles,
  HelpCircle,
  ShoppingBag
} from "lucide-react";


interface ProductDetailsViewProps {
  product: Product;
}

export const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: "Default", hex: "#161616" });
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || "S");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isSizeRequestOpen, setIsSizeRequestOpen] = useState(false);
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
        {/* Columna Izquierda: Galería Vertical de Fotos */}
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
              <span className="text-[11px] font-semibold tracking-editorial uppercase text-charcoal-500">
                ANIDA • {product.category}
              </span>
              {product.isNew && (
                <span className="px-2 py-0.5 bg-pastel-sage text-charcoal-950 text-[10px] font-semibold tracking-widest uppercase shadow-xs">
                  Nuevo Lanzamiento
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-charcoal-950 uppercase leading-snug">
              {product.title}
            </h1>
          </div>

          {/* Precio */}
          <div className="flex items-center space-x-3 text-lg">
            <span className="font-medium text-charcoal-950">
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

          {/* Selector de Talla con Registro de Tallas Futuras */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-charcoal-500 uppercase tracking-wider">Selecciona Talla:</span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="inline-flex items-center space-x-1 text-charcoal-700 hover:text-charcoal-950 underline text-[11px] uppercase tracking-wider"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Guía de Medidas</span>
              </button>
            </div>
            
            {/* Botones de tallas existentes */}
            <div className="grid grid-cols-4 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 text-xs font-medium tracking-wider uppercase border transition-all ${
                    selectedSize === size
                      ? "bg-charcoal-950 border-charcoal-950 text-white shadow-xs"
                      : "bg-transparent border-charcoal-200 text-charcoal-800 hover:border-charcoal-900"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* BOTÓN REGISTRAR TALLA PARA FUTURAS PRENDAS */}
            <div className="pt-1.5">
              <button
                type="button"
                onClick={() => setIsSizeRequestOpen(true)}
                className="w-full py-2 px-3 border border-dashed border-charcoal-300 hover:border-charcoal-950 bg-charcoal-50 hover:bg-charcoal-100 text-charcoal-700 hover:text-charcoal-950 text-[11px] font-medium uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors group"
              >
                <Sparkles className="w-3.5 h-3.5 text-charcoal-600 group-hover:text-charcoal-950" />
                <span>¿No encuentras tu talla? Registrarla para futuras prendas</span>
              </button>
            </div>
          </div>

          {/* Botón Añadir a la Bolsa (Grueso y Destacado) */}
          <div className="pt-3 space-y-3">
            <button
              onClick={handleAddToCart}
              className={`w-full py-5 sm:py-5.5 px-6 text-xs sm:text-sm font-bold tracking-[0.22em] uppercase transition-all duration-300 flex items-center justify-center space-x-2.5 shadow-lg active:scale-99 ${
                addedSuccess
                  ? "bg-emerald-800 text-white ring-2 ring-emerald-600 ring-offset-2"
                  : "bg-charcoal-950 hover:bg-black text-white hover:shadow-xl hover:shadow-charcoal-950/20"
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-5 h-5 stroke-[2.5]" />
                  <span>Añadido a la Bolsa</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4.5 h-4.5" />
                  <span>Añadir a la Bolsa</span>
                </>
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
              <span>Devoluciones Garantizadas</span>
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
                <span>Descripción & Rendimiento</span>
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
                <span>Tecnología Textil & Cuidados</span>
                <ChevronDown
                  className={`w-4 h-4 transform transition-transform ${
                    openAccordions.materials ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openAccordions.materials && (
                <p className="mt-2 text-xs text-charcoal-600 font-light leading-relaxed">
                  {product.materialsCare || "Fibras de alto rendimiento y secado rápido. Seguir instrucciones en etiqueta."}
                </p>
              )}
            </div>

            {/* Envíos & Pasarelas */}
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
                  <p>• Entrega estándar de 2 a 4 días hábiles en toda la República Mexicana.</p>
                  <p>• Métodos de pago seguros: Tarjeta de crédito / débito y Transferencia electrónica SPEI directa.</p>
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

      {/* Modal Registrar Talla para Futuras Prendas */}
      <SizeRequestModal
        isOpen={isSizeRequestOpen}
        onClose={() => setIsSizeRequestOpen(false)}
        productId={product.id}
        productTitle={product.title}
        productImage={product.images.primary}
      />
    </div>
  );
};

