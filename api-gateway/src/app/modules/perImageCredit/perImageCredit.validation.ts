import { z } from "zod";

const addAdvertisements = z.object({
  advertisementStartDate: z.string().optional(),
  advertisementEndDate: z.string().optional(),
  promotionTypeId: z.string().optional(),
});
const editAdvertisements = z.object({
  advertisementImage: z.string().optional(),
  advertisementStartDate: z.string().optional(),
  advertisementEndDate: z.string().optional(),
  promotionTypeId: z.string().optional(),
});

export const advertisementValidation = {
  addAdvertisements,
  editAdvertisements,
};
