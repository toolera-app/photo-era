import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../../shared/catchAsync";
import pick from "../../../../shared/pick";
import { CustomerUserService } from "./customer.service";
import sendResponse from "../../../../shared/sendResponse";
import { IRequestUser } from "../../../interfaces/global.interfaces";
import { CustomerFilterableFields } from "./customer.constants";

// ! get all customers
const getAllCustomers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, CustomerFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await CustomerUserService.getAllUserService(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Customer retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});
// ! get my details (when user is logged in)
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as IRequestUser).userId;
  const result = await CustomerUserService.getMyProfile(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My Profile successfully",
    data: result,
  });
});

// ! get single customer details
const getCustomerDetails = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await CustomerUserService.getSingleCustomer(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Customer Details retrieved",
    data: result,
  });
});

// ! update my profile info
const updateMyProfileInfo = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as IRequestUser).userId;

  const payload = req.body;
  const result = await CustomerUserService.updateMyProfileInfo(userId, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});
// ! close customer user account
const closeCustomerUserAccount = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await CustomerUserService.closeCustomerUserAccount(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

export const CustomerUserController = {
  getAllCustomers,
  getMyProfile,
  getCustomerDetails,
  updateMyProfileInfo,
  closeCustomerUserAccount,
};
