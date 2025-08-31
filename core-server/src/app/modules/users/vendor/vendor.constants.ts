import { VendorProfileStatus } from "@prisma/client";

export const VendorFilterableFields: string[] = ["searchTerm", "eventCategory"];
export const VendorSearchableFields: string[] = [
  "email",
  "userName",
  "firstName",
  "lastName",
  "displayName",
  "personalPhoneNumber",
  "address",
  //
  "businessName",
  "businessEmail",
  "businessPhoneNumber",
  "businessAddress",
  "businessDescription",
];

export const VendorRelationalFields: string[] = ["eventCategory"];

export const VendorRelationalFieldsMapper: { [key: string]: string } = {
  eventCategory: "eventCategoryName",
};

export const ZodVendorProfileStatus: Partial<VendorProfileStatus[]> = ["ACTIVE", "PENDING", "SUSPENDED", "TEMPORARY_BAN", "DEACTIVATED", "BLACKLISTED", "CLOSED", "REJECTED"];
