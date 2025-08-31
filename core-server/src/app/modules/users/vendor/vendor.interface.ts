/* eslint-disable @typescript-eslint/no-explicit-any */

import { BusinessType, GenderName, UserStatus, VendorProfileStatus } from "@prisma/client";
import { InputJsonArray } from "@prisma/client/runtime/library";

export type IVendorFilterRequest = {
  searchTerm?: string | undefined;
  eventCategory?: string | undefined;
};

export type IUpdateUserRequest = {
  email?: string | undefined;
  userStatus?: UserStatus | undefined;
  password?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
};

export type UserProfile = {
  profileId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profileImage: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type IUsersResponse = {
  userId: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  profile?: any | null;
  userStatus: UserStatus | null;
};

export type IUpdateVendorMyProfileReq = {
  firstName?: string;
  lastName?: string;
  registeredEmail?: string;
  newPassword?: string;
  personalPhoneNumber?: string;
  dateOfBirth?: string;
  gender?: GenderName;
  businessType?: BusinessType;
  businessName: string;
  personalEmail?: string;
  businessEmail?: string;
  emergencyBusinessEmail?: string;
  businessPhoneNumber?: string;
  businessRegistrationNumber?: string;
  businessDescription?: string;
  addressOnMap?: string;
  logoImageName?: string;
  coverPhotoName?: string;
  logoImage?: string;
  coverPhoto?: string;
  businessUserName?: string;
  //
  files: any[];
};
export type IUserUpdateReqAndResponse = {
  fullName?: string;
  email?: string;
  password?: string;
};

//  organization
export type IOrganizerSetupReq = {
  businessType?: BusinessType;
  personalPhoneNumber?: string;
  dateOfBirth?: string;
  gender?: GenderName;
  businessName: string;
  personalEmail?: string;
  businessEmail?: string;
  emergencyBusinessEmail?: string;
  businessPhoneNumber?: string;
  businessPhoneNumberCountryCode?: string;
  businessRegistrationNumber?: string;
  businessDescription?: string;
  businessAddress?: string;
  logoImageName?: string;
  coverPhotoName?: string;
  logoImage?: string;
  coverPhoto?: string;
  //
  businessUserName?: string;
  //
  files: string[];
};

export type IUpdateVendorProfileStatus = {
  vendorProfileStatus: VendorProfileStatus;
  reasonForChangeStatus?: any;
};
