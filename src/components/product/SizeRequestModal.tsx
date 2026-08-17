"use client";

import React, { useState } from "react";
import { useStoreData } from "@/context/StoreDataContext";
import { X, CheckCircle2, MessageCircle, Send, Sparkles } from "lucide-react";

interface SizeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productTitle: string;
  productImage: string;
}

export const SizeRequestModal: React.FC<SizeRequestModalProps> = ({
  isOpen,
  onClose,
  productId,
  productTitle,
  productImage,
}) => {
  const { addSizeRequest } = useStoreData();

  const [requestedSize, setRequestedSize] = useState("XL");
  const [customSize, setCustomSize] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const sizeOptions = ["2XS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "A Medida"];

  const effectiveSize = requestedSize === "A Medida" && customSize ? customSize : requestedSize;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addSizeRequest({
      productId,
      productTitle,
      requestedSize: effectiveSize,
      customerName,
      customerEmail,
      customerPhone,
      notes: notes || undefined,
    });

    setSubmitted(true);
  };

  const handleWhatsAppSend = () => {
    const text = encodeURIComponent(
      `Hola ANIDA! Me interesa solicitar una talla que no encontré en la tienda:\n\n` +
      `• Prenda: ${productTitle}\n` +
      `• Talla deseada: ${effectiveSize}\n` +
      `• Nombre: ${customerName}\n` +
      `• Correo: ${customerEmail}\n` +
      (notes ? `• Comentarios: ${notes}\n` : "") +
      `\n¿Podrían notificarme cuando esté disponible para futuras prendas? Gracias!`
    );
    window.open(`https://wa.me/529999963334?text=${text}`, "_blank");
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-950/70 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Box */}
      <div className="relative bg-white w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-charcoal-200 z-10 space-y-5 animate-scaleIn">
        <div className="flex justify-between items-start pb-3 border-b border-charcoal-200">
          <div>
            <span className="text-[10px] font-semibold tracking-widest uppercase text-emerald-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Solicitud de Talla Exclusiva
            </span>
            <h3 className="text-base font-light tracking-tight uppercase text-charcoal-950 mt-0.5">
              Registrar Talla para Futuras Prendas
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-charcoal-400 hover:text-charcoal-900 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Producto Seleccionado */}
        <div className="flex items-center space-x-3.5 bg-charcoal-50 p-3 border border-charcoal-200">
          <div className="w-12 h-16 bg-charcoal-200 shrink-0 overflow-hidden">
            <img src={productImage} alt={productTitle} className="w-full h-full object-cover object-top" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-charcoal-950 line-clamp-1">{productTitle}</p>
            <p className="text-[11px] text-charcoal-500 font-light mt-0.5">
              Nos aseguraremos de considerarla en nuestro próximo lote de confección.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-charcoal-900">
                ¡Solicitud Registrada con Éxito!
              </h4>
              <p className="text-xs text-charcoal-600 font-light max-w-sm mx-auto leading-relaxed">
                Hemos guardado tu interés en la talla <strong>{effectiveSize}</strong>. Te contactaremos a <strong>{customerEmail}</strong> o a tu WhatsApp tan pronto esté disponible en nuestro atelier.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={handleWhatsAppSend}
                className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirmar por WhatsApp (9999963334)</span>
              </button>

              <button
                onClick={handleClose}
                className="px-5 py-2.5 border border-charcoal-300 text-charcoal-800 text-xs font-medium uppercase tracking-wider hover:bg-charcoal-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Selección de Talla */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-wider text-charcoal-700 font-medium block">
                ¿Qué talla necesitas? *
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {sizeOptions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRequestedSize(s)}
                    className={`py-2 text-center text-[11px] font-medium uppercase border transition-all ${
                      requestedSize === s
                        ? "bg-charcoal-950 border-charcoal-950 text-white shadow-xs"
                        : "bg-white border-charcoal-200 text-charcoal-800 hover:border-charcoal-900"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {requestedSize === "A Medida" && (
                <input
                  type="text"
                  required
                  placeholder="Especifica tu talla o medidas en cm (ej. Busto 105cm, Cintura 88cm)"
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  className="w-full px-3 py-2 border border-charcoal-300 bg-white text-xs focus:outline-none focus:border-charcoal-900 mt-2"
                />
              )}
            </div>

            {/* Datos de Contacto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-charcoal-600 font-medium">
                  Nombre Completo *
                </label>
                <input
                  required
                  type="text"
                  placeholder="ej. Valentina Méndez"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-charcoal-200 bg-white focus:outline-none focus:border-charcoal-900 uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-charcoal-600 font-medium">
                  Correo Electrónico *
                </label>
                <input
                  required
                  type="email"
                  placeholder="valentina@correo.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-charcoal-200 bg-white focus:outline-none focus:border-charcoal-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-charcoal-600 font-medium">
                  Teléfono / WhatsApp *
                </label>
                <input
                  required
                  type="tel"
                  placeholder="999 123 4567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-charcoal-200 bg-white focus:outline-none focus:border-charcoal-900"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-charcoal-600 font-medium">
                  Comentarios o sugerencias (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="ej. Me gustaría en color negro o con tirantes más anchos."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-charcoal-200 bg-white focus:outline-none focus:border-charcoal-900"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-charcoal-200 flex justify-end space-x-2.5">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 border border-charcoal-200 text-charcoal-700 uppercase tracking-wider hover:bg-charcoal-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-charcoal-950 text-white uppercase tracking-wider font-semibold hover:bg-charcoal-800 transition-colors shadow-sm flex items-center space-x-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Registrar Solicitud</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
