import express, { NextFunction, Request, Response } from "express";
import auth from "../../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { VendorUserController } from "./vendor.controller";
import { VendorValidation } from "./vendor.validations";
import validateRequest from "../../../middlewares/validateRequest";

const router = express.Router();

// !  get all Vendors ------------------------------>>>
router.get("/get-all-vendors", auth(UserRole.ADMIN, UserRole.SUPERADMIN), VendorUserController.getAllVendorUsers);

// !  get all event organizers ------------------------------>>>
router.get("/get-all-organizers", VendorUserController.getAllOrganizers);

// !  get single event organizer details ------------------------------>>>
router.get("/organizer-details/:userName", VendorUserController.getEventOrganizerDetails);

// !  get My Profile ------------------------------>>>
router.get("/my-profile", auth(UserRole.VENDOR), VendorUserController.getMyProfile);

// !  Update  my profile ------------------------------>>>
router.patch("/update-my-profile", auth(UserRole.VENDOR), validateRequest(VendorValidation.updateMyProfile), VendorUserController.updateMyProfileInfo);

//  ! update profile status
router.post("/update-profile-status/:userId", auth(UserRole.ADMIN, UserRole.SUPERADMIN), validateRequest(VendorValidation.updateVendorProfileStatus), VendorUserController.updateVendorProfileStatus);
// !  Check Unique Business Name ------------------------------>>> (VENDOR DASHBOARD)
router.get("/check-unique-business-name/:searchTerm", VendorUserController.checkUniqueOrganizationName);

// !  get single user ------------------------------>>> (ADMIN)
router.get("/get-vendor-details/:slug", auth(UserRole.SUPERADMIN), VendorUserController.getVendorDetails);

//! close a vendor data
router.patch("/close-vendor-account/:userId", auth(UserRole.SUPERADMIN), VendorUserController.closeVendorUserAccount);

export const VendorUserRoutes = router;
