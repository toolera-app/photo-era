import { Request } from "express";

export const getAuthHeaderDetails = (req: Request) => ({
  Authorization: req.headers.authorization || "",
});
