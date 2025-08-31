import { user } from "./../../../../node_modules/.prisma/client/index.d";
import { orderRelationalFields, orderRelationalFieldsMapper, orderSearchableFields } from "./order.instant";
import { Order, OrderStatus, Prisma } from "@prisma/client";
import { IOrderCreateRequest, IOrderFilterRequest } from "./order.interface";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { Request } from "express";
import { IRequestUser } from "../../interfaces/global.interfaces";

// ! create
const addNewOrder = async (req: Request): Promise<Order> => {
  const { paymentNumber, amount, transactionId, reference } = req.body as IOrderCreateRequest;
  const { userId } = req?.user as IRequestUser;

  if (!userId) throw new ApiError(httpStatus.BAD_REQUEST, "userId is required");
  if (!paymentNumber) throw new ApiError(httpStatus.BAD_REQUEST, "paymentNumber is required");
  if (typeof amount !== "number" || Number.isNaN(amount) || amount < 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "amount must be a non-negative number");
  }
  if (!transactionId) throw new ApiError(httpStatus.BAD_REQUEST, "transactionId is required");

  // imageCredit follows amount (1:1)
  const computedImageCredit = amount;

  const order = await prisma.order.create({
    data: {
      userId,
      paymentNumber,
      amount,
      transactionId,
      reference,
      imageCredit: computedImageCredit,
      orderStatus: OrderStatus.PENDING,
    },
  });

  if (!order) throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create order");
  return order;
};

// ! get all
const getAllOrders = async (filters: IOrderFilterRequest, options: IPaginationOptions): Promise<IGenericResponse<Order[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);

  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.OrderWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: orderSearchableFields.map((field: any) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        if (orderRelationalFields.includes(key)) {
          // keep the same relational pattern you used
          return {
            [orderRelationalFieldsMapper[key]]: {
              ticketName: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.OrderWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.order.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: options.sortBy && options.sortOrder ? { [options.sortBy]: options.sortOrder } : { createdAt: "desc" },
  });

  const total = await prisma.order.count({ where: whereConditions });
  const totalPage = Math.ceil(total / limit);

  return {
    meta: { page, limit, total, totalPage },
    data: result,
  };
};

// ! get single
const getOrderById = async (orderId: string): Promise<Order> => {
  const result = await prisma.order.findUnique({
    where: { orderId },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  return result;
};

// ! update
const updateOrder = async (orderId: string, payload: Partial<Pick<Order, "paymentNumber" | "amount" | "reference" | "orderStatus">>): Promise<Order> => {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.order.findUnique({
      where: { orderId },
      select: { orderId: true, userId: true, orderStatus: true, imageCredit: true },
    });
    if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Order not found");

    // Validate amount when present
    if (payload.amount !== undefined) {
      if (typeof payload.amount !== "number" || Number.isNaN(payload.amount) || payload.amount < 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "amount must be a non-negative number");
      }
    }

    const isApproving = payload.orderStatus === OrderStatus.APPROVED && existing.orderStatus !== OrderStatus.APPROVED;

    // Keep imageCredit in sync with amount if amount is changed
    const data: Prisma.OrderUpdateInput = {};
    if (payload.paymentNumber !== undefined) data.paymentNumber = payload.paymentNumber;
    if (payload.amount !== undefined) {
      data.amount = payload.amount;
      data.imageCredit = payload.amount; // sync imageCredit with amount
    }
    if (payload.reference !== undefined) data.reference = payload.reference;
    if (payload.orderStatus !== undefined) data.orderStatus = payload.orderStatus;

    const updated = await tx.order.update({ where: { orderId }, data });

    // Only credit on transition to APPROVED
    if (isApproving) {
      const balance = await tx.creditBalance.upsert({
        where: { userId: existing.userId }, // unique
        update: {},
        create: { userId: existing.userId, creditBalance: 0 },
        select: { creditBalanceId: true, creditBalance: true },
      });

      const previous = balance.creditBalance;
      const creditsToAdd = updated.imageCredit; // after potential amount change
      const newTotal = previous + creditsToAdd;

      await tx.creditBalanceTransaction.create({
        data: {
          creditBalanceId: balance.creditBalanceId,
          previousCreditBalance: previous,
          creditBalanceTotal: newTotal,
          orderId: updated.orderId,
        },
      });

      await tx.creditBalance.update({
        where: { creditBalanceId: balance.creditBalanceId },
        data: { creditBalance: newTotal },
      });
    }

    return updated;
  });
};

// ! delete
const deleteOrder = async (orderId: string): Promise<Order> => {
  const result = await prisma.order.delete({
    where: { orderId },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to delete this Order");
  }

  return result;
};

export const orderService = {
  addNewOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
