/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { IGoogleLoginProfileDetails, ILoginUserResponse, IUserCreate } from "../auth.interface";
import prisma from "../../../../shared/prisma";
import ApiError from "../../../../errors/ApiError";
import config from "../../../../config";
import { createJWTTokens } from "../auth.utils";
import { UserRole } from "@prisma/client";

// ! customer email registration
const customerSignUp = async (data: IUserCreate): Promise<ILoginUserResponse> => {
  const { password, email, name } = data;

  const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

  // One transaction: create user → create zero-credit balance tied to that userId
  const newUser = await prisma.$transaction(async (tx) => {
    const isUserExist = await tx.user.findUnique({ where: { email } });
    if (isUserExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email is already in use");
    }

    const createdUser = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || undefined,
      },
      select: {
        userId: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Create initial credit balance (0) linked by userId (unique)
    await tx.creditBalance.create({
      data: {
        userId: createdUser.userId,
        creditBalance: 0,
      },
    });

    return createdUser;
  });

  if (!newUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User creation failed");
  }

  const details = {
    userId: newUser.userId,
    role: newUser.role,
    email: newUser.email,
  };

  return createJWTTokens(details);
};

// ! find customer user by id
const getSingleCustomerUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { userId: id },
  });
  return user;
};

// ! customer email login
const customerLogin = async (data: IUserCreate): Promise<ILoginUserResponse> => {
  const { password, email } = data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      email: true,
      userId: true,
      role: true,
      password: true,
    },
  });

  if (!user || user.role !== UserRole.USER) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!!");
  }

  // If the account has no password (e.g., created via Google), prompt to set/reset it
  if (!user.password) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No password set for this account. Please use 'Forgot Password' to set one.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password as any);
  if (!isPasswordValid) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password is incorrect !!");
  }

  const details = {
    userId: user.userId,
    role: user.role,
    email: user.email,
  };

  return createJWTTokens(details);
};

export const CustomerAuthService = {
  customerSignUp,
  getSingleCustomerUser,
  customerLogin,
};
