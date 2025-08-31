import { z } from "zod";

const updateMyProfile = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string({}).optional(),
  password: z.string({}).optional(),
  phoneNumber: z.string({}).optional(),
  bio: z.string({}).optional(),
  dateOfBirth: z.string({}).optional(),
  gender: z.string({}).optional(),
  nationality: z.string({}).optional(),
});
export const CustomerValidation = {
  updateMyProfile,
};
