import { z } from "zod";

const updateMyProfile = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string({}).optional(),
    password: z.string({}).optional(),
    phoneNumber: z.string({}).optional(),
    bio: z.string({}).optional(),
    dateOfBirth: z.string({}).optional(),
    gender: z.string({}).optional(),
    nationality: z.string({}).optional(),
  }),
});

const updateUser = z.object({
  body: z.object({
    email: z.string({}).optional(),
    password: z.string({}).optional(),
    role: z.string({}).optional(),
    userStatus: z.string({}).optional(),
    firstName: z.string({}).optional(),
    lastName: z.string({}).optional(),
  }),
});

export const CustomerValidation = {
  updateMyProfile,
  updateUser,
};
