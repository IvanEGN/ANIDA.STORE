"use client";

import React from "react";
import { X, Ruler } from "lucide-react";


interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-background w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-charcoal-200 z-10 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-charcoal-200">
          <div className="flex items-center space-x-2">
            <Ruler className="w-4 h-4 text-charcoal-600" />
            <h3 className="text-sm font-semibold tracking-widest uppercase text-charcoal-900">
              Guía de Tallas y Medidas (cm)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-charcoal-400 hover:text-charcoal-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-charcoal-200 text-charcoal-500 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Talla</th>
                <th className="py-2.5 px-3">Busto / Pecho</th>
                <th className="py-2.5 px-3">Cintura</th>
                <th className="py-2.5 px-3">Cadera</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-100 text-charcoal-800">
              <tr>
                <td className="py-3 px-3 font-semibold">XS (34)</td>
                <td className="py-3 px-3">80 - 84 cm</td>
                <td className="py-3 px-3">60 - 64 cm</td>
                <td className="py-3 px-3">86 - 90 cm</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold">S (36)</td>
                <td className="py-3 px-3">85 - 89 cm</td>
                <td className="py-3 px-3">65 - 69 cm</td>
                <td className="py-3 px-3">91 - 95 cm</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold">M (38)</td>
                <td className="py-3 px-3">90 - 94 cm</td>
                <td className="py-3 px-3">70 - 74 cm</td>
                <td className="py-3 px-3">96 - 100 cm</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold">L (40)</td>
                <td className="py-3 px-3">95 - 100 cm</td>
                <td className="py-3 px-3">75 - 80 cm</td>
                <td className="py-3 px-3">101 - 106 cm</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-charcoal-50 p-4 text-[11px] text-charcoal-600 space-y-1.5 border border-charcoal-200">
          <p className="font-medium text-charcoal-900 uppercase tracking-wider">¿Cómo medirte?</p>
          <p>• <strong>Busto:</strong> Medir alrededor de la parte más prominente con cinta horizontal.</p>
          <p>• <strong>Cintura:</strong> Medir alrededor de la parte más estrecha del torso.</p>
          <p>• <strong>Cadera:</strong> Medir alrededor del punto más amplio manteniendo los pies juntos.</p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-charcoal-900 text-white text-xs font-semibold tracking-widest uppercase hover:bg-charcoal-800 transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
