import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import config from "../../../config";
import { CustomerAuthService } from "./customers/auth.customer.service";
import { AdminAuthService } from "./admins/auth.admin.service";
import { errorLogger } from "../../../shared/logger";

//! customer sign up

const customerSignUp = catchAsync(async (req: Request, res: Response) => {
  const result = await CustomerAuthService.customerSignUp(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Successfully Registered!",
    data: result,
  });
});

// ! customer google auth
// const googleAuth = catchAsync(async (req: Request, res: Response) => {
//   const { token } = req.user as { token: { refreshToken: string; accessToken: string } };

//   // Set the refresh token as a secure cookie
//   res.cookie("refreshToken", token.refreshToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict" as const,
//     path: "/",
//   });
//   // Redirect with the accessToken in the URL
//   const redirectUrl = `${config.frontend_url}/auth-success?accessToken=${token?.accessToken}`;
//   res.redirect(redirectUrl);
// });

// export const googleAuth = async (req: Request, res: Response) => {
//   try {
//     if (!req.user) {
//       return res.redirect(`${config.business_site_url}/authentication-failed`);
//     }

//     // Extract token from `req.user`
//     const { token } = req.user as { token: { refreshToken: string; accessToken: string } };

//     // Set refresh token in a secure HTTP-only cookie
//     res.cookie("refreshToken", token.refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict" as const,
//     });

//     // Redirect with the accessToken in the URL
//     const redirectUrl = `${config.business_site_url}/auth-success?accessToken=${token?.accessToken}`;

//     res.redirect(redirectUrl);
//   } catch (error) {
//     console.error("Google Authentication Error:", error);
//     res.redirect(`${config.business_site_url}/authentication-failed`);
//   }
// };

// config/redirectUrls.ts
export const redirectUrls = {
  businessSiteRedirectUrl: (accessToken: string) => `${config.business_site_url}/auth-success?accessToken=${encodeURIComponent(accessToken)}`,
  vendorDashboardRedirectUrl: (accessToken: string) => `${config.vendor_dashboard_site_url}/auth-success?accessToken=${encodeURIComponent(accessToken)}`,
  authenticationFailed: (app: string) => {
    const appUrls: any = {
      BUSINESS_SITE: config.business_site_url,
      VENDOR_DASHBOARD_SITE: config.vendor_dashboard_site_url,
    };
    return `${appUrls[app] || config.business_site_url}/authentication-failed`;
  },
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { user } = req;

    if (!user) {
      // Redirect to the appropriate failure page based on the frontend app
      return res.redirect(`/authentication-failed`);
    }

    // Extract token and set the refresh token in a secure HTTP-only cookie
    const { token, requested_frontend_url } = user as { token: { refreshToken: string; accessToken: string }; requested_frontend_url: string };

    res.cookie("refreshToken", token.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none" as const, // NOT "strict" for cross-site
      path: "/", // default, but OK to be explicit
    });

    // Redirect to the correct app with the access token
    const redirectUrl = requested_frontend_url === "VENDOR_DASHBOARD_SITE" ? redirectUrls.vendorDashboardRedirectUrl(token?.accessToken) : redirectUrls.businessSiteRedirectUrl(token?.accessToken);

    return res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google Authentication Error:", error);
    // Default to the business site failure page in case of error

    return res.redirect(`/authentication-failed`);
  }
};

//! customer Login
const customerLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await CustomerAuthService.customerLogin(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully Logged In!",
    data: result,
  });
});

// // ! vendor google auth
// const vendorGoogleAuth = catchAsync(async (req: Request, res: Response) => {
//   const { token } = req.user as { token: { refreshToken: string; accessToken: string } };

//   // Set the refresh token as a secure cookie
//   res.cookie("refreshToken", token.refreshToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict" as const,
//     path: "/",
//   });

//   // Redirect with the accessToken in the URL
//   const redirectUrl = `${config.vendor_dashboard_site_url}/auth-success?accessToken=${token?.accessToken}`;
//   res.redirect(redirectUrl);
// });

// ! ========================================================== (Dashboard)
//! customer sign up

const superAdminSignUp = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminAuthService.SuperAdminSignUp(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully Registered!",
    data: result,
  });
});
// ! admin dashboard login
const adminDashboardLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminAuthService.adminDashboardLogin(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully Logged In!",
    data: result,
  });
});

const myProfileDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await CustomerAuthService.myProfileDetails(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully fetched profile details!",
    data: result,
  });
});

export const AuthController = {
  customerSignUp,
  googleAuth,
  customerLogin,
  myProfileDetails,

  // vendorGoogleAuth,
  superAdminSignUp,
  adminDashboardLogin,
};
