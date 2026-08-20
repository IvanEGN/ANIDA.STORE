"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useStoreData } from "@/context/StoreDataContext";
import {
  DollarSign,
  ShoppingBag,
  Package,
  ArrowUpRight,
  RefreshCw,
  Database,
  CheckCircle2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const {
    products,
    banners,
    orders,
    resetToEmptyStore,
    syncLocalToRemoteMySQL,
    refreshStoreData,
    isSyncing,
  } = useStoreData();

  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);

  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const activeOrdersCount = orders.length;
  const totalProducts = products.length;

  const handleResetCatalog = async () => {
    if (confirm("¿Deseas vaciar todos los datos y dejar la tienda totalmente limpia para tus productos reales?")) {
      await resetToEmptyStore();
      alert("¡La tienda ha sido limpiada con éxito! Ahora puedes agregar tus prendas reales.");
    }
  };

  const handleManualSync = async () => {
    setSyncStatusMessage("Sincronizando con base de datos MySQL...");
    const res = await syncLocalToRemoteMySQL();
    setSyncStatusMessage(res.message);
    setTimeout(() => setSyncStatusMessage(null), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-200">
        <div>
          <span className="text-[11px] font-semibold tracking-widest text-charcoal-500 uppercase">
            Métricas Principales
          </span>
          <h1 className="text-2xl font-light tracking-tight text-charcoal-950 uppercase">
            Dashboard General
          </h1>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            type="button"
            onClick={handleManualSync}
            disabled={isSyncing}
            className="inline-flex items-center px-3.5 py-2 border border-charcoal-300 text-charcoal-800 bg-white hover:bg-charcoal-50 text-xs tracking-wider uppercase font-medium transition-colors shadow-xs"
            title="Subir prendas y banners a la base de datos de Hostinger"
          >
            <Database className={`w-3.5 h-3.5 mr-1.5 ${isSyncing ? "animate-spin text-emerald-600" : "text-charcoal-700"}`} />
            <span>{isSyncing ? "Sincronizando..." : "Sincronizar a MySQL"}</span>
          </button>

          <button
            onClick={handleResetCatalog}
            className="px-3 py-2 border border-rose-200 text-rose-700 bg-rose-50/50 hover:bg-rose-100 text-xs tracking-wider uppercase font-medium transition-colors"
            title="Borrar datos de prueba y dejar la tienda vacía"
          >
            Vaciar Tienda
          </button>
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
        </div>
      </div>

      {syncStatusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncStatusMessage}</span>
        </div>
      )}

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 border border-charcoal-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-charcoal-500 text-xs uppercase tracking-wider">
            <span>Ventas Totales</span>
            <DollarSign className="w-4 h-4 text-charcoal-400" />
          </div>
          <p className="text-2xl font-light text-charcoal-950">{formatPrice(totalRevenue)}</p>
          <p className="text-[11px] text-charcoal-500">{orders.length} pedidos procesados</p>
        </div>

        <div className="bg-white p-5 border border-charcoal-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-charcoal-500 text-xs uppercase tracking-wider">
            <span>Pedidos Activos</span>
            <ShoppingBag className="w-4 h-4 text-charcoal-400" />
          </div>
          <p className="text-2xl font-light text-charcoal-950">{activeOrdersCount} órdenes</p>
          <p className="text-[11px] text-charcoal-500">Logística de envíos</p>
        </div>

        <div className="bg-white p-5 border border-charcoal-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-charcoal-500 text-xs uppercase tracking-wider">
            <span>Prendas en Catálogo</span>
            <Package className="w-4 h-4 text-charcoal-400" />
          </div>
          <p className="text-2xl font-light text-charcoal-950">{totalProducts} estilos</p>
          <p className="text-[11px] text-emerald-700">MySQL Hostinger</p>
        </div>

        <div className="bg-white p-5 border border-charcoal-200 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-charcoal-500 text-xs uppercase tracking-wider">
            <span>Ticket Promedio</span>
            <ArrowUpRight className="w-4 h-4 text-charcoal-400" />
          </div>
          <p className="text-2xl font-light text-charcoal-950">
            {orders.length > 0 ? formatPrice(totalRevenue / orders.length) : "$0.00 MXN"}
          </p>
          <p className="text-[11px] text-emerald-700 font-medium">Stripe / SPEI / MP</p>
        </div>
      </div>

      {/* Pedidos Recientes & Estado de Inventario */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Tabla de Pedidos Recientes */}
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
                    <th className="py-2.5">Método</th>
                    <th className="py-2.5">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal-100 text-charcoal-700">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-charcoal-50/50">
                      <td className="py-3 font-mono font-medium text-charcoal-950">{ord.orderNumber}</td>
                      <td className="py-3">{ord.customer.name}</td>
                      <td className="py-3 font-medium text-charcoal-900">{formatPrice(ord.total)}</td>
                      <td className="py-3 font-mono text-[11px]">{ord.paymentMethod}</td>
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

        {/* Prendas */}
        <div className="lg:col-span-4 bg-white p-6 border border-charcoal-200 shadow-xs space-y-4">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-charcoal-900 pb-2 border-b border-charcoal-100">
            Inventario en Base de Datos ({products.length})
          </h2>

          {products.length === 0 ? (
            <div className="py-8 text-center text-xs text-charcoal-400 space-y-2">
              <p>Tu catálogo está vacío.</p>
              <Link href="/admin/inventory" className="text-charcoal-900 font-semibold underline uppercase text-[11px]">
                + Subir primera prenda
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {products.slice(0, 4).map((prod) => (
                <div key={prod.id} className="flex space-x-3 items-center">
                  <div className="w-12 h-16 bg-charcoal-100 shrink-0 overflow-hidden">
                    <img src={prod.images.primary} alt={prod.title} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-medium uppercase text-charcoal-900 line-clamp-1">{prod.title}</h4>
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
