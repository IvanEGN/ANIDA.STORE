import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { HomeBannerData } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const dbBanners = await prisma.homeBanner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });

    const formatted: HomeBannerData[] = dbBanners.map((b) => ({
      id: b.id,
      title: b.title,
      subtitle: b.subtitle || "",
      tagline: b.tagline || undefined,
      ctaText: b.ctaText,
      ctaLink: b.ctaLink,
      mediaType: b.mediaType as "IMAGE" | "VIDEO",
      mediaUrl: b.mediaUrl,
      mobileMediaUrl: b.mobileMediaUrl || undefined,
      isActive: b.isActive,
      displayOrder: b.displayOrder,
    }));

    return NextResponse.json(
      { success: true, count: formatted.length, data: formatted },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
    );
  } catch (error) {
    console.error("[API Banners GET] Error:", error);
    return NextResponse.json(
      { success: true, count: 0, data: [] },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: HomeBannerData = await request.json();

    if (!body.title) {
      return NextResponse.json(
        { success: false, error: "Título requerido" },
        { status: 400 }
      );
    }

    const existing = await prisma.homeBanner.findUnique({
      where: { id: body.id },
    });

    let savedBanner;

    if (existing) {
      savedBanner = await prisma.homeBanner.update({
        where: { id: body.id },
        data: {
          title: body.title,
          subtitle: body.subtitle || "",
          tagline: body.tagline || null,
          ctaText: body.ctaText || "Ver Colección",
          ctaLink: body.ctaLink || "/shop",
          mediaType: body.mediaType || "IMAGE",
          mediaUrl: body.mediaUrl || "",
          mobileMediaUrl: body.mobileMediaUrl || null,
          isActive: body.isActive ?? true,
          displayOrder: body.displayOrder ?? 0,
        },
      });
    } else {
      savedBanner = await prisma.homeBanner.create({
        data: {
          id: body.id || `banner-${Date.now()}`,
          title: body.title,
          subtitle: body.subtitle || "",
          tagline: body.tagline || null,
          ctaText: body.ctaText || "Ver Colección",
          ctaLink: body.ctaLink || "/shop",
          mediaType: body.mediaType || "IMAGE",
          mediaUrl: body.mediaUrl || "",
          mobileMediaUrl: body.mobileMediaUrl || null,
          isActive: body.isActive ?? true,
          displayOrder: body.displayOrder ?? 0,
        },
      });
    }

    return NextResponse.json({ success: true, data: savedBanner });
  } catch (error) {
    console.error("[API Banners POST] Error:", error);
    return NextResponse.json(
      { success: false, error: "Error al guardar el banner en la base de datos." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID requerido" }, { status: 400 });
    }

    await prisma.homeBanner.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Banner eliminado de la base de datos" });
  } catch (error) {
    console.error("[API Banners DELETE] Error:", error);
    return NextResponse.json(
      { success: false, error: "Error al eliminar banner" },
      { status: 500 }
    );
  }
}
