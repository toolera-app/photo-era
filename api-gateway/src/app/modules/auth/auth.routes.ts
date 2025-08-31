import express from "express";
import { AuthController } from "./auth.controller";
import { awsFileUploadHelper } from "../../../helpers/aws_file_uploader/awsFileUploadStorage";

const router = express.Router();

// ! ---Customer registration
router.post("/customer-registration", AuthController.createCustomerController);

// router.get("/google-auth", AuthController.createCustomerGoogleController);

// router.get("/google-auth/callback", AuthController.getCustomerGoogleAuthController);

// ! ---Customer registration with google
router.get("/success", AuthController.customerAuthSuccessController);

// ! ---Customer login
router.post("/customer-login", AuthController.customerLoginController);

// !vendor auth generate ---------
router.post("/check-user-exist", AuthController.checkUserExist);

// ! vendor login
router.post("/vendor-login", AuthController.vendorLogin);

// ! vendor registration
router.post("/vendor-registration", awsFileUploadHelper.uploadVendorUserImages, AuthController.vendorRegistration);

// ! create super admin
router.post("/create-superadmin", AuthController.createSuperAdminController);

// ! admin dashboard login
router.post("/admin-dashboard-login", AuthController.adminDashboardLoginController);

export const authRoutes = router;
