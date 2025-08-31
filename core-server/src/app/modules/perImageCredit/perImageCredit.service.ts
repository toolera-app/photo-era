import { perImageCreditRelationalFields, perImageCreditRelationalFieldsMapper, perImageCreditSearchableFields } from "./perImageCredit.instant";
import { perImageCredit, Prisma } from "@prisma/client";
import { ICategoryEditRequest, IPerImageCreditCreateRequest, IPerImageCreditFilterRequest } from "./perImageCredit.interface";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { IGenericResponse } from "../../../interfaces/common";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { Request } from "express";

const addNewPerImageCredit = async (req: Request): Promise<perImageCredit> => {
  const { creditCharged = 0 } = req.body as IPerImageCreditCreateRequest;

  // basic validation similar in spirit to your review creator
  if (typeof creditCharged !== "number" || Number.isNaN(creditCharged) || creditCharged < 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "creditCharged must be a non-negative number");
  }

  const result = await prisma.perImageCredit.create({
    data: { creditCharged },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create per-image credit");
  }

  return result;
};

// ! get all
const getAllPerImageCredits = async (filters: IPerImageCreditFilterRequest, options: IPaginationOptions): Promise<IGenericResponse<perImageCredit[]>> => {
  // Calculate pagination options
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);

  // Destructure filter properties
  const { searchTerm, ...filterData } = filters;

  // Define an array to hold filter conditions
  const andConditions: Prisma.perImageCreditWhereInput[] = [];

  // Add search term condition if provided

  if (searchTerm) {
    andConditions.push({
      OR: perImageCreditSearchableFields.map((field: any) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // Add filterData conditions if filterData is provided
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        if (perImageCreditRelationalFields.includes(key)) {
          return {
            [perImageCreditRelationalFieldsMapper[key]]: {
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

  // Create a whereConditions object with AND conditions
  const whereConditions: Prisma.perImageCreditWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

  // Retrieve   with filtering and pagination
  const result = await prisma.perImageCredit.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: options.sortBy && options.sortOrder ? { [options.sortBy]: options.sortOrder } : { createdAt: "desc" },
  });

  // Count total matching orders for pagination
  const total = await prisma.perImageCredit.count({
    where: whereConditions,
  });

  // Calculate total pages
  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

// ! get single review
const getPerImageCreditById = async (perImageCreditId: string): Promise<perImageCredit> => {
  const result = await prisma.perImageCredit.findUnique({
    where: {
      perImageCreditId,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Per-image credit not found");
  }

  return result;
};

// ! update
const updatePerImageCredit = async (perImageCreditId: string, payload: ICategoryEditRequest): Promise<perImageCredit> => {
  const result = await prisma.perImageCredit.update({
    where: {
      perImageCreditId,
    },

    data: {
      //
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Category not updated");
  }

  return result;
};
// ! delete
const deletePerImageCredit = async (perImageCreditId: string): Promise<perImageCredit> => {
  const result = await prisma.perImageCredit.delete({
    where: {
      perImageCreditId,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to delete this Per-image credit");
  }

  return result;
};

export const perImageCreditService = {
  addNewPerImageCredit,
  getAllPerImageCredits,
  getPerImageCreditById,
  updatePerImageCredit,
  deletePerImageCredit,
};
