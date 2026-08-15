export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wuymahrkeryprdlbmhft.supabase.co";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_QVTfYkXaxkfoKWfQhy_XlQ_pkZuxA2N";

// Helper para subir imágenes a Supabase Storage (Bucket: 'product-images' o 'banners')
export async function uploadImageToSupabase(file: File, bucket: string = "product-images"): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${filePath}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!res.ok) {
      console.error("Error uploading to Supabase Storage", await res.text());
      return null;
    }

    return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${filePath}`;
  } catch (error) {
    console.error("Supabase storage upload error:", error);
    return null;
  }
}
