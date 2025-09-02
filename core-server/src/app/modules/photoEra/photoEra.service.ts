/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Express, Request } from "express";
import httpStatus from "http-status";
import config from "../../../config";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { generateTryOnPrompt } from "./photoEra.prompt.utils"; // still available for a separate textPrompt endpoint
import { ensurePngBuffer, saveTemp } from "./photoEra.image";
import { runReplicate } from "./photoEra.replicateClient";
import { IRequestUser } from "../../interfaces/global.interfaces";

/**
 * Optional helper: generate a prompt suggestion elsewhere (NOT used in tryon)
 */
const textPrompt = async ({ notes, product }: { notes: string; product: string }) => {
  return await generateTryOnPrompt({ notes, product });
};

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
  const { prompt } = req.body || {};
  const used_prompt = typeof prompt === "string" ? prompt.trim() : "";
  if (!used_prompt) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Prompt is required to generate.");
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
  const modelImageUrl = await saveTemp(personPng, { userId, kind: "person" });
  const productImageUrl = await saveTemp(garmentPng, { userId, kind: "garment" });
  const generatedImageUrl = await saveTemp(resultBuffer, { userId, kind: "result" });

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
  textPrompt, // optional helper for a separate endpoint if needed
  tryon,
};
