"use client";

import React, { useState } from "react";
import { useStoreData } from "@/context/StoreDataContext";
import { SizeRequestRecord } from "@/types";
import { Sparkles, MessageCircle, Mail, Trash2, CheckCircle2, Clock } from "lucide-react";

export default function AdminSizeRequestsPage() {
  const { sizeRequests, updateSizeRequestStatus, deleteSizeRequest } = useStoreData();
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "CONTACTED" | "RESOLVED">("ALL");

  const filteredRequests = sizeRequests.filter((r) => {
    if (filterStatus === "ALL") return true;
    return r.status === filterStatus;
  });

  const handleContactWhatsApp = (r: SizeRequestRecord) => {
    const text = encodeURIComponent(
      `Hola ${r.customerName}, te contactamos de ANIDA con respecto a tu solicitud de la talla ${r.requestedSize} para la prenda "${r.productTitle}".`
    );
    window.open(`https://wa.me/${r.customerPhone.replace(/[^0-9]/g, "")}?text=${text}`, "_blank");
    updateSizeRequestStatus(r.id, "CONTACTED");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-200">
        <div>
          <span className="text-[11px] font-semibold tracking-widest text-charcoal-500 uppercase">
            Demanda & Producción
          </span>
          <h1 className="text-2xl font-light tracking-tight text-charcoal-950 uppercase">
            Solicitudes de Tallas (Waitlist)
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          {(["ALL", "PENDING", "CONTACTED", "RESOLVED"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider transition-colors ${
                filterStatus === st
                  ? "bg-charcoal-950 text-white"
                  : "bg-white border border-charcoal-200 text-charcoal-700 hover:border-charcoal-900"
              }`}
            >
              {st === "ALL" ? "Todas" : st === "PENDING" ? "Pendientes" : st === "CONTACTED" ? "Contactados" : "Atendidos"}
            </button>
          ))}
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="bg-white border border-dashed border-charcoal-300 p-12 text-center text-xs text-charcoal-400 space-y-2">
          <Sparkles className="w-8 h-8 mx-auto stroke-1" />
          <p className="uppercase tracking-wider font-medium text-charcoal-700">
            No hay solicitudes de tallas registradas en esta sección.
          </p>
          <p className="text-charcoal-500 text-[11px] max-w-sm mx-auto">
            Cuando los clientes hagan clic en "¿No encuentras tu talla?" en la tienda, sus datos y tallas deseadas aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-charcoal-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-charcoal-50 border-b border-charcoal-200 text-charcoal-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Prenda Solicitada</th>
                  <th className="py-3 px-4">Talla Solicitada</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Notas / Medidas</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-100 text-charcoal-800">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-charcoal-50/40">
                    <td className="py-3 px-4 text-charcoal-500 text-[11px] whitespace-nowrap">
                      {req.createdAt}
                    </td>
                    <td className="py-3 px-4 font-medium text-charcoal-950">
                      {req.productTitle}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-charcoal-950 text-white font-semibold text-[11px] rounded-xs uppercase">
                        {req.requestedSize}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-charcoal-900">{req.customerName}</p>
                      <p className="text-[10px] text-charcoal-500">{req.customerEmail}</p>
                      <p className="text-[10px] text-emerald-800 font-mono font-medium">{req.customerPhone}</p>
                    </td>
                    <td className="py-3 px-4 text-charcoal-600 max-w-xs text-[11px]">
                      {req.notes || "—"}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={req.status}
                        onChange={(e) => updateSizeRequestStatus(req.id, e.target.value as any)}
                        className="bg-transparent border border-charcoal-200 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-xs focus:outline-none focus:border-charcoal-900"
                      >
                        <option value="PENDING">Pendiente</option>
                        <option value="CONTACTED">Contactado</option>
                        <option value="RESOLVED">Atendido</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => handleContactWhatsApp(req)}
                          className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-700 hover:text-white rounded-xs transition-colors"
                          title="Contactar al cliente por WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSizeRequest(req.id)}
                          className="p-1.5 text-rose-600 hover:text-rose-800"
                          title="Eliminar registro"
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
    </div>
  );
}
