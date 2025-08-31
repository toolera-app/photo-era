/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from "express";
import { IGenericResponseRedis } from "../../../interfaces/common";
import { CoreService as HttpService } from "../../../shared/axios";
import { getAuthHeaderDetails } from "../../../utils/getAuthHeaderDetails";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

// ! ---Customer registration

const createCustomerService = async (req: Request): Promise<IGenericResponseRedis> => {
  const response: IGenericResponseRedis = await HttpService.post("/auth/customer-registration", req.body, {
    headers: getAuthHeaderDetails(req),
  });
  return response;
};

// ! ---Customer registration with google
const createCustomerGoogleService = async (req: Request): Promise<IGenericResponseRedis> => {
  const response: IGenericResponseRedis = await HttpService.post("/auth/google-auth", req.body, {
    headers: getAuthHeaderDetails(req),
  });
  return response;
};

// ! ---Customer registration with google
const getCustomerGoogleAuthService = async (req: Request): Promise<IGenericResponseRedis> => {
  const response: IGenericResponseRedis = await HttpService.get("/auth/google-auth/callback", {
    headers: getAuthHeaderDetails(req),
  });
  return response;
};

const customerAuthSuccessService = async (req: Request): Promise<IGenericResponseRedis> => {
  const response: IGenericResponseRedis = await HttpService.get("/auth/success", {
    headers: getAuthHeaderDetails(req),
  });
  return response;
};

// ! ---Customer login
const customerLoginService = async (req: Request): Promise<IGenericResponseRedis> => {
  const response: IGenericResponseRedis = await HttpService.post("/auth/customer-login", req.body, {
    headers: getAuthHeaderDetails(req),
  });
  return response;
};
// ! ---Vendor registration

const vendorRegistration = async (req: Request): Promise<IGenericResponseRedis> => {
  const requestedData = JSON.parse(req?.body?.data);
  if (!req?.body?.files) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Images are required!");
  }
  const obj = {
    ...requestedData,
    files: req?.body?.files,
  };

  const response: IGenericResponseRedis = await HttpService.post(`/auth/vendor-registration`, obj, {
    headers: getAuthHeaderDetails(req),
  });
  return response;
};

// ! ---Vendor login
const vendorLoginService = async (req: Request): Promise<IGenericResponseRedis> => {
  const response: IGenericResponseRedis = await HttpService.post("/auth/vendor-login", req.body, {
    headers: getAuthHeaderDetails(req),
  });
  return response;
};
// ! check user exist
const checkUserExist = async (req: Request): Promise<IGenericResponseRedis> => {
  const response: IGenericResponseRedis = await HttpService.post("/auth/check-user-exist", req.body, {
    headers: getAuthHeaderDetails(req),
  });
  return response;
};

// ! ---Create super admin
const createSuperAdminService = async (req: Request): Promise<IGenericResponseRedis> => {
  const response: IGenericResponseRedis = await HttpService.post("/auth/create-superadmin", req.body, {
    headers: getAuthHeaderDetails(req),
  });
  return response;
};

// ! ---Admin dashboard login
const adminDashboardLoginService = async (req: Request): Promise<IGenericResponseRedis> => {
  const response: IGenericResponseRedis = await HttpService.post("/auth/admin-dashboard-login", req.body, {
    headers: {
      Authorization: req.headers.authorization,
    },
  });

  return response;
};

export const AuthService = {
  createCustomerService,
  createCustomerGoogleService,
  getCustomerGoogleAuthService,
  customerAuthSuccessService,
  customerLoginService,
  //
  vendorRegistration,
  vendorLoginService,
  //
  createSuperAdminService,
  adminDashboardLoginService,
  //
  checkUserExist,
};
