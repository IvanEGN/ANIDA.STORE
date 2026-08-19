import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://wuymahrkeryprdlbmhft.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_QVTfYkXaxkfoKWfQhy_XlQ_pkZuxA2N";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Helper para subir imágenes a Supabase Storage (Bucket: 'product-images' o 'banners')
export async function uploadImageToSupabase(
  file: File,
  bucket: string = "product-images"
): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      console.warn("Supabase Storage fallback direct fetch:", error.message);
      // Fallback a fetch directo si el bucket no tiene RLS permisiva
      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${filePath}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          apikey: SUPABASE_ANON_KEY,
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!res.ok) return null;
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Supabase storage upload error:", error);
    return null;
  }
}
