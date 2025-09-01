/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Express, Request } from "express";
import FormData from "form-data";
import { IGenericResponseRedis } from "../../../interfaces/common";
import { OrderService as OrderHttpService } from "../../../shared/axios";
import { getAuthHeaderDetails } from "../../../utils/getAuthHeaderDetails";

const PHOTO_ERA_ROUTE = "/photo";

const mergeHeaders = (req: Request, extra: Record<string, string> = {}) => ({
  ...getAuthHeaderDetails(req),
  ...extra,
});

// Optional helper to safely append a Multer file to FormData
const appendMulterFile = (fd: FormData, file: Express.Multer.File | undefined, field: string) => {
  if (!file) return;
  fd.append(field, file.buffer, {
    filename: file.originalname || `${field}.bin`,
    contentType: file.mimetype || "application/octet-stream",
  });
};

// ------------------- Health -------------------
const healthz = async (req: Request): Promise<IGenericResponseRedis> => {
  const response: IGenericResponseRedis = await OrderHttpService.get(`${PHOTO_ERA_ROUTE}/healthz`, {
    headers: mergeHeaders(req),
  });
  return response;
};

// ------------------- Text Prompt -------------------
const generateTextPrompt = async (req: Request): Promise<IGenericResponseRedis> => {
  // Core expects JSON body: { notes?: string, product?: string }
  const response: IGenericResponseRedis = await OrderHttpService.post(`${PHOTO_ERA_ROUTE}/text_prompt`, req.body, {
    headers: mergeHeaders(req, { "Content-Type": "application/json" }),
  });
  return response;
};

// ------------------- Remove Background -------------------
const removeBg = async (req: Request): Promise<IGenericResponseRedis> => {
  // Core expects POST multipart with single field "garment"
  const fd = new FormData();

  // Multer may provide it as req.file (single) or req.files?.garment?.[0] (fields)
  const single = (req as any).file as Express.Multer.File | undefined;

  const files = (req as any).files as Record<string, Express.Multer.File[]> | undefined;
  const garment = single ?? files?.garment?.[0];

  appendMulterFile(fd, garment, "garment");

  const response: IGenericResponseRedis = await OrderHttpService.post(`${PHOTO_ERA_ROUTE}/remove_bg`, fd, {
    headers: mergeHeaders(req, fd.getHeaders() as Record<string, string>),
  });
  return response;
};

// ------------------- Try-on -------------------
const tryon = async (req: Request): Promise<IGenericResponseRedis> => {
  // Core expects POST multipart with fields:
  // files: "customer" (optional), "garment" (optional)
  // body: any additional fields (e.g., notes, product, options)
  const fd = new FormData();

  const files = (req as any).files as Record<string, Express.Multer.File[]> | undefined;

  const customer = files?.customer?.[0];
  const garment = files?.garment?.[0];

  appendMulterFile(fd, customer, "customer");
  appendMulterFile(fd, garment, "garment");

  // Append scalar body fields
  // If arrays/objects exist, stringify them so the core can parse as needed
  Object.entries(req.body ?? {}).forEach(([key, val]) => {
    if (val === undefined || val === null) return;
    const isPrimitive = ["string", "number", "boolean"].includes(typeof val);
    fd.append(key, isPrimitive ? String(val) : JSON.stringify(val));
  });

  const response: IGenericResponseRedis = await OrderHttpService.post(`${PHOTO_ERA_ROUTE}/tryon`, fd, {
    headers: mergeHeaders(req, fd.getHeaders() as Record<string, string>),
  });
  return response;
};

export const PhotoEraService = {
  healthz,
  generateTextPrompt,
  removeBg,
  tryon,
};
