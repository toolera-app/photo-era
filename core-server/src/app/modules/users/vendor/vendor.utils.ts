/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { IUpdateProfileReqAndResponse } from "../customer/customer.interface";

type UpdateValueType = string | number | boolean;

type UpdateDataObject = {
  [dataName: string]: UpdateValueType | undefined | null;
};

export const updateMyProfileDataValue = (updates: UpdateDataObject): Partial<IUpdateProfileReqAndResponse> => {
  const filteredUpdates: Partial<IUpdateProfileReqAndResponse> = Object.entries(updates)
    .filter(([_, value]) => value !== undefined && value !== null && value !== "") // Updated filter condition
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  return filteredUpdates;
};

//

export const getFilePathsByOriginalName = (files: string[], logoImageName?: string, coverPhotoName?: string): { logoImagePath?: string; coverPhotoPath?: string } => {
  const extractBaseName = (urlKey: string): string | undefined => {
    const filename = urlKey.split("/").pop(); // get "timestamp---name.ext"
    const withOrWithoutTimestamp = filename?.split("---")[1] || filename;
    return withOrWithoutTimestamp?.split(".")[0];
  };

  const cleanInputName = (name?: string) => name?.split(".")[0];

  const logoImagePath = logoImageName ? files.find((file) => extractBaseName(file) === cleanInputName(logoImageName)) : undefined;

  const coverPhotoPath = coverPhotoName ? files.find((file) => extractBaseName(file) === cleanInputName(coverPhotoName)) : undefined;

  return {
    logoImagePath,
    coverPhotoPath,
  };
};

// ! update profile score
// personal 30,
// business 40
// media 30
interface ProfileData {
  [key: string]: any;
}

const SECTIONS = [
  {
    name: "personal",
    fields: ["firstName", "lastName", "personalPhoneNumber", "dateOfBirth", "nationality", "profileImage", "address", "IDNumber"],
    weight: 15,
  },
  {
    name: "business",
    fields: [
      "businessType",
      "businessName",
      "businessUserName",
      "businessEmail",
      "businessPhoneNumber",
      "businessRegistrationNumber",
      "businessDescription",
      "emergencyBusinessEmail",
      "businessAddress",
      "bankAccountNumber",
      "bankAccountHolderName",
    ],
    weight: 55,
  },
  {
    name: "media",
    fields: ["logoImage", "coverPhoto"],
    weight: 20,
  },
  {
    name: "socialMedia",
    fields: ["socialMediaLinks"],
    weight: 10,
  },
];

/**
 * Calculates the profile completion score based on predefined sections.
 * @param {ProfileData} profileData - The profile data object.
 * @returns {number} - The calculated profile score (0 - 100).
 */
export const calculateProfileScore = (profileData: ProfileData): number => {
  let totalScore = 0;

  SECTIONS.forEach(({ fields, weight }) => {
    const completedFields = fields.filter((field) => {
      const value = profileData[field] ?? profileData.vendorProfile?.[field] ?? profileData.user?.[field];

      if (typeof value === "string") {
        return value.trim() !== "";
      }

      return value !== null && value !== undefined;
    }).length;

    const completionRatio = completedFields / fields.length;
    totalScore += completionRatio * weight;
  });

  return Math.min(Math.round(totalScore), 100);
};
