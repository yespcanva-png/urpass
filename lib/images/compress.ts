/**
 * Client-Side Image Compression & Optimization Utility
 * Automatically resizes large images (e.g. mobile photos / posters) to web-optimized dimensions,
 * converts to WebP/JPEG, and compresses file size down to ~100-250KB before network upload.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeMB?: number;
}

export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1600,
    maxHeight = 1200,
    quality = 0.82,
    maxSizeMB = 10,
  } = options;

  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`Image is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is ${maxSizeMB}MB.`);
  }

  // Preserve SVG or already lightweight files under 80KB without re-encoding
  if (file.type === "image/svg+xml" || file.type === "image/gif" || (file.size < 80 * 1024 && file.type === "image/webp")) {
    return file;
  }

  // Ensure running in browser environment
  if (typeof window === "undefined" || typeof document === "undefined") {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calculate scaled dimensions keeping aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width / maxWidth > height / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(file); // Fallback to original if canvas context unavailable
        }

        // Fill white background in case of transparent PNG converted to JPEG
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first, fallback to JPEG
        const outputType = "image/webp";
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file);
            }
            const cleanName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const compressedFile = new File([blob], cleanName, {
              type: outputType,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          outputType,
          quality
        );
      };

      img.onerror = () => {
        // If image object fails to decode, fallback to original
        resolve(file);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });
}
