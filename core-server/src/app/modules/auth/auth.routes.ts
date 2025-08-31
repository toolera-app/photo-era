/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import validateRequest from "../../middlewares/validateRequest";
import passport from "passport";
import config from "../../../config";

const router = express.Router();

// ! customer signup
router.post("/customer-registration", validateRequest(AuthValidation.emailSignUp), AuthController.customerSignUp);

router.get(
  "/google-auth",
  (req: Request, res: Response, next: NextFunction): void => {
    const { registrationRole } = req.query;

    if (!["USER", "VENDOR"].includes(registrationRole as string)) {
      res.status(400).json({ error: "Invalid or missing role parameter" });
    }
    // @ts-ignore
    req.session.registrationRole = registrationRole;
    // @ts-ignore
    req.session.requested_frontend_url = req?.query?.app;
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

//
router.get(
  "/google-auth/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: false }, (err: any, user: any) => {
      if (err || !user) {
        return res.redirect(`${config.business_site_url}/authentication-failed`);
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  AuthController.googleAuth,
);

// Success route to confirm successful authentication
router.get("/success", (req, res) => {
  res.json({
    success: true,
    message: "Authentication Completed!",
  });
});

// ! customer Login
router.post("/customer-login", validateRequest(AuthValidation.emailLogin), AuthController.customerLogin);

// ! superadmin
router.post("/create-superadmin", validateRequest(AuthValidation.emailLogin), AuthController.superAdminSignUp);

router.post("/admin-dashboard-login", validateRequest(AuthValidation.emailLogin), AuthController.adminDashboardLogin);

export const AuthRoutes = router;
