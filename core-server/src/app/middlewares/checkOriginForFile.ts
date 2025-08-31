import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

// Define allowed origins or referer
const allowedOrigins = ["http://localhost:5000"];
const allowedReferer = ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"]; // Modify with the valid referer URLs

// Middleware to check if the origin or referer is allowed
const checkOriginForFile = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  const referer = req.headers.referer;

  // Check if the origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    return next();
  }

  // If origin is not present, check the referer
  if (referer && allowedReferer.some((allowedReferer) => referer.startsWith(allowedReferer))) {
    return next();
  }

  // If neither origin nor referer is allowed, respond with 405 Forbidden
  res.status(httpStatus.METHOD_NOT_ALLOWED).json({
    success: false,
    message: "Forbidden: Invalid origin or referer",
    errorMessages: [
      {
        path: req.originalUrl,
        message: `The origin or referer '${origin || referer}' is not allowed.`,
      },
    ],
  });
};

export default checkOriginForFile;
