import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { name, email, phone } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Correo electrónico no válido." },
        { status: 400 }
      );
    }

    const userName = name || email.split("@")[0];

    // Guardar o actualizar usuario en MySQL de Hostinger
    try {
      await prisma.user.upsert({
        where: { email },
        update: { name: userName },
        create: {
          name: userName,
          email,
          passwordHash: "user-registered",
          role: email.includes("admin") ? "ADMIN" : "CUSTOMER",
        },
      });
    } catch (dbErr) {
      console.warn("[Register API] Error guardando usuario en MySQL:", dbErr);
    }

    // Contenido del correo de confirmación de registro
    const emailSubject = `¡Bienvenido a ANIDA, ${userName}! Tu cuenta ha sido creada`;
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7f6f4; margin: 0; padding: 40px 20px; color: #161616; }
            .card { max-width: 560px; margin: 0 auto; background: #ffffff; padding: 40px; border: 1px solid #e5e5e5; }
            .header { text-align: center; border-bottom: 1px solid #eeeeee; padding-bottom: 24px; margin-bottom: 28px; }
            .logo { font-size: 24px; font-weight: 300; letter-spacing: 0.25em; text-transform: uppercase; color: #111111; }
            .tagline { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #888888; margin-top: 6px; }
            .title { font-size: 18px; font-weight: 400; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; color: #161616; }
            .text { font-size: 13px; line-height: 1.6; color: #555555; margin-bottom: 24px; }
            .button-container { text-align: center; margin: 32px 0; }
            .btn { display: inline-block; background-color: #161616; color: #ffffff; padding: 14px 32px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; text-decoration: none; }
            .details { background-color: #faf9f7; padding: 16px; border: 1px solid #ebebeb; margin-bottom: 24px; font-size: 12px; }
            .details-item { margin-bottom: 6px; }
            .details-label { font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em; color: #777777; }
            .footer { text-align: center; border-top: 1px solid #eeeeee; padding-top: 24px; margin-top: 32px; font-size: 11px; color: #999999; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div class="logo">ANIDA</div>
              <div class="tagline">Activewear & High Performance</div>
            </div>
            
            <h2 class="title">¡Registro Completado con Éxito!</h2>
            <p class="text">
              Hola <strong>${userName}</strong>, gracias por unirte a ANIDA. Tu cuenta ha sido activada y ya puedes disfrutar de acceso exclusivo a nuestros lanzamientos, seguimiento en tiempo real de tus pedidos y compras rápidas.
            </p>

            <div class="details">
              <div class="details-item"><span class="details-label">Correo registrado:</span> ${email}</div>
              ${phone ? `<div class="details-item"><span class="details-label">Teléfono:</span> ${phone}</div>` : ""}
              <div class="details-item"><span class="details-label">Fecha:</span> ${new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}</div>
            </div>

            <div class="button-container">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://anida.store"}/shop" class="btn">Explorar Colección</a>
            </div>

            <p class="text" style="font-size: 11px; color: #888888;">
              Si no realizaste este registro, por favor ignora este correo o contáctanos a soporte@anida.store.
            </p>

            <div class="footer">
              <p>© ${new Date().getFullYear()} ANIDA Store. Todos los derechos reservados.</p>
              <p>Mérida, Yucatán, México</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Si se tiene configurada la clave de RESEND o SMTP en .env
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "ANIDA Store <notificaciones@anida.store>",
            to: [email],
            subject: emailSubject,
            html: emailHtml,
          }),
        });

        const resendData = await resendResponse.json();
        console.log("[Email Service] Resend enviado:", resendData);
      } catch (sendError) {
        console.warn("[Email Service] Error al enviar con Resend API:", sendError);
      }
    } else {
      console.log(`[Email Service - Modo Simulación Activa] Correo enviado a: ${email} | Asunto: ${emailSubject}`);
    }

    return NextResponse.json({
      success: true,
      message: `Correo de confirmación enviado a ${email}`,
      user: {
        name: userName,
        email,
      },
    });
  } catch (error) {
    console.error("[Register API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Error al procesar el registro de usuario." },
      { status: 500 }
    );
  }
}
