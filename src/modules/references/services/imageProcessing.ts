const MAX_THUMB_WIDTH = 480;
const MAX_THUMB_HEIGHT = 480;
const JPEG_QUALITY = 0.82;

export interface ImageInfo {
  width: number;
  height: number;
}

export interface ProcessedImage {
  blob: Blob;
  thumbnail: Blob;
  width: number;
  height: number;
}

export async function processImage(file: File): Promise<ProcessedImage | null> {
  if (!file.type.startsWith('image/')) return null;

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return null;

  try {
    const width = bitmap.width;
    const height = bitmap.height;
    const originalBlob = file.slice(0, file.size, file.type);

    const thumbCanvas = document.createElement('canvas');
    const scale = Math.min(1, MAX_THUMB_WIDTH / width, MAX_THUMB_HEIGHT / height);
    const thumbWidth = Math.max(1, Math.round(width * scale));
    const thumbHeight = Math.max(1, Math.round(height * scale));
    thumbCanvas.width = thumbWidth;
    thumbCanvas.height = thumbHeight;
    const ctx = thumbCanvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, thumbWidth, thumbHeight);

    const thumbnail = await canvasToBlob(thumbCanvas, 'image/jpeg', JPEG_QUALITY);

    return {
      blob: originalBlob,
      thumbnail,
      width,
      height,
    };
  } finally {
    bitmap.close();
  }
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('No se pudo generar el thumbnail'));
      },
      type,
      quality,
    );
  });
}

export function makeReferenceId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `ref-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}