import { UserRole } from "@prisma/client";

export type IRequestUser = {
  role: UserRole;
  userId: string;
  email: string;
  userRole: UserRole;
  name: string;
  iat: number;
  exp: number;
};
