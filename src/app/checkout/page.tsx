"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useStoreData } from "@/context/StoreDataContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import { PaymentMethodType, OrderRecord } from "@/types";
import { 
  CreditCard, 
  Building2, 
  Wallet, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  Lock, 
  ArrowLeft 
} from "lucide-react";

export default function CheckoutPage() {
  const { cart, subtotal, shippingCost, discountAmount, discountCode, total, clearCart } = useCart();
  const { addOrder } = useStoreData();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("STRIPE");
  const [copiedClabe, setCopiedClabe] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "CDMX",
    postalCode: "",
    cardNumber: "",
    cardExp: "",
    cardCvc: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyClabe = (clabe: string) => {
    navigator.clipboard.writeText(clabe);
    setCopiedClabe(true);
    setTimeout(() => setCopiedClabe(false), 2000);
  };

  const handleProcessOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const orderNumber = `ANIDA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrderRecord: OrderRecord = {
        id: `ord-${Date.now()}`,
        orderNumber,
        date: new Date().toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        customer: {
          name: formData.name || "Cliente Invitado",
          email: formData.email || "cliente@anida.store",
          phone: formData.phone || "No especificado",
          addressLine1: formData.addressLine1 || "Dirección de entrega",
          city: formData.city || "CDMX",
          state: formData.state || "CDMX",
          postalCode: formData.postalCode || "00000",
          country: "México",
        },
        items: [...cart],
        subtotal,
        shipping: shippingCost,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === "SPEI" ? "PENDING" : "PAID",
        orderStatus: "PROCESSING",
        speiClabe: paymentMethod === "SPEI" ? "646180157023948512" : undefined,
      };

      addOrder(newOrderRecord);
      setOrderCompleted(newOrderRecord);
      clearCart();
      setIsProcessing(false);
    }, 1500);
  };

  if (orderCompleted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full bg-surface p-8 sm:p-10 border border-charcoal-200 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 bg-pastel-sage/50 text-charcoal-900 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-emerald-800" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-charcoal-400">
              ¡Orden Confirmada con Éxito!
            </span>
            <h1 className="text-2xl font-light tracking-tight text-charcoal-950 uppercase">
              Gracias por tu compra
            </h1>
            <p className="text-xs text-charcoal-600">
              Número de Pedido: <strong className="text-charcoal-900 font-mono">{orderCompleted.orderNumber}</strong>
            </p>
          </div>

          {/* Información especial si es transferencia SPEI */}
          {orderCompleted.paymentMethod === "SPEI" && (
            <div className="bg-charcoal-50 p-5 text-left border border-charcoal-200 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-semibold text-charcoal-900 uppercase">
                <Building2 className="w-4 h-4" />
                <span>Datos para Transferencia SPEI</span>
              </div>
              <div className="space-y-1.5 text-xs text-charcoal-700 font-light">
                <div className="flex justify-between">
                  <span>Banco Receptor:</span>
                  <strong className="font-semibold text-charcoal-900">STP / Mercado Pago</strong>
                </div>
                <div className="flex justify-between">
                  <span>Beneficiario:</span>
                  <strong className="font-semibold text-charcoal-900">anida.store México</strong>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-charcoal-200">
                  <span>CLABE Interbancaria:</span>
                  <div className="flex items-center space-x-1.5 font-mono font-semibold text-charcoal-950">
                    <span>{orderCompleted.speiClabe}</span>
                    <button
                      onClick={() => handleCopyClabe(orderCompleted.speiClabe)}
                      className="p-1 text-charcoal-500 hover:text-charcoal-950"
                      title="Copiar CLABE"
                    >
                      {copiedClabe ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between pt-1">
                  <span>Monto exacto:</span>
                  <strong className="font-semibold text-charcoal-950">{formatPrice(orderCompleted.total)} MXN</strong>
                </div>
              </div>
              <p className="text-[10px] text-charcoal-500 pt-1">
                Tu pedido se procesará automáticamente al recibir la confirmación de la transferencia en los próximos 60 minutos.
              </p>
            </div>
          )}

          <p className="text-xs text-charcoal-500 font-light">
            Hemos enviado el comprobante y los detalles de seguimiento a <strong>{orderCompleted.customerEmail}</strong>.
          </p>

          <Link
            href="/"
            className="block w-full py-4 bg-charcoal-950 text-white text-xs font-semibold tracking-widest uppercase hover:bg-charcoal-800 transition-colors"
          >
            Volver a la Tienda
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 space-y-4 text-center">
        <h1 className="text-xl uppercase tracking-widest font-light text-charcoal-900">
          No hay artículos en tu carrito
        </h1>
        <p className="text-xs text-charcoal-500 max-w-sm">
          Añade tus prendas favoritas antes de proceder con el pago seguro.
        </p>
        <Link
          href="/shop"
          className="px-8 py-3.5 bg-charcoal-900 text-white text-xs tracking-widest uppercase font-medium hover:bg-charcoal-800"
        >
          Explorar Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 md:py-16">
      {/* Header del Checkout */}
      <div className="mb-8 pb-4 border-b border-charcoal-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/shop" className="text-charcoal-500 hover:text-charcoal-950 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-light tracking-tight text-charcoal-950 uppercase">
            Finalizar Compra
          </h1>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-charcoal-500">
          <Lock className="w-3.5 h-3.5 text-emerald-800" />
          <span className="tracking-wider uppercase text-[11px]">Checkout Seguro SSL</span>
        </div>
      </div>

      <form onSubmit={handleProcessOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Columna Izquierda: Información de Envío & Métodos de Pago */}
        <div className="lg:col-span-7 space-y-8">
          {/* Paso 1: Datos de Contacto y Envío */}
          <div className="space-y-4">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-charcoal-900 border-b border-charcoal-200 pb-2">
              1. Datos de Contacto & Dirección de Entrega
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-charcoal-600">Nombre Completo *</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="ej. Sofía Martínez"
                  className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white focus:outline-none focus:border-charcoal-900 uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-charcoal-600">Correo Electrónico *</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="sofia@ejemplo.com"
                  className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white focus:outline-none focus:border-charcoal-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-charcoal-600">Teléfono Móvil (WhatsApp) *</label>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+52 55 1234 5678"
                  className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white focus:outline-none focus:border-charcoal-900"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-charcoal-600">Calle, Número Exterior e Interior *</label>
                <input
                  required
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  placeholder="ej. Av. Presidente Masaryk 300, Piso 3"
                  className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white focus:outline-none focus:border-charcoal-900 uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-charcoal-600">Ciudad / Municipio *</label>
                <input
                  required
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Ciudad de México"
                  className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white focus:outline-none focus:border-charcoal-900 uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-charcoal-600">Código Postal *</label>
                <input
                  required
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="11560"
                  className="w-full px-3.5 py-2.5 border border-charcoal-200 bg-white focus:outline-none focus:border-charcoal-900"
                />
              </div>
            </div>
          </div>

          {/* Paso 2: Selección de Pasarela de Pago */}
          <div className="space-y-4 pt-4">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-charcoal-900 border-b border-charcoal-200 pb-2">
              2. Método de Pago Seguro
            </h2>

            <div className="space-y-3">
              {/* Opción 1: Tarjeta de Crédito / Débito */}
              <label
                className={`flex items-start p-4 border cursor-pointer transition-all ${
                  paymentMethod === "CARD" || paymentMethod === "STRIPE"
                    ? "border-charcoal-900 bg-charcoal-50/50 ring-1 ring-charcoal-900"
                    : "border-charcoal-200 hover:border-charcoal-400"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CARD"
                  checked={paymentMethod === "CARD" || paymentMethod === "STRIPE"}
                  onChange={() => setPaymentMethod("CARD")}
                  className="mt-0.5 text-charcoal-900"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-900 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-charcoal-700" />
                      Tarjeta de Crédito / Débito
                    </span>
                    <span className="text-[10px] text-charcoal-500 tracking-widest uppercase font-medium">Visa • Mastercard • Amex</span>
                  </div>
                  <p className="text-[11px] text-charcoal-500 font-light mt-0.5">
                    Procesamiento seguro e instantáneo con encriptación bancaria de 256 bits.
                  </p>

                  {(paymentMethod === "CARD" || paymentMethod === "STRIPE") && (
                    <div className="mt-4 pt-3 border-t border-charcoal-200 grid grid-cols-2 gap-3 text-xs">
                      <div className="col-span-2 space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-charcoal-600">Número de Tarjeta</label>
                        <input
                          type="text"
                          placeholder="4000 1234 5678 9010"
                          maxLength={19}
                          value={formData.cardNumber}
                          onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                          className="w-full px-3 py-2 border border-charcoal-200 bg-white font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-charcoal-600">Vencimiento (MM/AA)</label>
                        <input
                          type="text"
                          placeholder="12/28"
                          maxLength={5}
                          value={formData.cardExp}
                          onChange={(e) => setFormData({ ...formData, cardExp: e.target.value })}
                          className="w-full px-3 py-2 border border-charcoal-200 bg-white font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-charcoal-600">CVC / CVV</label>
                        <input
                          type="password"
                          placeholder="•••"
                          maxLength={4}
                          value={formData.cardCvc}
                          onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                          className="w-full px-3 py-2 border border-charcoal-200 bg-white font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </label>

              {/* Opción 2: Transferencia Electrónica SPEI */}
              <label
                className={`flex items-start p-4 border cursor-pointer transition-all ${
                  paymentMethod === "SPEI"
                    ? "border-charcoal-900 bg-charcoal-50/50 ring-1 ring-charcoal-900"
                    : "border-charcoal-200 hover:border-charcoal-400"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="SPEI"
                  checked={paymentMethod === "SPEI"}
                  onChange={() => setPaymentMethod("SPEI")}
                  className="mt-0.5 text-charcoal-900"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-charcoal-700" />
                      Transferencia Electrónica SPEI
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 font-semibold uppercase">Sin Comisiones</span>
                  </div>
                  <p className="text-[11px] text-charcoal-500 font-light mt-0.5">
                    Se generará una CLABE bancaria STP para transferir en tiempo real desde la app de tu banco (BBVA, Santander, Banorte, Nu, Citibanamex, etc.).
                  </p>
                </div>
              </label>
            </div>
          </div>


          {/* Botón de Confirmación */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 bg-charcoal-950 text-white text-xs font-semibold tracking-widest uppercase hover:bg-charcoal-800 disabled:opacity-50 transition-all shadow-md flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <span>Procesando pago seguro...</span>
            ) : (
              <span>Pagar {formatPrice(total)} MXN</span>
            )}
          </button>
        </div>

        {/* Columna Derecha: Resumen de Orden Sticky */}
        <div className="lg:col-span-5">
          <div className="bg-charcoal-50 p-6 border border-charcoal-200 space-y-5 lg:sticky lg:top-28">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-charcoal-900 border-b border-charcoal-200 pb-3">
              Resumen del Pedido ({cart.length} prendas)
            </h2>

            <div className="max-h-72 overflow-y-auto space-y-3 divide-y divide-charcoal-100 pr-1">
              {cart.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex space-x-3">
                  <div className="w-14 h-20 bg-charcoal-100 shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <h4 className="text-xs font-medium uppercase text-charcoal-900 line-clamp-1">{item.title}</h4>
                      <p className="text-[11px] text-charcoal-500">Talla: {item.size} • {item.colorName}</p>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-charcoal-900">
                      <span>Cant: {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-charcoal-200 pt-4 space-y-2 text-xs text-charcoal-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Descuento {discountCode}</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Envío a domicilio</span>
                <span>{shippingCost === 0 ? "GRATIS" : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-charcoal-950 pt-2 border-t border-charcoal-200">
                <span>Total a Pagar</span>
                <span>{formatPrice(total)} MXN</span>
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-2 text-[10px] text-charcoal-500">
              <ShieldCheck className="w-4 h-4 text-charcoal-700" />
              <span>Transacción protegida por protocolos de seguridad bancaria.</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
