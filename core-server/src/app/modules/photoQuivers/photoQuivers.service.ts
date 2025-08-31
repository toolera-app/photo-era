/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Express, Request } from "express";
import httpStatus from "http-status";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { generateTryOnPrompt } from "./photoQuivers.promt.utils"; // still available for a separate textPrompt endpoint
import { ensurePngBuffer, saveTemp } from "./photoQuivers.image";
import { toBuffer } from "./photoQuivers.buffer.utils";
import { fetchWithFormData } from "./photoQuivers.http.utils";
import { runReplicate } from "./photoQuivers.replicateClient";
import { IRequestUser } from "../../interfaces/global.interfaces";

const healthz = async () => ({ ok: true, provider: config.TRYON_PROVIDER || "none" });

/**
 * Optional helper: generate a prompt suggestion elsewhere (NOT used in tryon)
 */
const textPrompt = async ({ notes, product }: { notes: string; product: string }) => {
  return await generateTryOnPrompt({ notes, product });
};

/**
 * Background removal helper for the garment
 */
const removeBg = async (file?: Express.Multer.File) => {
  if (!config.REMBG_URL) throw new ApiError(httpStatus.BAD_REQUEST, "REMBG_URL not configured");
  if (!file) throw new ApiError(httpStatus.BAD_REQUEST, "No 'garment' file uploaded");

  const filename = file.originalname || "garment.png";
  const resp = await fetchWithFormData(
    `${config.REMBG_URL}/remove`,
    {
      image_file: {
        buffer: file.buffer,
        filename,
        contentType: file.mimetype || "application/octet-stream",
      },
    },
    { timeoutMs: 120000 },
  );

  const url = await saveTemp(toBuffer(resp.data));
  return { url };
};

/**
 * Main try-on:
 * - Requires: req.user.userId, files: { customer, garment }, body: { perImageCreditId, prompt, remove_bg_first? }
 * - NO auto-prompting; if prompt missing -> 400 and NO charge
 * - On success: deduct creditCharged from user's CreditBalance, create ImageGenerate record
 */

export const tryon = async (req: Request) => {
  // Files via multer fields: 'customer' (person) and 'garment'
  const files = req.files as Record<string, Express.Multer.File[]>;
  const personFile = files?.customer?.[0];
  const garmentFile = files?.garment?.[0];
  if (!personFile || !garmentFile) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing 'customer' or 'garment'");
  }

  // Authenticated user (auth middleware populates req.user)
  const { userId } = (req.user || {}) as IRequestUser;
  if (!userId) throw new ApiError(httpStatus.UNAUTHORIZED, "User Not Found");

  // Inputs (NO perImageCreditId from body)
  const { prompt, remove_bg_first } = req.body || {};
  const used_prompt = typeof prompt === "string" ? prompt.trim() : "";
  if (!used_prompt) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Prompt is required to generate. No credits charged.");
  }

  // Pick the latest per-image credit plan
  const plan = (await prisma.perImageCredit.findFirst({ orderBy: { updatedAt: "desc" } })) || (await prisma.perImageCredit.findFirst({ orderBy: { createdAt: "desc" } }));

  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, "No per-image credit plan configured");

  const toDeduct = plan.creditCharged;
  const perImageCreditId = plan.perImageCreditId;

  // Pre-check user's balance
  const preBalance = await prisma.creditBalance.findUnique({
    where: { userId },
    select: { creditBalance: true },
  });
  if (!preBalance || preBalance.creditBalance < toDeduct) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient credit balance");
  }

  // Prepare input images
  let personPng = await ensurePngBuffer(personFile.buffer);
  let garmentPng = await ensurePngBuffer(garmentFile.buffer);

  // Optional background removal for garment first
  const removeBgFirst = String(remove_bg_first ?? "false") === "true";
  if (removeBgFirst && config.REMBG_URL) {
    const filename = garmentFile.originalname || "garment.png";
    const resp = await fetchWithFormData(`${config.REMBG_URL}/remove`, { image_file: { buffer: garmentPng, filename, contentType: "image/png" } }, { timeoutMs: 120000 });
    garmentPng = toBuffer(resp.data);
  }

  // Provider check
  if (config.TRYON_PROVIDER !== "replicate") {
    throw new ApiError(httpStatus.BAD_REQUEST, `Unknown TRYON_PROVIDER=${config.TRYON_PROVIDER}`);
  }

  // Run the model
  const { error, resultBuffer, raw } = await runReplicate({
    personPng,
    garmentPng,
    prompt: used_prompt,
  });
  if (error) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, error);
  if (!resultBuffer) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Unexpected replicate output: ${String(raw).slice(0, 200)}`);
  }

  // Persist images (URLs)
  const modelImageUrl = await saveTemp(personPng);
  const productImageUrl = await saveTemp(garmentPng);
  const generatedImageUrl = await saveTemp(resultBuffer);

  // Deduct balance and create ImageGenerate atomically
  const imageGen = await prisma.$transaction(async (tx) => {
    const balance = await tx.creditBalance.findUnique({
      where: { userId },
      select: { creditBalanceId: true, creditBalance: true },
    });
    if (!balance) throw new ApiError(httpStatus.BAD_REQUEST, "Credit balance not initialized for user");
    if (balance.creditBalance < toDeduct) throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient credit balance");

    await tx.creditBalance.update({
      where: { creditBalanceId: balance.creditBalanceId },
      data: { creditBalance: { decrement: toDeduct } },
    });

    return tx.imageGenerate.create({
      data: {
        userId,
        textPrompt: used_prompt,
        perImageCreditId,
        modelImageUrl,
        productImageUrl,
        generatedImageUrl,
      },
      select: {
        imageGenerateId: true,
        userId: true,
        perImageCreditId: true,
        generatedImageUrl: true,
        createdAt: true,
      },
    });
  });

  return {
    provider: "replicate",
    used_prompt,
    deducted: toDeduct,
    perImageCreditId,
    imageGenerateId: imageGen.imageGenerateId,
    result_url: generatedImageUrl,
  };
};

export const TryOnService = {
  healthz,
  textPrompt, // optional helper for a separate endpoint if needed
  removeBg,
  tryon,
};
