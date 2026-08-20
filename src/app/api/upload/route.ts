import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const base64Data = formData.get("base64") as string | null;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    let fileName = `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.webp`;

    if (file && typeof file === "object" && "arrayBuffer" in file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(uploadsDir, fileName);
      await writeFile(filePath, buffer);
      return NextResponse.json({ success: true, url: `/uploads/${fileName}` });
    }

    if (base64Data && typeof base64Data === "string") {
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const buffer = Buffer.from(matches[2], "base64");
        const filePath = path.join(uploadsDir, fileName);
        await writeFile(filePath, buffer);
        return NextResponse.json({ success: true, url: `/uploads/${fileName}` });
      }
    }

    return NextResponse.json(
      { success: false, error: "No se recibió archivo o imagen válida" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("[API Upload] Error al guardar archivo:", error);
    // Si la escritura en disco no estuviera permitida en el entorno, devolver la dataUrl
    return NextResponse.json(
      { success: false, error: error?.message || "Error al subir archivo" },
      { status: 500 }
    );
  }
}
