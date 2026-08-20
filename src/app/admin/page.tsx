"use client";

import React from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useStoreData } from "@/context/StoreDataContext";
import { TemplateSelector } from "@/components/admin/TemplateSelector";
import {
  DollarSign,
  ShoppingBag,
  Package,
  ArrowUpRight,
  ImageIcon,
  Palette,
  LogOut,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { products, banners, orders } = useStoreData();

  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const totalProducts = products.length;
  const totalBanners = banners.length;

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.href = "/admin";
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-200">
        <div>
          <span className="text-[11px] font-semibold tracking-widest text-charcoal-500 uppercase">
            Panel de Control
          </span>
          <h1 className="text-2xl font-light tracking-tight text-charcoal-950 uppercase">
            Dashboard ANIDA
          </h1>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <Link
            href="/admin/inventory"
            className="px-4 py-2 bg-charcoal-950 text-white text-xs tracking-wider uppercase font-semibold hover:bg-charcoal-800 transition-colors"
          >
            + Nueva Prenda
          </Link>
          <Link
            href="/admin/banners"
            className="px-4 py-2 border border-charcoal-300 text-charcoal-800 text-xs tracking-wider uppercase font-medium hover:bg-white transition-colors"
          >
            Editar Banners
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs tracking-wider uppercase font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-charcoal-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-charcoal-500 text-xs uppercase tracking-wider">
            <span>Ventas Totales</span>
            <DollarSign className="w-4 h-4 text-charcoal-400" />
          </div>
          <p className="text-2xl font-light text-charcoal-950">{formatPrice(totalRevenue)}</p>
          <p className="text-[11px] text-charcoal-500">{orders.length} pedidos</p>
        </div>

        <div className="bg-white p-5 border border-charcoal-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-charcoal-500 text-xs uppercase tracking-wider">
            <span>Pedidos</span>
            <ShoppingBag className="w-4 h-4 text-charcoal-400" />
          </div>
          <p className="text-2xl font-light text-charcoal-950">{orders.length}</p>
          <p className="text-[11px] text-charcoal-500">órdenes activas</p>
        </div>

        <div className="bg-white p-5 border border-charcoal-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-charcoal-500 text-xs uppercase tracking-wider">
            <span>Prendas</span>
            <Package className="w-4 h-4 text-charcoal-400" />
          </div>
          <p className="text-2xl font-light text-charcoal-950">{totalProducts}</p>
          <p className="text-[11px] text-emerald-700 font-medium">en MySQL Hostinger</p>
        </div>

        <div className="bg-white p-5 border border-charcoal-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-charcoal-500 text-xs uppercase tracking-wider">
            <span>Banners</span>
            <ImageIcon className="w-4 h-4 text-charcoal-400" />
          </div>
          <p className="text-2xl font-light text-charcoal-950">{totalBanners}</p>
          <p className="text-[11px] text-charcoal-500">en el carrusel</p>
        </div>
      </div>

      {/* Template de Temporada */}
      <div className="bg-white p-6 border border-charcoal-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-charcoal-100">
          <Palette className="w-4 h-4 text-charcoal-700" />
          <h2 className="text-xs font-semibold tracking-widest uppercase text-charcoal-900">
            Tema de Temporada
          </h2>
          <span className="text-[10px] text-charcoal-400 ml-1">
            — el tema seleccionado se aplica para todos los visitantes
          </span>
        </div>
        <TemplateSelector currentTemplate="default" />
      </div>

      {/* Inventario y Pedidos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pedidos Recientes */}
        <div className="lg:col-span-8 bg-white p-6 border border-charcoal-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-charcoal-100">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-charcoal-900">
              Órdenes Recientes
            </h2>
            <Link href="/admin/orders" className="text-xs underline text-charcoal-600 hover:text-charcoal-950 uppercase tracking-wider">
              Ver todas
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center text-xs text-charcoal-400">
              No hay pedidos registrados todavía.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-charcoal-200 text-[10px] uppercase tracking-wider text-charcoal-400">
                    <th className="py-2.5">Orden</th>
                    <th className="py-2.5">Cliente</th>
                    <th className="py-2.5">Total</th>
                    <th className="py-2.5">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-100 text-charcoal-700">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-charcoal-50/50">
                      <td className="py-3 font-mono font-medium text-charcoal-950">{ord.orderNumber}</td>
                      <td className="py-3">{ord.customer.name}</td>
                      <td className="py-3 font-medium text-charcoal-900">{formatPrice(ord.total)}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-pastel-sage text-charcoal-900 rounded-xs">
                          {ord.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Catálogo rápido */}
        <div className="lg:col-span-4 bg-white p-6 border border-charcoal-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-charcoal-100">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-charcoal-900">
              Catálogo ({products.length})
            </h2>
            <Link href="/admin/inventory" className="text-xs underline text-charcoal-600 hover:text-charcoal-950 uppercase tracking-wider">
              Gestionar
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="py-8 text-center text-xs text-charcoal-400 space-y-2">
              <p>Tu catálogo está vacío.</p>
              <Link href="/admin/inventory" className="text-charcoal-900 font-semibold underline uppercase text-[11px]">
                + Subir primera prenda
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {products.slice(0, 5).map((prod) => (
                <div key={prod.id} className="flex space-x-3 items-center">
                  <div className="w-12 h-16 bg-charcoal-100 shrink-0 overflow-hidden">
                    {prod.images.primary && (
                      <img src={prod.images.primary} alt={prod.title} className="w-full h-full object-cover object-top" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium uppercase text-charcoal-900 truncate">{prod.title}</h4>
                    <p className="text-[11px] text-charcoal-500">{formatPrice(prod.price)} • {prod.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
