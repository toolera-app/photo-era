/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from "express";
import { IGenericResponseRedis } from "../../../interfaces/common";
import { OrderService as OrderHttpService } from "../../../shared/axios";
import { getAuthHeaderDetails } from "../../../utils/getAuthHeaderDetails";

const ORDER_ROUTE = "/orders";

// Create
const addNewOrder = async (req: Request): Promise<IGenericResponseRedis> => {
  const response: IGenericResponseRedis = await OrderHttpService.post(`${ORDER_ROUTE}/add-new`, req.body, {
    headers: getAuthHeaderDetails(req),
  });
  return response;
};

// List (supports pagination/sorting via req.query)
const getAllOrders = async (req: Request): Promise<IGenericResponseRedis> => {
  const response: IGenericResponseRedis = await OrderHttpService.get(`${ORDER_ROUTE}`, {
    params: req.query,
    headers: getAuthHeaderDetails(req),
  });
  return response;
};

// Details
const getSingleOrder = async (req: Request): Promise<IGenericResponseRedis> => {
  const { orderId } = req.params;
  const response: IGenericResponseRedis = await OrderHttpService.get(`${ORDER_ROUTE}/details/${orderId}`, {
    headers: getAuthHeaderDetails(req),
  });
  return response;
};

// Update
const editSingleOrder = async (req: Request): Promise<IGenericResponseRedis> => {
  const { orderId } = req.params;
  const payload = req.body;
  const response: IGenericResponseRedis = await OrderHttpService.patch(`${ORDER_ROUTE}/update/${orderId}`, payload, {
    headers: getAuthHeaderDetails(req),
  });
  return response;
};

// Delete
const deleteSingleOrder = async (req: Request): Promise<IGenericResponseRedis> => {
  const { orderId } = req.params;
  const response: IGenericResponseRedis = await OrderHttpService.delete(`${ORDER_ROUTE}/delete/${orderId}`, {
    headers: getAuthHeaderDetails(req),
  });
  return response;
};

export const OrderService = {
  addNewOrder,
  getAllOrders,
  getSingleOrder,
  editSingleOrder,
  deleteSingleOrder,
};
