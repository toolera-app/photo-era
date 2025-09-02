/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Request, Response } from "express";
import httpStatus from "http-status";
import { TryOnService } from "./photoEra.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";

//! ======================== Try-On Controller ========================

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
  textPrompt,
  tryon,
};
