"use client";

import React, { useState } from "react";
import { useStoreData } from "@/context/StoreDataContext";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { convertImageToWebP } from "@/lib/imageOptimizer";
import { Plus, Edit2, Trash2, Check, X, Upload, Sparkles, Image as ImageIcon } from "lucide-react";

export default function AdminInventoryPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useStoreData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Tops");
  const [formPrice, setFormPrice] = useState<number>(890);
  const [formComparePrice, setFormComparePrice] = useState<number | undefined>(undefined);
  const [formDesc, setFormDesc] = useState("");
  const [formMaterials, setFormMaterials] = useState("");
  const [formPrimaryImg, setFormPrimaryImg] = useState("");
  const [formHoverImg, setFormHoverImg] = useState("");
  const [formSizes, setFormSizes] = useState("XS, S, M, L");
  const [compressionStats, setCompressionStats] = useState<string | null>(null);

  const openNewModal = () => {
    setEditingProduct(null);
    setFormTitle("");
    setFormCategory("Tops");
    setFormPrice(890);

    setFormComparePrice(undefined);
    setFormDesc("");
    setFormMaterials("");
    setFormPrimaryImg("");
    setFormHoverImg("");
    setFormSizes("XS, S, M, L");
    setCompressionStats(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormTitle(p.title);
    setFormCategory(p.category);
    setFormPrice(p.price);
    setFormComparePrice(p.compareAtPrice);
    setFormDesc(p.description);
    setFormMaterials(p.materialsCare || "");
    setFormPrimaryImg(p.images.primary);
    setFormHoverImg(p.images.hover);
    setFormSizes(p.sizes.join(", "));
    setCompressionStats(null);
    setIsModalOpen(true);
  };

  // Conversión automática a WebP al seleccionar archivo de foto principal
  const handlePrimaryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOptimizing(true);
    try {
      const result = await convertImageToWebP(file, 1400, 0.85);
      setFormPrimaryImg(result.dataUrl);
      const savings = Math.round((1 - result.optimizedSize / result.originalSize) * 100);
      setCompressionStats(
        `✓ Imagen convertida a WebP (${Math.round(result.optimizedSize / 1024)} KB - ${savings}% más ligera)`
      );
    } catch (err) {
      console.error(err);
      alert("Error al procesar la imagen.");
    } finally {
      setIsOptimizing(false);
    }
  };

  // Conversión automática a WebP al seleccionar foto trasera (hover)
  const handleHoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOptimizing(true);
    try {
      const result = await convertImageToWebP(file, 1400, 0.85);
      setFormHoverImg(result.dataUrl);
    } catch (err) {
      console.error(err);
      alert("Error al procesar la imagen.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPrimaryImg) {
      alert("Por favor selecciona al menos la foto principal de la prenda.");
      return;
    }

    const sizesArray = formSizes.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
    const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      title: formTitle,
      slug,
      category: formCategory,
      price: Number(formPrice),
      compareAtPrice: formComparePrice ? Number(formComparePrice) : undefined,
      description: formDesc,
      materialsCare: formMaterials,
      isNew: true,
      colors: [
        { name: "Off White", hex: "#F4F1EA" },
        { name: "Charcoal", hex: "#161616" },
      ],
      sizes: sizesArray,
      images: {
        primary: formPrimaryImg,
        hover: formHoverImg || formPrimaryImg,
        gallery: [formPrimaryImg, formHoverImg || formPrimaryImg].filter(Boolean),
      },
      variants: sizesArray.map((sz, idx) => ({
        id: `v-${Date.now()}-${idx}`,
        sku: `${slug.slice(0, 4).toUpperCase()}-${sz}`,
        size: sz,
        colorName: "Off White",
        colorHex: "#F4F1EA",
        stock: 10,
      })),
    };

    if (editingProduct) {
      updateProduct(productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Deseas eliminar permanentemente esta prenda?")) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-200">
        <div>
          <span className="text-[11px] font-semibold tracking-widest text-charcoal-500 uppercase">
            Gestión de Catálogo
          </span>
          <h1 className="text-2xl font-light tracking-tight text-charcoal-950 uppercase">
            Inventario & Variantes
          </h1>
        </div>

        <button
          onClick={openNewModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-charcoal-950 text-white text-xs tracking-wider uppercase font-semibold hover:bg-charcoal-800 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ Agregar Nueva Prenda</span>
        </button>
      </div>

      {/* Tabla o Estado Vacío */}
      {products.length === 0 ? (
        <div className="bg-white border border-dashed border-charcoal-300 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-charcoal-100 flex items-center justify-center text-charcoal-400 mx-auto">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-medium uppercase tracking-wider text-charcoal-800">
              No hay prendas registradas todavía
            </h3>
            <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
              Haz clic en <strong>Agregar Nueva Prenda</strong> para subir tus fotografías locales (se convertirán automáticamente a WebP optimizado).
            </p>
          </div>
          <button
            onClick={openNewModal}
            className="px-6 py-3 bg-charcoal-950 text-white text-xs tracking-widest uppercase font-semibold hover:bg-charcoal-800"
          >
            Subir Primera Prenda
          </button>
        </div>
      ) : (
        <div className="bg-white border border-charcoal-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-50 border-b border-charcoal-200 text-charcoal-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Prenda (WebP)</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Precio (MXN)</th>
                  <th className="py-3 px-4">Tallas</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100 text-charcoal-800">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-charcoal-50/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-14 bg-charcoal-100 shrink-0 overflow-hidden">
                          <img
                            src={product.images.primary}
                            alt={product.title}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div>
                          <p className="font-medium uppercase text-charcoal-950">{product.title}</p>
                          <span className="text-[10px] text-emerald-700 font-mono font-medium">Formato WebP</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 uppercase text-[11px] font-medium text-charcoal-600">
                      {product.category}
                    </td>
                    <td className="py-3 px-4 font-semibold text-charcoal-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-1">
                        {product.sizes.map((s) => (
                          <span key={s} className="px-1.5 py-0.5 bg-charcoal-100 text-[10px] font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 text-charcoal-600 hover:text-charcoal-950"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 text-rose-600 hover:text-rose-800"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Crear / Editar con conversor WebP integrado y Vista Previa en Vivo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-charcoal-950/70 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-5xl p-6 sm:p-8 shadow-2xl border border-charcoal-200 z-10 space-y-5 animate-scaleIn">
            <div className="flex justify-between items-center pb-3 border-b border-charcoal-200">
              <div>
                <span className="text-[10px] uppercase font-semibold tracking-widest text-emerald-800">
                  {editingProduct ? "Modo Edición" : "Nueva Prenda"}
                </span>
                <h3 className="text-base font-semibold tracking-tight uppercase text-charcoal-900">
                  {editingProduct ? "Editar Prenda" : "Registrar Nueva Prenda (Conversión WebP Automática)"}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-charcoal-400 hover:text-charcoal-900 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Columna Izquierda: Formulario */}
              <form onSubmit={handleSaveProduct} className="lg:col-span-7 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-charcoal-700 font-medium">
                      Nombre de la Prenda *
                    </label>
                    <input
                      required
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="ej. Top Deportivo Aerodynamic Sculpt"
                      className="w-full px-3.5 py-2.5 border border-charcoal-200 uppercase focus:border-charcoal-900 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-charcoal-700 font-medium">Categoría *</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-charcoal-200 focus:border-charcoal-900 focus:outline-none uppercase"
                    >
                      <option value="Tops">Tops</option>
                      <option value="Bottoms">Bottoms</option>
                      <option value="Jackets">Jackets</option>
                      <option value="Leotardos">Leotardos</option>
                      <option value="Accesorios">Accesorios</option>
                      <option value="Sales">Sales</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-charcoal-700 font-medium">Precio MXN *</label>
                    <input
                      required
                      type="number"
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 border border-charcoal-200 focus:border-charcoal-900 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-charcoal-700 font-medium">
                      Precio de Oferta / Comparación (Opcional)
                    </label>
                    <input
                      type="number"
                      value={formComparePrice || ""}
                      onChange={(e) => setFormComparePrice(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="ej. 1200 (si tiene descuento)"
                      className="w-full px-3.5 py-2 border border-charcoal-200 focus:border-charcoal-900 focus:outline-none"
                    />
                  </div>

                  {/* Subida de Foto Principal con Conversión Automática a WebP */}
                  <div className="space-y-1 sm:col-span-1">
                    <label className="text-[11px] uppercase tracking-wider text-charcoal-700 font-medium">
                      Foto Principal (Conversor WebP) *
                    </label>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-charcoal-200 hover:border-charcoal-900 p-4 cursor-pointer bg-charcoal-50 transition-colors">
                      {formPrimaryImg ? (
                        <div className="flex items-center space-x-2">
                          <img src={formPrimaryImg} alt="Preview" className="w-10 h-14 object-cover border border-charcoal-200" />
                          <span className="text-[10px] text-emerald-800 font-semibold uppercase">Reemplazar WebP</span>
                        </div>
                      ) : (
                        <div className="text-center space-y-1">
                          <Upload className="w-5 h-5 text-charcoal-400 mx-auto" />
                          <span className="text-[11px] text-charcoal-600 block">Subir foto frontal</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePrimaryFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Subida de Foto Hover/Lookbook */}
                  <div className="space-y-1 sm:col-span-1">
                    <label className="text-[11px] uppercase tracking-wider text-charcoal-700 font-medium">
                      Foto Ángulo 2 / Hover (Opcional WebP)
                    </label>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-charcoal-200 hover:border-charcoal-900 p-4 cursor-pointer bg-charcoal-50 transition-colors">
                      {formHoverImg ? (
                        <div className="flex items-center space-x-2">
                          <img src={formHoverImg} alt="Preview Hover" className="w-10 h-14 object-cover border border-charcoal-200" />
                          <span className="text-[10px] text-emerald-800 font-semibold uppercase">Reemplazar WebP</span>
                        </div>
                      ) : (
                        <div className="text-center space-y-1">
                          <Upload className="w-5 h-5 text-charcoal-400 mx-auto" />
                          <span className="text-[11px] text-charcoal-600 block">Subir foto trasera/ángulo</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHoverFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {compressionStats && (
                    <div className="sm:col-span-2 text-[11px] text-emerald-700 bg-emerald-50 p-2.5 border border-emerald-200">
                      {compressionStats}
                    </div>
                  )}

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-charcoal-700 font-medium">
                      Tallas Disponibles (Separadas por comas) *
                    </label>
                    <input
                      type="text"
                      value={formSizes}
                      onChange={(e) => setFormSizes(e.target.value)}
                      placeholder="XS, S, M, L, XL"
                      className="w-full px-3 py-2 border border-charcoal-200 focus:border-charcoal-900 focus:outline-none uppercase"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-charcoal-700 font-medium">Descripción y Corte</label>
                    <textarea
                      rows={2}
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="Detalles sobre el soporte, tejido, ajuste y rendimiento."
                      className="w-full px-3 py-2 border border-charcoal-200 focus:border-charcoal-900 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-charcoal-700 font-medium">Materiales & Cuidados</label>
                    <input
                      type="text"
                      value={formMaterials}
                      onChange={(e) => setFormMaterials(e.target.value)}
                      placeholder="ej. 82% Poliamida, 18% Spandex. Lavar en agua fría."
                      className="w-full px-3 py-2 border border-charcoal-200 focus:border-charcoal-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end space-x-3 border-t border-charcoal-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 border border-charcoal-200 text-charcoal-700 uppercase tracking-wider hover:bg-charcoal-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isOptimizing}
                    className="px-6 py-2.5 bg-charcoal-950 text-white uppercase tracking-wider font-semibold hover:bg-charcoal-800 disabled:opacity-50 transition-colors shadow-xs"
                  >
                    {isOptimizing ? "Procesando WebP..." : "Guardar Prenda"}
                  </button>
                </div>
              </form>

              {/* Columna Derecha: Vista Previa en Vivo de la Prenda */}
              <div className="lg:col-span-5 bg-charcoal-50 p-5 border border-charcoal-200 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-charcoal-200 text-[11px] uppercase tracking-wider text-charcoal-600 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-charcoal-800" />
                      Vista Previa en Tienda
                    </span>
                    <span className="text-emerald-700 font-normal">Simulación en Vivo</span>
                  </div>

                  {/* Tarjeta Simulada en Vivo */}
                  <div className="mt-3 bg-white p-3 border border-charcoal-200 shadow-sm max-w-xs mx-auto space-y-3">
                    {/* Imagen de la tarjeta */}
                    <div className="relative aspect-[3/4] bg-charcoal-100 overflow-hidden group">
                      {formPrimaryImg ? (
                        <img
                          src={formPrimaryImg}
                          alt="Preview"
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-charcoal-400 p-4 text-center space-y-1">
                          <ImageIcon className="w-8 h-8 stroke-1" />
                          <span className="text-[10px] uppercase tracking-wider">Sube una foto para previsualizar</span>
                        </div>
                      )}

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <span className="px-1.5 py-0.5 bg-pastel-sage text-charcoal-950 text-[9px] font-semibold uppercase tracking-widest">
                          Nuevo
                        </span>
                        {formComparePrice && (
                          <span className="px-1.5 py-0.5 bg-pastel-rose text-charcoal-950 text-[9px] font-semibold uppercase tracking-widest">
                            Sale
                          </span>
                        )}
                      </div>

                      {/* Tallas en Hover simuladas */}
                      <div className="absolute bottom-0 inset-x-0 bg-white/95 py-1.5 px-2 flex justify-center items-center gap-1">
                        {formSizes.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4).map((sz) => (
                          <span key={sz} className="px-1.5 py-0.5 bg-charcoal-100 text-[9px] font-medium uppercase">
                            {sz}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Metadatos */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-semibold text-charcoal-400">
                        ANIDA • {formCategory}
                      </span>
                      <h4 className="text-xs font-light uppercase text-charcoal-950 line-clamp-1">
                        {formTitle || "Nombre de la Prenda"}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="font-semibold text-charcoal-900">
                          {formatPrice(formPrice || 0)} MXN
                        </span>
                        {formComparePrice && (
                          <span className="text-charcoal-400 line-through text-[10px]">
                            {formatPrice(formComparePrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-charcoal-500 bg-white p-2.5 border border-charcoal-200 space-y-1">
                  <p className="font-medium text-charcoal-800 uppercase tracking-wider">✓ Optimización WebP Activa</p>
                  <p>Las imágenes se comprimen a alta resolución con reducción de hasta 85% en peso para velocidad ultrarrápida.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
