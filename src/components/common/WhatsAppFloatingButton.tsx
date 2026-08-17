"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export const WhatsAppFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-2 select-none">
      {/* Tooltip o popup rápido */}
      {isOpen && (
        <div className="bg-white p-4 border border-charcoal-200 shadow-2xl rounded-sm max-w-xs text-xs space-y-2 animate-fadeIn">
          <div className="flex justify-between items-start">
            <span className="font-semibold text-charcoal-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Atención ANIDA
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-charcoal-400 hover:text-charcoal-900"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-charcoal-600 font-light text-[11px] leading-relaxed">
            ¿Tienes dudas sobre tallas, existencias o tu pedido? Escríbenos por WhatsApp (999 996 3334).
          </p>
          <a
            href="https://wa.me/529999963334?text=Hola%20ANIDA,%20tengo%20una%20consulta%20sobre%20sus%20prendas"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-center text-[11px] font-semibold tracking-wider uppercase transition-colors"
          >
            Iniciar Chat
          </a>
        </div>
      )}

      {/* Botón Flotante */}
      <a
        href="https://wa.me/529999963334?text=Hola%20ANIDA,%20tengo%20una%20consulta%20sobre%20sus%20prendas"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsOpen(true)}
        className="w-12 h-12 bg-charcoal-950 hover:bg-emerald-700 text-white rounded-full shadow-2xl flex items-center justify-center border border-white/20 transition-all duration-300 transform hover:scale-108 group"
        aria-label="Contactar por WhatsApp Atención a Clientes"
        title="Atención a Clientes WhatsApp (9999963334)"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </a>
    </div>
  );
};
