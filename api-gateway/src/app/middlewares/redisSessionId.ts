/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

interface CustomRequest extends Request {
  sessionID?: string;
}

export const sessionMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  const sessionCookie = req.cookies.session_id;

  if (!sessionCookie) {
    const newSessionID = uuidv4();
    res.cookie("session_id", newSessionID, {
      httpOnly: true,
      secure: false, // Set true in production with HTTPS
    });
    req.sessionID = newSessionID;
  } else {
    req.sessionID = sessionCookie;
  }

  next();
};
