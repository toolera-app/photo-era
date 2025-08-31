import jwt, { JwtPayload } from "jsonwebtoken";
import ApiError from "../errors/ApiError";

// Create JWT Token with error handling
//@ts-ignore
const createToken = (payload: Record<any, unknown>, secret: any, expireTime: any): any => {
  try {
    if (!secret || !expireTime) {
      throw new ApiError(500, "Missing JWT secret or expiration time");
    }
    
    //@ts-ignore
    const options: jwt.SignOptions = { expiresIn: expireTime || "1h" };


    return jwt.sign(payload, secret, options);
  } catch (error: any) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(500, `JWT Creation Failed: ${error.message}`);
    }
    throw new ApiError(500, `Unexpected error during JWT creation: ${error.message}`);
  }
};

// Verify JWT Token with error handling
//@ts-ignore
const verifyToken = (token: string, secret: string): JwtPayload => {
  try {
    if (!token || !secret) {
      throw new ApiError(400, "Token or secret is missing");
    }
    //@ts-ignore
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error: any) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, `JWT Verification Failed: ${error.message}`);
    }
    throw new ApiError(500, `Unexpected error during JWT verification: ${error.message}`);
  }
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
