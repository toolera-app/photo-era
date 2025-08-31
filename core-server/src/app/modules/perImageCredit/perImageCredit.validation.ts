import { z } from "zod";

const addPerImageCredit = z.object({
  body: z.object({
    creditCharged: z.number().min(0),
  }),
});

const editPerImageCredit = z.object({
  body: z.object({
    creditCharged: z.number().min(0).optional(),
  }),
});

export const perImageCreditValidation = {
  addPerImageCredit,
  editPerImageCredit,
};
