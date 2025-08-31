/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from "express";
import { IGenericResponseRedis } from "../../../interfaces/common";
import { OrderService as OrderHttpService } from "../../../shared/axios";
import { getAuthHeaderDetails } from "../../../utils/getAuthHeaderDetails";

const PER_IMAGE_CREDIT_ROUTE = "/per-image-credit";

// Create
const addPerImageCredit = async (req: Request): Promise<IGenericResponseRedis> => {
  const response: IGenericResponseRedis = await OrderHttpService.post(`${PER_IMAGE_CREDIT_ROUTE}/add-new`, req.body, {
    headers: getAuthHeaderDetails(req),
  });
  return response;
};

// List (supports pagination/sorting via req.query)
const getAllPerImageCredits = async (req: Request): Promise<IGenericResponseRedis> => {
  const response: IGenericResponseRedis = await OrderHttpService.get(`${PER_IMAGE_CREDIT_ROUTE}`, {
    params: req.query,
    headers: getAuthHeaderDetails(req),
  });
  return response;
};

// Details
const getSinglePerImageCredit = async (req: Request): Promise<IGenericResponseRedis> => {
  const { perImageCreditId } = req.params;
  const response: IGenericResponseRedis = await OrderHttpService.get(
    `${PER_IMAGE_CREDIT_ROUTE}/details/${perImageCreditId}`,
    { headers: getAuthHeaderDetails(req) },
  );
  return response;
};

// Update
const editSinglePerImageCredit = async (req: Request): Promise<IGenericResponseRedis> => {
  const { perImageCreditId } = req.params;
  const payload = req.body;
  const response: IGenericResponseRedis = await OrderHttpService.patch(
    `${PER_IMAGE_CREDIT_ROUTE}/update/${perImageCreditId}`,
    payload,
    { headers: getAuthHeaderDetails(req) },
  );
  return response;
};

// Delete
const deleteSinglePerImageCredit = async (req: Request): Promise<IGenericResponseRedis> => {
  const { perImageCreditId } = req.params;
  const response: IGenericResponseRedis = await OrderHttpService.delete(
    `${PER_IMAGE_CREDIT_ROUTE}/delete/${perImageCreditId}`,
    { headers: getAuthHeaderDetails(req) },
  );
  return response;
};

export const PerImageCreditService = {
  addPerImageCredit,
  getAllPerImageCredits,
  getSinglePerImageCredit,
  editSinglePerImageCredit,
  deleteSinglePerImageCredit,
};
