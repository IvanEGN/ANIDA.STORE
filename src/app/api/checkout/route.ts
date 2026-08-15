import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customer, paymentMethod, total } = body;

    const orderNumber = `ANIDA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    let responsePayload: any = {
      success: true,
      orderNumber,
      paymentMethod,
      total,
    };

    // Generador de respuesta según la pasarela
    if (paymentMethod === "SPEI") {
      responsePayload.speiData = {
        clabe: "646180157023948512",
        bank: "STP / Mercado Pago",
        beneficiary: "anida.store México S.A. de C.V.",
        reference: orderNumber,
        expiresInHours: 48,
      };
    } else if (paymentMethod === "STRIPE") {
      responsePayload.stripeClientSecret = `pi_test_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`;
    } else if (paymentMethod === "MERCADO_PAGO") {
      responsePayload.mpPreferenceId = `pref_mp_${Date.now()}`;
      responsePayload.mpInitPoint = `https://www.mercadopago.com.mx/checkout/v1/redirect?pref_id=pref_mp_${Date.now()}`;
    }

    return NextResponse.json(responsePayload);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error al generar la orden y sesión de pago" },
      { status: 500 }
    );
  }
}
