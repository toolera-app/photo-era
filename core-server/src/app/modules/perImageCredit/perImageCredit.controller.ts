import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { perImageCreditService } from "./perImageCredit.service";
import pick from "../../../shared/pick";
import { perImageCreditFilterableFields } from "./perImageCredit.instant";

export const createPerImageCredit = catchAsync(async (req: Request, res: Response) => {
  const result = await perImageCreditService.addNewPerImageCredit(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Per-image credit created successfully",
    data: result,
  });
});

// !----------------------------------get all Per-image credits---------------------------------------->>>
const getAllPerImageCredits = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, perImageCreditFilterableFields);

  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await perImageCreditService.getAllPerImageCredits(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Per-image credits fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

// !----------------------------------get Single  details---------------------------------------->>>
const singlePerImageCredit = catchAsync(async (req: Request, res: Response) => {
  const { creditId } = req.params;
  const result = await perImageCreditService.getPerImageCreditById(creditId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Per-image credit retrieved successfully",
    data: result,
  });
});

// !----------------------------------Update ---------------------------------------->>>
const updatePerImageCredit = catchAsync(async (req: Request, res: Response) => {
  const { perImageCreditId } = req.params;
  const payload = req.body;
  // @ts-ignore
  const result = await perImageCreditService.updatePerImageCredit(perImageCreditId, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Updated successfully !",
    data: result,
  });
});
// ! delete
const deletePerImageCredit = catchAsync(async (req: Request, res: Response) => {
  const { perImageCreditId } = req.params;
  const result = await perImageCreditService.deletePerImageCredit(perImageCreditId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deleted successfully !",
    data: result,
  });
});

export const PerImageCreditController = {
  createPerImageCredit,
  getAllPerImageCredits,
  singlePerImageCredit,
  updatePerImageCredit,
  deletePerImageCredit,
};
