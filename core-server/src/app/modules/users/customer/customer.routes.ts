import express from "express";
import auth from "../../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { CustomerUserController } from "./customer.controller";
import { CustomerValidation } from "./customer.validations";
import validateRequest from "../../../middlewares/validateRequest";

const router = express.Router();

// !  get all Customers ------------------------------>>>
router.get("/get-all-customers", auth(UserRole.SUPERADMIN), CustomerUserController.getAllCustomers);

// !  get My Profile ------------------------------>>>
router.get("/my-profile", auth(UserRole.USER), CustomerUserController.getMyProfile);

//! close a customer
router.patch("/close-customer-account/:userId", auth(UserRole.SUPERADMIN), CustomerUserController.closeCustomerUserAccount);

// !  Update  my profile ------------------------------>>>
router.patch("/update-my-profile", auth(UserRole.USER), validateRequest(CustomerValidation.updateMyProfile), CustomerUserController.updateMyProfileInfo);

// !  get single user ------------------------------>>>
router.get("/get-customer-details/:userId", auth(UserRole.SUPERADMIN), CustomerUserController.getCustomerDetails);

export const CustomerUserRoutes = router;
