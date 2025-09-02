// src/shared/minio.client.ts
import { Client } from "minio";
import config from "../config";

export const minio = new Client({
  endPoint: config.MINIO_ENDPOINT,
  port: Number(config.MINIO_PORT),
  useSSL: String(config.MINIO_USE_SSL) === "true",
  accessKey: config.MINIO_ACCESS_KEY,
  secretKey: config.MINIO_SECRET_KEY,
});
