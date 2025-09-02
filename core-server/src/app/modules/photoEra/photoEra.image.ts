import sharp from "sharp";
import { buildPublicUrl, getPresignedUrl, putImageBuffer } from "./photoEra.storage";
import config from "../../../config";

const MAX_DIMENSION = config.MAX_IMAGE_DIMENSION;

export async function ensureMaxSize(buf: Buffer, maxSize = MAX_DIMENSION): Promise<Buffer> {
  const image = sharp(buf);
  const meta = await image.metadata();

  if ((meta.width ?? 0) > maxSize || (meta.height ?? 0) > maxSize) {
    return await image
      .resize({
        width: maxSize,
        height: maxSize,
        fit: "inside",
        withoutEnlargement: true,
      })
      .toBuffer();
  }

  return buf;
}

export const ensurePngBuffer = (input: Buffer) => {
  return sharp(input).png({ force: true }).toBuffer();
};

export async function saveTemp(buf: Buffer, opts: { userId: string; kind: "person" | "garment" | "result" }) {
  const objectName = await putImageBuffer(buf, {
    userId: opts.userId,
    kind: opts.kind,
  });

  const url = buildPublicUrl(objectName);
  if (url) return url;

  // fallback → presigned URL (valid for 7 days by default)
  return await getPresignedUrl(objectName, 7 * 24 * 60 * 60);
}
