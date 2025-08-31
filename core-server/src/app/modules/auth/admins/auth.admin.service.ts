/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { UserRole } from "@prisma/client";
import { ILoginUserResponse, IUserCreate } from "../auth.interface";
import ApiError from "../../../../errors/ApiError";
import prisma from "../../../../shared/prisma";
import config from "../../../../config";
import { createJWTTokens } from "../auth.utils";

// ! SuperAdminSignUp email registration
const SuperAdminSignUp = async (data: IUserCreate): Promise<any> => {
  const { password, email, name } = data;

  // hash password
  const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

  // transaction start
  const newUser = await prisma.$transaction(async (tx) => {
    // 1) email must be unique
    const existingByEmail = await tx.user.findUnique({
      where: { email },
      select: { userId: true },
    });
    if (existingByEmail) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Email Already Used!");
    }

    // 2) only one ADMIN allowed (since you're treating this as 'super admin')
    const existingAdmin = await tx.user.findFirst({
      where: { role: UserRole.ADMIN },
      select: { userId: true },
    });
    if (existingAdmin) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Superadmin Already Exist!");
    }

    // 4) create user
    const createdUser = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: UserRole.ADMIN,
      },
      select: {
        userId: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return createdUser;
  });

  if (!newUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User creation failed");
  }

  const details = {
    role: newUser.role,
    email: newUser.email,
  };

  return details;
};

// ! admin email login
const adminDashboardLogin = async (data: IUserCreate): Promise<ILoginUserResponse> => {
  const { password, email } = data;

  // findUnique can only use unique fields; filter by email then check role
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      email: true,
      role: true,
      password: true,
      userId: true,
    },
  });

  // not found OR not an admin -> deny
  if (!user || user.role !== UserRole.ADMIN) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Access Denied: You do not have the necessary permissions to log in to the admin dashboard.");
  }

  // password check
  const isPasswordValid = await bcrypt.compare(password, (user.password || "") as string);

  if (!isPasswordValid) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password is incorrect !!");
  }

  // token payload aligned to schema
  const details = {
    email: user.email,
    role: user.role,
    userId: user.userId,
  };

  const newToken = createJWTTokens(details as any);
  return newToken;
};

export const AdminAuthService = {
  SuperAdminSignUp,
  adminDashboardLogin,
};
