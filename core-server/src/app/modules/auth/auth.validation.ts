/* eslint-disable no-useless-escape */
import { z } from "zod";

const createUser = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
    name: z.string().min(1, { message: "First name is required" }),
    role: z.enum(["USER"]).or(z.string().refine((value) => ["USER"].includes(value))),
  }),
});
const emailSignUp = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1).max(40),
    name: z.string().min(1).max(100),
  }),
});

const emailLogin = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1).max(40),
  }),
});

export const AuthValidation = {
  createUser,
  emailSignUp,
  //
  emailLogin,
};
