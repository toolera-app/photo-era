import express from "express";
import { AuthController } from "./auth.controller";

const router = express.Router();

// ! ---Customer registration
router.post("/customer-registration", AuthController.createCustomerController);

// router.get("/google-auth", AuthController.createCustomerGoogleController);

// router.get("/google-auth/callback", AuthController.getCustomerGoogleAuthController);

// ! ---Customer registration with google
router.get("/success", AuthController.customerAuthSuccessController);

// ! ---Customer login
router.post("/customer-login", AuthController.customerLoginController);

router.get("/my-profile", AuthController.myProfileView);

// !vendor auth generate ---------
router.post("/check-user-exist", AuthController.checkUserExist);

// ! create super admin
router.post("/create-superadmin", AuthController.createSuperAdminController);

// ! admin dashboard login
router.post("/admin-dashboard-login", AuthController.adminDashboardLoginController);

export const authRoutes = router;
