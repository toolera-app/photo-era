//Generate Password

import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import { IJwtTokenCreationDetails } from "./auth.interface";

export const generatePassword = () => {
  const length = 8;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

// ! create jwt token

export const createJWTTokens = (details: IJwtTokenCreationDetails) => {
  const accessToken = jwtHelpers.createToken(
    {
      userId: details?.userId,
      role: details?.role,
      profileId: details?.profileId,
      email: details.email,
    },
    config.jwt.secret as string,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    {
      userId: details?.userId,
      role: details?.role,
      profileId: details?.profileId,
      email: details.email,
    },
    config.jwt.refresh_secret as string,
    config.jwt.refresh_expires_in as string,
  );
  return { accessToken, refreshToken };
};

// ! generate otp code
export const generateSixDigitOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
