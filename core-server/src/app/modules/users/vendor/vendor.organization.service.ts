/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BusinessType, Prisma, UserRole, UserStatus, VendorProfile } from "@prisma/client";
import bcrypt from "bcrypt";
import { IUpdateVendorMyProfileReq, IOrganizerSetupReq } from "./vendor.interface";
import { calculateProfileScore, getFilePathsByOriginalName } from "./vendor.utils";
import prisma from "../../../../shared/prisma";
import ApiError from "../../../../errors/ApiError";
import config from "../../../../config";
import httpStatus from "http-status";
import { Request } from "express";
import { IUploadFile } from "../../../../interfaces/file";
import { generateBusinessUserName } from "../../auth/auth.utils";

// ! Check Unique Organization Name
// ! Check Unique Organization Name
const checkUniqueOrganizationName = async (businessName: string): Promise<any> => {
  const isExistBusinessName = await prisma.vendorProfile.findFirst({
    where: {
      businessName: {
        equals: businessName,
        mode: "insensitive", // Case-insensitive comparison
      },
    },
  });

  if (isExistBusinessName) {
    throw new ApiError(httpStatus.CONFLICT, `This name is already used. Try a new one`);
  }

  return {
    message: "This name is available",
  };
};

//

// ! --------------- exports
export const VendorOrganizationService = { checkUniqueOrganizationName };
