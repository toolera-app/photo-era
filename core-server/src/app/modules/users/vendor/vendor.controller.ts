import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../../shared/catchAsync";
import pick from "../../../../shared/pick";
import { VendorUserService } from "./vendor.service";
import sendResponse from "../../../../shared/sendResponse";
import { IRequestUser } from "../../../interfaces/global.interfaces";
import { VendorFilterableFields } from "./vendor.constants";
import { VendorOrganizationService } from "./vendor.organization.service";

// ! get all vendors
const getAllVendorUsers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, VendorFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await VendorUserService.getAllVendorUsers(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Vendors retrieved successfully",
    data: result,
  });
});
// ! get all event organizers
const getAllOrganizers = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, VendorFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await VendorUserService.getAllOrganizers(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Vendors retrieved successfully",
    data: result,
  });
});

// ! get single event organizer details
const getEventOrganizerDetails = catchAsync(async (req: Request, res: Response) => {
  const { userName } = req.params;
  const result = await VendorUserService.getEventOrganizerDetails(userName);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Details retrieved",
    data: result,
  });
});

// ! get my details (when user is logged in)
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as IRequestUser).userId;
  const result = await VendorUserService.getMyProfile(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My Profile successfully",
    data: result,
  });
});

// ! get single customer details - ADMIN
const getVendorDetails = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;
  const result = await VendorUserService.getVendorDetails(slug);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Details retrieved",
    data: result,
  });
});

// ! update my profile info
const updateMyProfileInfo = catchAsync(async (req: Request, res: Response) => {
  const userId = (req.user as IRequestUser).userId;
  const vendorProfileId = (req.user as IRequestUser).profileId;

  const result = await VendorUserService.updateMyProfileInfo(vendorProfileId, userId, req?.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

//
// ! update vendor profile status
const updateVendorProfileStatus = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await VendorUserService.updateVendorProfileStatus(userId, req?.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Updated successfully",
    data: result,
  });
});
const checkUniqueOrganizationName = catchAsync(async (req: Request, res: Response) => {
  const { searchTerm } = req?.params;
  const result = await VendorOrganizationService.checkUniqueOrganizationName(searchTerm);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Organization Unique Name Checking!",
    data: result,
  });
});
// ! close Vendor user account
const closeVendorUserAccount = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await VendorUserService.closeVendorUserAccount(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});
export const VendorUserController = {
  getAllVendorUsers,
  getAllOrganizers,
  getEventOrganizerDetails,
  getVendorDetails,
  updateMyProfileInfo,
  getMyProfile,
  updateVendorProfileStatus,
  checkUniqueOrganizationName,
  closeVendorUserAccount,
};
