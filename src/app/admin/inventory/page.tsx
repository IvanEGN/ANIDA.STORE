"use client";

import React, { useState } from "react";
import { INITIAL_PRODUCTS } from "@/data/initialData";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Plus, Edit2, Trash2, Check, X, Image as ImageIcon } from "lucide-react";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Sastrería");
  const [formPrice, setFormPrice] = useState(1890);
  const [formComparePrice, setFormComparePrice] = useState<number | undefined>(undefined);
  const [formDesc, setFormDesc] = useState("");
  const [formMaterials, setFormMaterials] = useState("");
  const [formPrimaryImg, setFormPrimaryImg] = useState("");
  const [formHoverImg, setFormHoverImg] = useState("");
  const [formSizes, setFormSizes] = useState("XS, S, M, L");

  const openNewModal = () => {
    setEditingProduct(null);
    setFormTitle("");
    setFormCategory("Sastrería");
    setFormPrice(1890);
    setFormComparePrice(undefined);
    setFormDesc("Confeccionado en hilaturas nobles con acabado minimalista.");
    setFormMaterials("100% Algodón orgánico. Lavable a máquina.");
    setFormPrimaryImg("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80");
    setFormHoverImg("https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80");
    setFormSizes("XS, S, M, L");
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
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const sizesArray = formSizes.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
    const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                title: formTitle,
                slug,
                category: formCategory,
                price: Number(formPrice),
                compareAtPrice: formComparePrice ? Number(formComparePrice) : undefined,
                description: formDesc,
                materialsCare: formMaterials,
                sizes: sizesArray,
                images: {
                  primary: formPrimaryImg,
                  hover: formHoverImg,
                  gallery: [formPrimaryImg, formHoverImg],
                },
              }
            : p
        )
      );
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
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
          hover: formHoverImg,
          gallery: [formPrimaryImg, formHoverImg],
        },
        variants: sizesArray.map((sz, idx) => ({
          id: `v-new-${idx}`,
          sku: `${slug.slice(0, 4).toUpperCase()}-${sz}`,
          size: sz,
          colorName: "Off White",
          colorHex: "#F4F1EA",
          stock: 12,
        })),
      };
      setProducts([newProd, ...products]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta prenda del catálogo?")) {
      setProducts(products.filter((p) => p.id !== id));
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
          <span>Agregar Nueva Prenda</span>
        </button>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-white border border-charcoal-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-charcoal-50 border-b border-charcoal-200 text-charcoal-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Prenda</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Precio (MXN)</th>
                <th className="py-3 px-4">Tallas</th>
                <th className="py-3 px-4">Stock Total</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100 text-charcoal-800">
              {products.map((product) => {
                const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
                return (
                  <tr key={product.id} className="hover:bg-charcoal-50/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-14 bg-charcoal-100 shrink-0 overflow-hidden">
                          <img src={product.images.primary} alt={product.title} className="w-full h-full object-cover object-top" />
                        </div>
                        <div>
                          <p className="font-medium uppercase text-charcoal-950">{product.title}</p>
                          <span className="text-[10px] text-charcoal-400 font-mono">/{product.slug}</span>
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
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[11px] font-medium ${totalStock > 10 ? "text-emerald-800 bg-emerald-50" : "text-amber-800 bg-amber-50"}`}>
                        {totalStock} unidades
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 text-charcoal-600 hover:text-charcoal-950"
                          title="Editar prenda"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 text-rose-600 hover:text-rose-800"
                          title="Eliminar prenda"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear / Editar Prenda */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl p-6 sm:p-8 shadow-2xl border border-charcoal-200 z-10 space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-charcoal-200">
              <h3 className="text-sm font-semibold tracking-widest uppercase text-charcoal-900">
                {editingProduct ? "Editar Prenda" : "Crear Nueva Prenda"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-charcoal-400 hover:text-charcoal-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-charcoal-600">Nombre de la Prenda *</label>
                  <input
                    required
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="ej. Blazer Oversize Lino Estructurado"
                    className="w-full px-3 py-2 border border-charcoal-200 uppercase focus:border-charcoal-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-charcoal-600">Categoría *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-charcoal-200 focus:border-charcoal-900 focus:outline-none uppercase"
                  >
                    <option value="Sastrería">Sastrería</option>
                    <option value="Vestidos">Vestidos</option>
                    <option value="Pantalones">Pantalones</option>
                    <option value="Tops">Tops</option>
                    <option value="Faldas">Faldas</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-charcoal-600">Precio MXN *</label>
                  <input
                    required
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-charcoal-200 focus:border-charcoal-900 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-charcoal-600">Tallas Disponibles (Separadas por coma) *</label>
                  <input
                    type="text"
                    value={formSizes}
                    onChange={(e) => setFormSizes(e.target.value)}
                    placeholder="XS, S, M, L, XL"
                    className="w-full px-3 py-2 border border-charcoal-200 focus:border-charcoal-900 focus:outline-none uppercase"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-charcoal-600">URL Imagen Frontal (Principal)</label>
                  <input
                    type="url"
                    value={formPrimaryImg}
                    onChange={(e) => setFormPrimaryImg(e.target.value)}
                    className="w-full px-3 py-2 border border-charcoal-200 focus:border-charcoal-900 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-charcoal-600">URL Imagen Trasera / Lookbook (Hover)</label>
                  <input
                    type="url"
                    value={formHoverImg}
                    onChange={(e) => setFormHoverImg(e.target.value)}
                    className="w-full px-3 py-2 border border-charcoal-200 focus:border-charcoal-900 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-charcoal-600">Descripción Editorial</label>
                  <textarea
                    rows={2}
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="w-full px-3 py-2 border border-charcoal-200 focus:border-charcoal-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-3 border-t border-charcoal-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-charcoal-200 text-charcoal-700 uppercase tracking-wider hover:bg-charcoal-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-charcoal-950 text-white uppercase tracking-wider font-semibold hover:bg-charcoal-800"
                >
                  Guardar Prenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
