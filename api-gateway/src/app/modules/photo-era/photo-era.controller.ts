// photoEra.controller.ts
import type { Request, Response, NextFunction } from "express";
import sendResponse from "../../../shared/sendResponse";
import { PhotoEraService } from "./photo-era.service";

// Health
const healthz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response = await PhotoEraService.healthz(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

// Text prompt
const generateTextPrompt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response = await PhotoEraService.generateTextPrompt(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

// Remove background (garment)
const removeBg = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response = await PhotoEraService.removeBg(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

// Try-on
const tryon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response = await PhotoEraService.tryon(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

export const PhotoEraController = {
  healthz,
  generateTextPrompt,
  removeBg,
  tryon,
};
