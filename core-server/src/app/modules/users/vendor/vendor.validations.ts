import { z } from "zod";
import { ZodVendorProfileStatus } from "./vendor.constants";

const updateMyProfile = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    //
    registeredEmail: z.string({}).optional(),
    newPassword: z.string({}).optional(),
    personalPhoneNumber: z.string({}).optional(),
    businessAddress: z.string({}).optional(),
    dateOfBirth: z.string({}).optional(),
    businessType: z.string({}).optional(),
    businessName: z.string({}).optional(),
    personalEmail: z.string({}).optional(),
    businessEmail: z.string({}).optional(),
    emergencyBusinessEmail: z.string({}).optional(),
    businessPhoneNumber: z.string({}).optional(),
    addressOnMap: z.string({}).optional(),
    businessRegistrationNumber: z.string({}).optional(),
    businessDescription: z.string({}).optional(),
    logoImageName: z.string({}).optional(),
    coverPhotoName: z.string({}).optional(),
    socialMediaLinks: z
      .object({
        facebookLink: z.string({}).optional(),
        twitterLink: z.string({}).optional(),
        instagramLink: z.string({}).optional(),
        linkedinLink: z.string({}).optional(),
        youtubeLink: z.string({}).optional(),
        tiktokLink: z.string({}).optional(),
      })
      .optional(),
    files: z.any().optional(),
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
//

const setupOrganizationProfile = z.object({
  businessAddress: z.string({}),
  businessType: z.string({}),
  businessName: z.string({}),
  businessEmail: z.string({}),
  emergencyBusinessEmail: z.string({}).optional(),
  businessPhoneNumber: z.string().min(4).max(15).regex(/^\d+$/, "Invalid phone number"),
  businessPhoneNumberCountryCode: z
    .string()
    .min(1)
    .max(5)
    .regex(/^\+\d+$/, "Invalid country code"),
  addressOnMap: z.string({}).optional(),
  businessRegistrationNumber: z.string({}).optional(),
  businessDescription: z.string({}),
  logoImageName: z.string({}),
  coverPhotoName: z.string({}),
  socialMediaLinks: z
    .object({
      facebookLink: z.string({}).optional(),
      twitterLink: z.string({}).optional(),
      instagramLink: z.string({}).optional(),
      linkedinLink: z.string({}).optional(),
      youtubeLink: z.string({}).optional(),
      tiktokLink: z.string({}).optional(),
    })
    .optional(),
});

const updateVendorProfileStatus = z.object({
  body: z.object({
    vendorProfileStatus: z.enum([...ZodVendorProfileStatus] as [string, ...string[]]),
    reasonForChangeStatus: z.string().optional(),
  }),
});

export const VendorValidation = {
  updateMyProfile,
  updateUser,
  setupOrganizationProfile,
  updateVendorProfileStatus,
};
