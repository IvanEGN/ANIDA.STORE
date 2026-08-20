import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_ANNOUNCEMENT =
  "Envío sin costo en compras mayores a $1,499 MXN • Diseñado para almas libres y audaces";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const [announcementSetting, templateSetting] = await Promise.all([
      prisma.storeSetting.findUnique({ where: { key: "announcement_bar" } }),
      prisma.storeSetting.findUnique({ where: { key: "active_template" } }),
    ]);

    return NextResponse.json(
      {
        success: true,
        announcementBar: announcementSetting?.value || DEFAULT_ANNOUNCEMENT,
        activeTemplate: templateSetting?.value || "default",
      },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
    );
  } catch (error) {
    console.error("[API Settings GET] Error:", error);
    return NextResponse.json(
      {
        success: true,
        announcementBar: DEFAULT_ANNOUNCEMENT,
        activeTemplate: "default",
      },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const results: Record<string, string> = {};

    // Guardar texto de anuncio si viene
    if (typeof body.announcementBar === "string") {
      const updated = await prisma.storeSetting.upsert({
        where: { key: "announcement_bar" },
        update: { value: body.announcementBar.trim() },
        create: { key: "announcement_bar", value: body.announcementBar.trim() },
      });
      results.announcementBar = updated.value;
    }

    // Guardar template activo si viene
    if (typeof body.active_template === "string") {
      const validTemplates = ["default", "otono", "invierno", "primavera", "verano"];
      const template = validTemplates.includes(body.active_template)
        ? body.active_template
        : "default";
      const updated = await prisma.storeSetting.upsert({
        where: { key: "active_template" },
        update: { value: template },
        create: { key: "active_template", value: template },
      });
      results.activeTemplate = updated.value;
    }

    return NextResponse.json({ success: true, ...results });
  } catch (error) {
    console.error("[API Settings POST] Error:", error);
    return NextResponse.json(
      { success: false, error: "Error al guardar configuración" },
      { status: 500 }
    );
  }
}
