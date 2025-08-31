/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../../shared/catchAsync";
import { CustomerUserService } from "./customer.service";
import sendResponse from "../../../../shared/sendResponse";

// !  get all Customers ------------------------------>>>
const getAllCustomers = catchAsync(async (req: Request, res: Response) => {
  const result = await CustomerUserService.getAllCustomers(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Customers retrieved",
    meta: result?.meta,
    data: result?.data,
  });
});
// !  get My Profile (CUSTOMER) ------------------------------>>>
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await CustomerUserService.getMyProfile(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My Profile retrieved",
    data: result?.data,
  });
});
// ! get single customer details
const getCustomerDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await CustomerUserService.getCustomerDetails(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Customer Details retrieved",
    data: result,
  });
});

// ! update my profile info

const updateMyProfileInfo = catchAsync(async (req: Request, res: Response) => {
  const result = await CustomerUserService.updateMyProfileInfo(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile Updated",
    data: result,
  });
});

export const CustomerUserController = {
  getAllCustomers,
  getMyProfile,
  getCustomerDetails,
  updateMyProfileInfo,
};
