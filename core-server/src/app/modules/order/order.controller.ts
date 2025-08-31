import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { orderService } from "./order.service";
import pick from "../../../shared/pick";
import { orderFilterableFields } from "./order.instant";

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.addNewOrder(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order created successfully",
    data: result,
  });
});

// !----------------------------------get all Orders---------------------------------------->>>
const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, orderFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await orderService.getAllOrders(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All orders fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

// !----------------------------------get Single Order details---------------------------------------->>>
const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const result = await orderService.getOrderById(orderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order retrieved successfully",
    data: result,
  });
});

// !----------------------------------Update Order---------------------------------------->>>
const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const payload = req.body;

  const result = await orderService.updateOrder(orderId, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order updated successfully",
    data: result,
  });
});

// !----------------------------------Delete Order---------------------------------------->>>
const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const result = await orderService.deleteOrder(orderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order deleted successfully",
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
};
