import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Product } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const dbProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(category && category !== "ALL" ? { category } : {}),
      },
      include: {
        variants: true,
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted: Product[] = dbProducts.map((p) => {
      const rawImgs = p.rawImagesJson as any;
      const rawCols = p.rawColorsJson as any;
      const rawSzs = p.rawSizesJson as any;

      const primaryImg =
        rawImgs?.primary ||
        p.images.find((i) => i.isPrimary)?.imageUrl ||
        p.images[0]?.imageUrl ||
        "";
      const hoverImg = rawImgs?.hover || p.images[1]?.imageUrl || primaryImg;
      const gallery = rawImgs?.gallery || p.images.map((i) => i.imageUrl);

      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category,
        price: Number(p.basePrice),
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
        description: p.description,
        materialsCare: p.materialsCare || undefined,
        isNew: p.isNew,
        featured: p.featured,
        images: {
          primary: primaryImg,
          hover: hoverImg,
          gallery: gallery.length > 0 ? gallery : [primaryImg],
        },
        colors: Array.isArray(rawCols)
          ? rawCols
          : [{ name: "Off White", hex: "#F4F1EA" }],
        sizes: Array.isArray(rawSzs) ? rawSzs : ["XS", "S", "M", "L"],
        variants: p.variants.map((v) => ({
          id: v.id,
          sku: v.sku,
          size: v.size,
          colorName: v.colorName,
          colorHex: v.colorHex,
          stock: v.stockQuantity,
          priceAdjustment: Number(v.priceAdjustment),
        })),
      };
    });

    return NextResponse.json(
      { success: true, count: formatted.length, data: formatted },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
    );
  } catch (error) {
    console.error("[API Products GET] Error:", error);
    return NextResponse.json(
      { success: true, count: 0, data: [] },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" } }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: Product = await request.json();

    if (!body.title || !body.price) {
      return NextResponse.json(
        { success: false, error: "Título y precio requeridos" },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const existing = await prisma.product.findUnique({
      where: { id: body.id },
    });

    let savedProduct;

    if (existing) {
      // Actualizar producto existente
      savedProduct = await prisma.product.update({
        where: { id: body.id },
        data: {
          title: body.title,
          slug,
          category: body.category,
          basePrice: body.price,
          compareAtPrice: body.compareAtPrice || null,
          description: body.description || "",
          materialsCare: body.materialsCare || null,
          isNew: body.isNew ?? true,
          featured: body.featured ?? false,
          rawImagesJson: body.images as any,
          rawColorsJson: body.colors as any,
          rawSizesJson: body.sizes as any,
        },
      });

      // Sincronizar variantes
      if (body.variants && body.variants.length > 0) {
        await prisma.productVariant.deleteMany({ where: { productId: body.id } });
        await prisma.productVariant.createMany({
          data: body.variants.map((v) => ({
            id: v.id || `v-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            productId: body.id,
            sku: v.sku || `${slug}-${v.size}`,
            size: v.size,
            colorName: v.colorName || "Standard",
            colorHex: v.colorHex || "#161616",
            stockQuantity: v.stock ?? 10,
            priceAdjustment: v.priceAdjustment || 0,
          })),
        });
      }
    } else {
      // Crear nuevo producto
      savedProduct = await prisma.product.create({
        data: {
          id: body.id || `prod-${Date.now()}`,
          title: body.title,
          slug,
          category: body.category || "Tops",
          basePrice: body.price,
          compareAtPrice: body.compareAtPrice || null,
          description: body.description || "",
          materialsCare: body.materialsCare || null,
          isNew: body.isNew ?? true,
          featured: body.featured ?? false,
          rawImagesJson: body.images as any,
          rawColorsJson: body.colors as any,
          rawSizesJson: body.sizes as any,
          variants: {
            create: (body.variants || []).map((v) => ({
              id: v.id || `v-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              sku: v.sku || `${slug}-${v.size}`,
              size: v.size,
              colorName: v.colorName || "Standard",
              colorHex: v.colorHex || "#161616",
              stockQuantity: v.stock ?? 10,
              priceAdjustment: v.priceAdjustment || 0,
            })),
          },
        },
      });
    }

    return NextResponse.json({ success: true, data: savedProduct });
  } catch (error) {
    console.error("[API Products POST] Error:", error);
    return NextResponse.json(
      { success: false, error: "Error al guardar la prenda en la base de datos." },
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

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Producto eliminado de la base de datos" });
  } catch (error) {
    console.error("[API Products DELETE] Error:", error);
    return NextResponse.json(
      { success: false, error: "Error al eliminar producto" },
      { status: 500 }
    );
  }
}
