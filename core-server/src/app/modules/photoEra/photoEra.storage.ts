// src/modules/photo-era/photoEra.storage.ts
import { v4 as uuidv4 } from "uuid";
import path from "path";
import config from "../../../config";
import { minio } from "../../../shared/minio.client";

let bucketEnsured = false;

async function ensureBucketOnce() {
  if (bucketEnsured) return;
  const bucket = config.MINIO_BUCKET_IMAGES;
  const exists = await minio.bucketExists(bucket).catch(() => false);
  if (!exists) {
    await minio.makeBucket(bucket, "");
  }
  bucketEnsured = true;
}

function buildObjectKey(userId: string, kind: "person" | "garment" | "result", ext = ".png") {
  const id = uuidv4();
  const folder = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return path.posix.join(userId, folder, kind, `${id}${ext}`);
}

export async function putImageBuffer(buf: Buffer, { userId, kind, contentType = "image/png" }: { userId: string; kind: "person" | "garment" | "result"; contentType?: string }) {
  await ensureBucketOnce();
  const objectName = buildObjectKey(userId, kind, ".png");

  await minio.putObject(
    config.MINIO_BUCKET_IMAGES,
    objectName,
    buf,
    buf.length, // 👈 size (you can also pass null if unknown, but buffer has a length)
    { "Content-Type": contentType }, // 👈 metadata
  );

  return objectName;
}

/** Build a server URL that proxies MinIO via your /files route. */
export function buildPublicUrl(objectName: string) {
  const base = (config.MINIO_PUBLIC_BASE_URL || "").trim();
  if (!base) return ""; // you may choose to throw here
  const baseNoSlash = base.replace(/\/+$/, "");
  // => http(s)://your-server/files/<bucket>/<objectName>
  return `${baseNoSlash}/${config.MINIO_BUCKET_IMAGES}/${objectName}`;
}

export async function getPresignedUrl(objectName: string, expirySeconds = 24 * 60 * 60) {
  await ensureBucketOnce();
  return minio.presignedGetObject(config.MINIO_BUCKET_IMAGES, objectName, expirySeconds);
}

/** Read an object fully into a Buffer (server-side). */
export async function getObjectBuffer(objectName: string): Promise<{ buffer: Buffer; metaData: Record<string, string> }> {
  await ensureBucketOnce();

  const metaData = await minio.statObject(config.MINIO_BUCKET_IMAGES, objectName);

  const stream = await minio.getObject(config.MINIO_BUCKET_IMAGES, objectName);
  const chunks: Buffer[] = [];

  const buffer = await new Promise<Buffer>((resolve, reject) => {
    stream.on("data", (c) => chunks.push(c));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });

  return { buffer, metaData: metaData.metaData };
}
