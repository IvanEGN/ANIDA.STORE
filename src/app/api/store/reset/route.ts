import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await prisma.productVariant.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.homeBanner.deleteMany();

    return NextResponse.json({
      success: true,
      message: "Base de datos limpiada y vaciada por completo",
    });
  } catch (error) {
    console.error("[API Reset] Error al vaciar base de datos:", error);
    return NextResponse.json(
      { success: false, error: "Error al vaciar la base de datos" },
      { status: 500 }
    );
  }
}
