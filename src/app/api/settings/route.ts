import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_ANNOUNCEMENT =
  "Envío sin costo en compras mayores a $1,499 MXN • Diseñado para almas libres y audaces";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const setting = await prisma.storeSetting.findUnique({
      where: { key: "announcement_bar" },
    });

    return NextResponse.json(
      {
        success: true,
        announcementBar: setting?.value || DEFAULT_ANNOUNCEMENT,
      },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
    );
  } catch (error) {
    console.error("[API Settings GET] Error:", error);
    return NextResponse.json(
      {
        success: true,
        announcementBar: DEFAULT_ANNOUNCEMENT,
      },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { announcementBar } = await request.json();

    if (typeof announcementBar !== "string") {
      return NextResponse.json(
        { success: false, error: "Texto de anuncio no válido" },
        { status: 400 }
      );
    }

    const updated = await prisma.storeSetting.upsert({
      where: { key: "announcement_bar" },
      update: { value: announcementBar.trim() },
      create: { key: "announcement_bar", value: announcementBar.trim() },
    });

    return NextResponse.json({ success: true, announcementBar: updated.value });
  } catch (error) {
    console.error("[API Settings POST] Error:", error);
    return NextResponse.json(
      { success: false, error: "Error al guardar configuración" },
      { status: 500 }
    );
  }
}
