import { z } from "zod";

const addOrder = z.object({
  body: z.object({
    paymentNumber: z.string().min(11).max(100),
    amount: z.number().min(0),
    transactionId: z.string().min(5).max(100),
    reference: z.string().min(0).max(200).optional(),
  }),
});

const updateOrder = z.object({
  body: z.object({
    paymentNumber: z.string().min(11).max(100).optional(),
    amount: z.number().min(0).optional(),
    transactionId: z.string().min(5).max(100).optional(),
    reference: z.string().min(0).max(200).optional(),
  }),
});

export const orderValidation = {
  addOrder,
  updateOrder,
};
