/**
 * Utilidad del navegador para convertir cualquier archivo de imagen (JPG, PNG, TIFF, HEIC, etc.)
 * a formato WebP optimizado en tamaño y calidad sin consumir recursos de servidor.
 */
export async function convertImageToWebP(
  file: File,
  maxWidth: number = 1400,
  quality: number = 0.85
): Promise<{ dataUrl: string; file: File; originalSize: number; optimizedSize: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Calcular dimensiones proporcionales
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        // Crear canvas para el procesamiento y compresión
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No se pudo obtener el contexto del canvas"));
          return;
        }

        // Suavizado de imagen de alta calidad
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a WebP
        const webpDataUrl = canvas.toDataURL("image/webp", quality);

        // Crear un objeto File WebP
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Error al convertir a blob WebP"));
              return;
            }
            const webpFile = new File(
              [blob],
              `${file.name.replace(/\.[^/.]+$/, "")}.webp`,
              { type: "image/webp" }
            );

            resolve({
              dataUrl: webpDataUrl,
              file: webpFile,
              originalSize: file.size,
              optimizedSize: blob.size,
            });
          },
          "image/webp",
          quality
        );
      };

      img.onerror = () => reject(new Error("Error al cargar la imagen seleccionada"));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Error al leer el archivo"));
    reader.readAsDataURL(file);
  });
}
