import { Request, Response, NextFunction } from "express";

import sendResponse from "../../../shared/sendResponse";
import { PerImageCreditService } from "./perImageCredit.service";

// Create
const addPerImageCredit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await PerImageCreditService.addPerImageCredit(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

// List
const getAllPerImageCredits = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await PerImageCreditService.getAllPerImageCredits(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

// Details
const getSinglePerImageCredit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await PerImageCreditService.getSinglePerImageCredit(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

// Update
const updatePerImageCredit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await PerImageCreditService.editSinglePerImageCredit(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

// Delete
const deletePerImageCredit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await PerImageCreditService.deleteSinglePerImageCredit(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

export const PerImageCreditController = {
  addPerImageCredit,
  getAllPerImageCredits,
  getSinglePerImageCredit,
  updatePerImageCredit,
  deletePerImageCredit,
};
