import { CookieOptions, NextFunction, Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import { AuthService } from "./auth.service";

// ! ---Customer registration
const createCustomerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await AuthService.createCustomerService(req);
    const { accessToken, refreshToken } = response?.data || {};

    // set refresh token into cookie
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none" as const, // NOT "strict" for cross-site
      path: "/", // default, but OK to be explicit
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    const obj = {
      statusCode: response?.statusCode,
      success: response?.success,
      message: response?.message,
      data: {
        accessToken,
      },
    };
    sendResponse(res, obj);
  } catch (error) {
    next(error);
  }
};

// ! ---Customer registration with google
const createCustomerGoogleController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await AuthService.createCustomerGoogleService(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

// ! ---Customer registration with google
const getCustomerGoogleAuthController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await AuthService.getCustomerGoogleAuthService(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

// ! ---Customer registration with google
const customerAuthSuccessController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await AuthService.customerAuthSuccessService(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

// ! ---Customer login
const customerLoginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await AuthService.customerLoginService(req);
    const { accessToken, refreshToken } = response?.data || {};

    // Detect HTTPS
    const isSecure = req.secure || req.headers["x-forwarded-proto"] === "https";

    // Explicit CookieOptions type to satisfy TS
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isSecure,
      sameSite: (isSecure ? "none" : "lax") as CookieOptions["sameSite"], // ✅ type-safe
      path: "/",
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    const obj = {
      statusCode: response?.statusCode,
      success: response?.success,
      message: response?.message,
      data: { accessToken },
    };
    sendResponse(res, obj);
  } catch (error) {
    next(error);
  }
};
// ! ---Vendor registration
const vendorRegistration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await AuthService.vendorRegistration(req);
    const { accessToken, refreshToken } = response?.data || {};

    // Detect HTTPS
    const isSecure = req.secure || req.headers["x-forwarded-proto"] === "https";

    // set refresh token into cookie
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isSecure,
      sameSite: (isSecure ? "none" : "lax") as CookieOptions["sameSite"], // ✅ type-safe
      path: "/",
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    const obj = {
      statusCode: response?.statusCode,
      success: response?.success,
      message: response?.message,
      data: {
        accessToken,
      },
    };
    sendResponse(res, obj);
  } catch (error) {
    next(error);
  }
};

// ! ---Vendor login
const vendorLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await AuthService.vendorLoginService(req);
    const { accessToken, refreshToken } = response?.data || {};

    // Detect HTTPS
    const isSecure = req.secure || req.headers["x-forwarded-proto"] === "https";

    // set refresh token into cookie
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isSecure,
      sameSite: (isSecure ? "none" : "lax") as CookieOptions["sameSite"], // ✅ type-safe
      path: "/",
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    const obj = {
      statusCode: response?.statusCode,
      success: response?.success,
      message: response?.message,
      data: {
        accessToken,
      },
    };
    sendResponse(res, obj);
  } catch (error) {
    next(error);
  }
};

// ! check vendor exist  (VENDOR) =================
const checkUserExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await AuthService.checkUserExist(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

// ! create super admin (SUPER ADMIN) =================
const createSuperAdminController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await AuthService.createSuperAdminService(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

// ! admin dashboard login
const adminDashboardLoginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await AuthService.adminDashboardLoginService(req);
    const { accessToken, refreshToken } = response?.data || {};

    // Detect HTTPS
    const isSecure = req.secure || req.headers["x-forwarded-proto"] === "https";

    // set refresh token into cookie
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isSecure,
      sameSite: (isSecure ? "none" : "lax") as CookieOptions["sameSite"], // ✅ type-safe
      path: "/",
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    const obj = {
      statusCode: response?.statusCode,
      success: response?.success,
      message: response?.message,
      data: {
        accessToken,
      },
    };

    sendResponse(res, obj); // Sends the login response back to the client
  } catch (error) {
    next(error); // Passes the error to the next middleware for error handling
  }
};

export const AuthController = {
  createCustomerController,
  createCustomerGoogleController,
  getCustomerGoogleAuthController,
  customerAuthSuccessController,
  customerLoginController,
  //
  vendorRegistration,
  vendorLogin,
  checkUserExist,
  //
  createSuperAdminController,
  adminDashboardLoginController,
  //
};
