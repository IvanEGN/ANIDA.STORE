"use client";

import React, { useState } from "react";
import { INITIAL_ORDERS } from "@/data/initialData";
import { OrderRecord } from "@/types";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Eye, CheckCircle2, Truck, Clock, X } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  const handleStatusChange = (orderId: string, newStatus: any) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, orderStatus: newStatus } : ord))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-200">
        <div>
          <span className="text-[11px] font-semibold tracking-widest text-charcoal-500 uppercase">
            Gestión Logística
          </span>
          <h1 className="text-2xl font-light tracking-tight text-charcoal-950 uppercase">
            Órdenes & Envíos
          </h1>
        </div>

        <span className="text-xs text-charcoal-500 font-medium">
          {orders.length} pedidos registrados
        </span>
      </div>

      {/* Tabla de Pedidos */}
      <div className="bg-white border border-charcoal-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-charcoal-50 border-b border-charcoal-200 text-charcoal-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">No. Pedido</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Destino</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Pasarela</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100 text-charcoal-800">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-charcoal-50/40">
                  <td className="py-3 px-4 font-mono font-semibold text-charcoal-950">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3 px-4 text-charcoal-500">{ord.date}</td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-charcoal-950">{ord.customer.name}</p>
                    <span className="text-[10px] text-charcoal-400">{ord.customer.email}</span>
                  </td>
                  <td className="py-3 px-4 text-charcoal-600">
                    {ord.customer.city}, {ord.customer.state}
                  </td>
                  <td className="py-3 px-4 font-semibold text-charcoal-900">
                    {formatPrice(ord.total)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-charcoal-100 font-mono text-[10px] font-medium text-charcoal-800">
                      {ord.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                      className="bg-transparent border border-charcoal-200 px-2 py-1 text-[11px] font-medium uppercase tracking-wider rounded-xs focus:outline-none focus:border-charcoal-900"
                    >
                      <option value="PENDING">Pendiente</option>
                      <option value="PROCESSING">En Preparación</option>
                      <option value="SHIPPED">Enviado</option>
                      <option value="DELIVERED">Entregado</option>
                      <option value="CANCELLED">Cancelado</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="p-1.5 text-charcoal-600 hover:text-charcoal-950"
                      title="Ver detalles completos"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalle de Orden */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white w-full max-w-xl p-6 sm:p-8 shadow-2xl border border-charcoal-200 z-10 space-y-5 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-charcoal-200">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-charcoal-400">Detalles de Orden</span>
                <h3 className="text-base font-semibold tracking-wider font-mono text-charcoal-950">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-charcoal-400 hover:text-charcoal-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-charcoal-100">
              <div>
                <p className="text-charcoal-400 text-[10px] uppercase">Datos del Cliente</p>
                <p className="font-semibold text-charcoal-950">{selectedOrder.customer.name}</p>
                <p className="text-charcoal-600">{selectedOrder.customer.email}</p>
                <p className="text-charcoal-600">{selectedOrder.customer.phone}</p>
              </div>

              <div>
                <p className="text-charcoal-400 text-[10px] uppercase">Dirección de Entrega</p>
                <p className="text-charcoal-800">{selectedOrder.customer.addressLine1}</p>
                <p className="text-charcoal-600">{selectedOrder.customer.city}, {selectedOrder.customer.state} C.P. {selectedOrder.customer.postalCode}</p>
              </div>
            </div>

            {/* Artículos */}
            <div className="space-y-3">
              <p className="text-charcoal-400 text-[10px] uppercase tracking-wider">Prendas en este pedido</p>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-charcoal-50 p-2.5">
                    <div className="flex items-center space-x-3">
                      <img src={item.image} alt={item.title} className="w-8 h-10 object-cover" />
                      <div>
                        <p className="font-medium uppercase text-charcoal-900">{item.title}</p>
                        <p className="text-[10px] text-charcoal-500">Talla: {item.size} • {item.colorName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-charcoal-900">{formatPrice(item.price * item.quantity)}</p>
                      <p className="text-[10px] text-charcoal-500">Cant: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-charcoal-200 flex justify-between items-center text-sm">
              <span className="font-medium text-charcoal-600">Total Facturado</span>
              <span className="font-bold text-charcoal-950">{formatPrice(selectedOrder.total)} MXN</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
