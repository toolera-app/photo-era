/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const envVarsZodSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z
    .string()
    .default("3030")
    .refine((val: any) => Number(val)),
  JWT_SECRET: z.string(),
  EXPIRES_IN: z.string(),
  REDIS_URL: z.string(),
  // AUTH_SERVICE_URL: z.string(),
  CORE_SERVICE_URL: z.string(),
  // MERCH_SERVICE_URL: z.string(),
  // ORDER_SERVICE_URL: z.string(),
  CORE_SERVICE_FILE_URL: z.string(),
  // MERCH_SERVICE_FILE_URL: z.string(),
  // ORDER_SERVICE_FILE_URL: z.string(),
  // EVENT_EXPIRATION_TIME: z.string(),
  // CART_EXPIRATION_TIME: z.string(),
  API_SERVICE_FILE_URL: z.string(),
  // aws
  AWS_REGION: z.string(),
  AWS_ACCESS_KEY: z.string(),
  AWS_SECRET_KEY: z.string(),
  AWS_BUCKET_NAME: z.string(),
});

const envVars = envVarsZodSchema.parse(process.env);

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwt: {
    secret: envVars.JWT_SECRET,
  },
  redis: {
    url: envVars.REDIS_URL,
    expires_in: envVars.EXPIRES_IN,
  },
  // authServiceUrl: envVars.AUTH_SERVICE_URL,
  coreServiceUrl: envVars.CORE_SERVICE_URL,
  // merchServiceUrl: envVars.MERCH_SERVICE_URL,
  // orderServiceUrl: envVars.ORDER_SERVICE_URL,
  event_expires: process.env.EVENT_EXPIRATION_TIME,
  cart_expires: process.env.CART_EXPIRATION_TIME,
  logout_expires: process.env.LOGOUT_EXPIRATION_TIME,
  coreServiceFileUrl: envVars.CORE_SERVICE_FILE_URL,
  // merchServiceFileUrl: envVars.MERCH_SERVICE_FILE_URL,
  // orderServiceFileUrl: envVars.ORDER_SERVICE_FILE_URL,
  apiServiceFileUrl: envVars.API_SERVICE_FILE_URL,
  aws: {
    AWS_REGION: envVars.AWS_REGION,
    AWS_ACCESS_KEY: envVars.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: envVars.AWS_SECRET_KEY,
    AWS_BUCKET_NAME: envVars.AWS_BUCKET_NAME,
  },
};
