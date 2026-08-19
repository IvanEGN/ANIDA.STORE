import { createClient } from "@supabase/supabase-js";

// Función para sanitizar y garantizar una URL HTTP/HTTPS válida
function getSanitizedSupabaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const defaultUrl = "https://wuymahrkeryprdlbmhft.supabase.co";

  if (!envUrl) return defaultUrl;

  // Si por error se colocó la DATABASE_URL (postgresql://) en NEXT_PUBLIC_SUPABASE_URL
  if (envUrl.startsWith("postgresql://") || envUrl.startsWith("postgres://")) {
    const match = envUrl.match(/db\.([a-z0-9]+)\.supabase\.co/);
    if (match && match[1]) {
      return `https://${match[1]}.supabase.co`;
    }
    return defaultUrl;
  }

  if (envUrl.startsWith("http://") || envUrl.startsWith("https://")) {
    return envUrl;
  }

  return defaultUrl;
}

function getSanitizedSupabaseKey(): string {
  const envKey = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();

  return envKey || "sb_publishable_QVTfYkXaxkfoKWfQhy_XlQ_pkZuxA2N";
}

export const SUPABASE_URL = getSanitizedSupabaseUrl();
export const SUPABASE_ANON_KEY = getSanitizedSupabaseKey();

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

    const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      console.warn("Supabase Storage fallback direct fetch:", error.message);
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
