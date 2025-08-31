/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Express, Request, Response } from "express";
import httpStatus from "http-status";
import { TryOnService } from "./photoQuivers.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";

//! ======================== Try-On Controller ========================

// >> Health check
const healthz = catchAsync(async (_req: Request, res: Response) => {
  const result = await TryOnService.healthz();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "ok",
    data: result,
  });
});

// >> Generate prompt (Replicate-backed; name kept for compatibility)
const textPrompt = catchAsync(async (req: Request, res: Response) => {
  const { notes = "", product = "garment" } = pick(req.body, ["notes", "product"]) as {
    notes?: string;
    product?: string;
  };

  const result = await TryOnService.textPrompt({ notes, product });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Prompt generated successfully",
    data: result,
  });
});

// >> Remove background (garment)
const removeBg = catchAsync(async (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File | undefined; // multer single('garment')
  const result = await TryOnService.removeBg(file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Background removed successfully",
    data: result, // { url }
  });
});

// >> Try-on (mock | local | replicate)
const tryon = catchAsync(async (req: Request, res: Response) => {
  // Service expects the full Request (needs req.user, req.files, req.body)
  const result = await TryOnService.tryon(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Try-on completed successfully",
    data: result,
  });
});

//! ======================== Export Controller ========================
export const TryOnController = {
  healthz,
  textPrompt,
  removeBg,
  tryon,
};
