import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

// Load .env file
dotenv.config({ path: path.join(process.cwd(), ".env") });

// Zod validation schema
const envVarsSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.string(),
  DATABASE_URL: z.string(),
  BCRYPT_SALT_ROUNDS: z.string(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string(),
  JWT_FORGET_PASSWORD: z.string(),
  JWT_FORGET_PASSWORD_EXPIRES_IN: z.string(),
  REDIS_URL: z.string(),
  EXPIRES_IN: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string(),
  business_site_url: z.string(),
  vendor_dashboard_site_url: z.string().optional(),
});

// Parse and validate env vars
const env = envVarsSchema.parse(process.env);

// Export config
export default {
  env: env.NODE_ENV,
  port: env.PORT,
  database_url: env.DATABASE_URL,
  bcrypt_salt_rounds: env.BCRYPT_SALT_ROUNDS,
  jwt: {
    secret: env.JWT_SECRET,
    refresh_secret: env.JWT_REFRESH_SECRET,
    expires_in: env.JWT_EXPIRES_IN,
    refresh_expires_in: env.JWT_REFRESH_EXPIRES_IN,
    forget_password_token: env.JWT_FORGET_PASSWORD,
    forget_password_expires_in: env.JWT_FORGET_PASSWORD_EXPIRES_IN,
  },
  redis: {
    url: env.REDIS_URL,
    expires_in: env.EXPIRES_IN,
  },
  googleAuth: {
    googleClientId: env.GOOGLE_CLIENT_ID,
    googleClientSecret: env.GOOGLE_CLIENT_SECRET,
    googleCallbackURL: env.GOOGLE_CALLBACK_URL,
  },

  business_site_url: env.business_site_url,

  vendor_dashboard_site_url: env.vendor_dashboard_site_url,

  // Replicate inference platform

  REMBG_URL: process.env.REMBG_URL,

  TRYON_PROVIDER: process.env.TRYON_PROVIDER,

  REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,

  REPLICATE_MODEL: process.env.REPLICATE_MODEL,

  REPLICATE_VERSION: process.env.REPLICATE_VERSION,
  REPLICATE_TEXT_MODEL: process.env.REPLICATE_TEXT_MODEL,

  STATIC_DIR: process.env.STATIC_DIR,

  // Object Storage
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT!,
  MINIO_PORT: process.env.MINIO_PORT || "9000",
  MINIO_USE_SSL: process.env.MINIO_USE_SSL || "false",
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY!,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY!,
  MINIO_BUCKET_IMAGES: process.env.MINIO_BUCKET_IMAGES || "photo-era",
  MINIO_PUBLIC_BASE_URL: process.env.MINIO_PUBLIC_BASE_URL || "",

  // Fal Ai inference platform
  FAL_KEY: process.env.FAL_KEY || "",
  FAL_MODEL: process.env.FAL_MODEL || "",
  MAX_IMAGE_DIMENSION: Number(process.env.MAX_IMAGE_DIMENSION || 1024),

  //Rate Limit
  RATE_LIMIT_MAX_HITS: process.env.RATE_LIMIT_MAX_HITS,
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_PENALTY_MS: process.env.RATE_LIMIT_PENALTY_MS,
};
