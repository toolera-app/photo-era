/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from "express";
import { IGenericResponseRedis } from "../../../../interfaces/common";
import { CoreService as HttpService } from "../../../../shared/axios";
import { getAuthHeaderDetails } from "../../../../utils/getAuthHeaderDetails";
const CUSTOMER_ROUTE = "/customers";

// !  get all Customers ------------------------------>>>
const getAllCustomers = async (req: Request): Promise<IGenericResponseRedis> => {
  const response: IGenericResponseRedis = await HttpService.get(`${CUSTOMER_ROUTE}/get-all-customers`, {
    headers: {
      Authorization: req.headers.authorization,
    },
    params: req?.query,
  });
  return response;
};

// !  get My Profile (CUSTOMER) ------------------------------>>>
const getMyProfile = async (req: Request): Promise<IGenericResponseRedis> => {
  const response: IGenericResponseRedis = await HttpService.get(`${CUSTOMER_ROUTE}/my-profile`, {
    headers: {
      Authorization: req.headers.authorization,
    },
  });
  return response;
};

// !  Update  my profile ------------------------------>>>

const updateMyProfileInfo = async (req: Request): Promise<IGenericResponseRedis> => {
  const requestedData = JSON.parse(req?.body?.data);
  const obj = {
    ...requestedData,
    imagePath: req?.body?.imageUrl,
  };
  const response: IGenericResponseRedis = await HttpService.patch(`${CUSTOMER_ROUTE}/update-my-profile`, obj, {
    headers: getAuthHeaderDetails(req),
  });
  return response;
};

// !  get single user ------------------------------>>>
const getCustomerDetails = async (req: Request): Promise<IGenericResponseRedis> => {
  const response: IGenericResponseRedis = await HttpService.get(`${CUSTOMER_ROUTE}/get-customer-details/:userId`, {
    headers: {
      Authorization: req.headers.authorization,
    },
  });
  return response;
};

//! Delete a customer
const closeCustomerUserAccount = async (req: Request): Promise<IGenericResponseRedis> => {
  const response: IGenericResponseRedis = await HttpService.patch(`${CUSTOMER_ROUTE}/close-customer-account/:userId`, {
    headers: {
      Authorization: req.headers.authorization,
    },
  });
  return response;
};

export const CustomerUserService = {
  getAllCustomers,
  getMyProfile,
  updateMyProfileInfo,
  getCustomerDetails,
  closeCustomerUserAccount,
};
