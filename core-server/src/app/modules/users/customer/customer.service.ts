/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { IUpdateProfileReqAndResponse, IUserFilterRequest, IUsersResponse } from "./customer.interface";
import { IPaginationOptions } from "../../../../interfaces/pagination";
import { IGenericResponse } from "../../../../interfaces/common";
import { paginationHelpers } from "../../../../helpers/paginationHelper";
import prisma from "../../../../shared/prisma";
import ApiError from "../../../../errors/ApiError";
import config from "../../../../config";
import httpStatus from "http-status";
import { CustomerSearchableFields } from "./customer.constants";

// ! getting all customers ----------------------------------------------------------------------->>>
const getAllUserService = async (filters: IUserFilterRequest, options: IPaginationOptions): Promise<IGenericResponse<IUsersResponse[]>> => {
  // Calculate pagination options
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);

  // Destructure filter properties
  const { searchTerm, ...filterData } = filters;
  // Define an array to hold filter conditions
  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: CustomerSearchableFields.map((field: any) => {
        return {
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        } as Prisma.UserWhereInput;
      }),
    } as Prisma.UserWhereInput);
  }

  // Create a whereConditions object with AND conditions
  const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

  // Retrieve   with filtering and pagination
  const rawUsers = await prisma.user.findMany({
    where: {
      ...whereConditions,
      role: {
        hasSome: ["USER", "VENDOR"],
      },
    },
    omit: {
      password: true,
    },
    include: {
      _count: {
        select: {
          reviews: true,
          orders: true,
        },
      },
      orders: {
        where: {
          paymentStatus: "SUCCEEDED",
        },
        select: {
          totalGrand: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy: options.sortBy && options.sortOrder ? { [options.sortBy]: options.sortOrder } : { updatedAt: "desc" },
  });
  const excludedRoles = ["ADMIN", "SUPERADMIN", "STAFF", "EMPLOYEE"];
  const users = rawUsers?.filter((user) => !user.role.some((r) => excludedRoles.includes(r)));
  // Add totalSpent field per user
  const usersWithTotalSpent = users?.map((user) => {
    const totalSpent = user.orders.reduce((sum, order) => sum + Number(order.totalGrand || 0), 0);
    return {
      ...user,
      totalSpent,
    };
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: usersWithTotalSpent,
  };
};

// ! getting single customer data -------------------------------------------------------->>>
const getSingleCustomer = async (userId: string): Promise<IUsersResponse | null> => {
  // Check if the user exists
  const existingUser = await prisma.user.findUnique({
    where: {
      userId,
    },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "Customer not Found !!");
  }

  const result = await prisma.user.findUnique({
    where: {
      userId,
    },
    omit: {
      password: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not Found !!");
  }

  //@ts-ignore
  return result;
};

// ! update Profile info -------------------------------------------------------->>>
const updateMyProfileInfo = async (userId: string, payload: IUpdateProfileReqAndResponse) => {
  // Check if the user exists
  const existingUser = await prisma.user.findUnique({
    where: {
      userId,
    },
    select: {
      password: true,
    },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Profile not Found !!");
  }

  const { email, password, phoneNumber, firstName, lastName, ...others } = payload;

  if (email) {
    const existingUserEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUserEmail) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Email Already Exist !!");
    }
  }

  const updatedUserDetails: any = {
    email,
    phoneNumber,
    firstName,
    lastName,
    ...others,
  };

  if (password) {
    const hashedPassword = await bcrypt.hash(password as string, Number(config.bcrypt_salt_rounds));
    updatedUserDetails["password"] = hashedPassword;
  }
  // updating user data

  const updatedUser = await prisma.user.update({
    where: {
      userId,
    },
    data: updatedUserDetails,
  });

  //
  return updatedUser;
};

//! get my profile ----------------------------------------------------------------------->>>
const getMyProfile = async (userId: string): Promise<IUsersResponse | null> => {
  const result = await prisma.user.findUnique({
    where: {
      userId,
    },
    omit: {
      password: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not Found !!");
  }

  return result;
};

// ! closeCustomerUserAccount
const closeCustomerUserAccount = async (userId: string): Promise<any> => {
  const userFind = await prisma.user.findUnique({
    where: {
      userId,
    },
  });

  if (!userFind) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not Found !!");
  }

  const result = await prisma.user.update({
    where: {
      userId: userFind.userId,
    },
    data: {
      userStatus: UserStatus.CLOSED,
    },
  });
  return result;
};

// ! --------------- exports Customer user service
export const CustomerUserService = {
  getAllUserService,
  getSingleCustomer,
  updateMyProfileInfo,
  getMyProfile,
  closeCustomerUserAccount,
};
