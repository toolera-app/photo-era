import { UserRole } from "@prisma/client";

export type IUserCreate = {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
};

export type IUserResponse = {
  userId: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IUserLogin = {
  email: string;
  password: string;
};
export type ILoginUserResponse = {
  accessToken: string;
  refreshToken: string;
};
export type IRefreshTokenResponse = {
  accessToken: string;
};

// !
export type IJwtTokenCreationDetails = {
  userId: string;
  role: UserRole;
  email: string;
};

//

export type IGoogleLoginProfileDetails = {
  authId: string; // Google unique user ID
  displayName: string; // User's full name
  firstName: string;
  lastName: string;
  email: string | undefined;
  profileImage: string | undefined; // URL to user's profile picture
  emailVerified: boolean | undefined; // Boolean to indicate if the email is verified
  loginProvider: string;
};
