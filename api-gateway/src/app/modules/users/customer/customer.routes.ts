import express from "express";
import { CustomerUserController } from "./customer.controller";
import { awsFileUploadHelper } from "../../../../helpers/aws_file_uploader/awsFileUploadStorage";

const router = express.Router();

// !  get all Customers ------------------------------>>>
router.get("/get-all-customers", CustomerUserController.getAllCustomers);

// !  get My Profile ------------------------------>>>
router.get("/my-profile", CustomerUserController.getMyProfile);

// !  Update  my profile ------------------------------>>>
router.patch("/update-my-profile", awsFileUploadHelper.uploadUserImages, CustomerUserController.updateMyProfileInfo);

// !  get single user ------------------------------>>>
router.get("/get-customer-details/:userId", CustomerUserController.getCustomerDetails);

export const CustomerUserRoutes = router;
