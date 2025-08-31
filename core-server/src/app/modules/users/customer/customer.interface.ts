/* eslint-disable @typescript-eslint/no-explicit-any */

import { GenderName, UserRole, UserStatus } from "@prisma/client";

export type IUserFilterRequest = {
  searchTerm?: string | undefined;
};

export type IUpdateUserRequest = {
  email?: string | undefined;
  userStatus?: UserStatus | undefined;
  password?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
};

export type UserProfile = {
  profileId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profileImage: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type IUsersResponse = {
  userId: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  userStatus: UserStatus | null;
};

export type IUpdateProfileReqAndResponse = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: GenderName;
};

export type IUserUpdateReqAndResponse = {
  fullName?: string;
  email?: string;
  password?: string;
};
