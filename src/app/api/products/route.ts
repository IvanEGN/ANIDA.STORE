import { NextResponse } from "next/server";
import { INITIAL_PRODUCTS } from "@/data/initialData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const isNew = searchParams.get("isNew");

  let products = INITIAL_PRODUCTS;

  if (category && category !== "ALL") {
    products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (isNew === "true") {
    products = products.filter((p) => p.isNew);
  }

  return NextResponse.json({
    success: true,
    count: products.length,
    data: products,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: "Prenda registrada en base de datos correctamente",
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
