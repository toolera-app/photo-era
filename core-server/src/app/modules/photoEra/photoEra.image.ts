import sharp from "sharp";
import { buildPublicUrl, getPresignedUrl, putImageBuffer } from "./photoEra.storage";

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
