// src/modules/flux-kontext/fluxKontext.service.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Express, Request } from "express";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { IRequestUser } from "../../interfaces/global.interfaces";
import { ensureMaxSize, ensurePngBuffer, saveTemp } from "../photoEra/photoEra.image";
import { runImageModel } from "./productImage.falClient";
import { getBufferFromUrl } from "../photoEra/photoEra.http.utils";

const ProductImageGenerate = async (req: Request) => {
  // single file only: "input"
  const single = (req as any).file as Express.Multer.File | undefined;
  const files = (req as any).files as Record<string, Express.Multer.File[]> | undefined;
  const imageFile = single ?? files?.input?.[0];
  if (!imageFile) throw new ApiError(httpStatus.BAD_REQUEST, "Missing 'input' file");

  // auth
  const { userId } = (req.user || {}) as IRequestUser;
  if (!userId) throw new ApiError(httpStatus.UNAUTHORIZED, "User Not Found");

  // REQUIRED prompt (must be provided by frontend, AI or manual)
  const { prompt } = (req.body || {}) as { prompt?: string };
  const used_prompt = typeof prompt === "string" ? prompt.trim() : "";
  if (!used_prompt) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Prompt is required to generate.");
  }

  // pricing plan & balance
  const plan = (await prisma.perImageCredit.findFirst({ orderBy: { updatedAt: "desc" } })) || (await prisma.perImageCredit.findFirst({ orderBy: { createdAt: "desc" } }));
  if (!plan) throw new ApiError(httpStatus.NOT_FOUND, "No per-image credit plan configured");

  const toDeduct = plan.creditCharged;
  const perImageCreditId = plan.perImageCreditId;

  const preBalance = await prisma.creditBalance.findUnique({
    where: { userId },
    select: { creditBalance: true },
  });
  if (!preBalance || preBalance.creditBalance < toDeduct) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient credit balance");
  }

  // input buffer → save to MinIO → get URL for fal
  const inputPng = await ensureMaxSize(await ensurePngBuffer(imageFile.buffer));

  const inputImageUrl = await saveTemp(inputPng, { userId, kind: "person" });

  // fal.ai run (Kontext)
  const { error, outputUrl, raw } = await runImageModel({ imageUrl: inputImageUrl, prompt: used_prompt });
  if (error) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, error);
  if (!outputUrl) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Unexpected fal output: ${String(raw).slice(0, 200)}`);
  }

  // store result
  const resultBuffer = await getBufferFromUrl(outputUrl);
  const generatedImageUrl = await saveTemp(resultBuffer, { userId, kind: "result" });

  // deduct & persist
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
        modelImageUrl: inputImageUrl,
        productImageUrl: "",
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
    provider: "fal",
    used_prompt,
    deducted: toDeduct,
    perImageCreditId,
    imageGenerateId: imageGen.imageGenerateId,
    result_url: generatedImageUrl,
  };
};

export const productImageService = {
  ProductImageGenerate,
};
