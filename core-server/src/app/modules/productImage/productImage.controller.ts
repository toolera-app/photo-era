/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import { productImageService } from "./productImage.service";

//! ======================== Try-On Controller ========================

const ProductImageGenerate = catchAsync(async (req: Request, res: Response) => {
  const result = await productImageService.ProductImageGenerate(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Prompt generated successfully",
    data: result,
  });
});

//! ======================== Export Controller ========================
export const ProductImageGenerateController = {
  ProductImageGenerate,
};
