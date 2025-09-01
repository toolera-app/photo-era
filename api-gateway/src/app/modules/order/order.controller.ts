import { Request, Response, NextFunction } from "express";

import sendResponse from "../../../shared/sendResponse";
import { OrderService } from "./order.service";

// Create
const addNewOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await OrderService.addNewOrder(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

// List
const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await OrderService.getAllOrders(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

// Details
const getSingleOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await OrderService.getSingleOrder(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

// Update
const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await OrderService.editSingleOrder(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

// Delete
const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await OrderService.deleteSingleOrder(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

export const OrderController = {
  addNewOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
};
