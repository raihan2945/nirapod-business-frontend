//the API sits behind nginx, which rejects request bodies over ~1MB with a 413
//before the backend sees them. phone camera photos are routinely 2-5MB, so
//shrink them in the browser before they're uploaded.

const MAX_DIMENSION = 1600;
const TARGET_BYTES = 800 * 1024;
const QUALITIES = [0.85, 0.7, 0.55, 0.4];

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    img.src = url;
  });

const toBlob = (canvas: HTMLCanvasElement, quality: number) =>
  new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );

//returns a JPEG no larger than TARGET_BYTES where possible. falls back to the
//original file if the browser can't decode it (e.g. HEIC on desktop Chrome)
export async function compressImage(file: File): Promise<File> {
  if (file.size <= TARGET_BYTES) return file;

  try {
    const img = await loadImage(file);
    const scale = Math.min(
      1,
      MAX_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight),
    );

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    //JPEG has no alpha - paint white so transparent PNGs don't turn black
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    let blob: Blob | null = null;
    for (const quality of QUALITIES) {
      blob = await toBlob(canvas, quality);
      if (blob && blob.size <= TARGET_BYTES) break;
    }
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]*$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    return file;
  }
}
