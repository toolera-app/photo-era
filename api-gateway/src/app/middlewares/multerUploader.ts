/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Express } from "express";
import multer from "multer";

export const createMulterUploader = (allowedTypes: string[], maxSizeMB: number) => {
  const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  };

  return multer({
    storage: multer.memoryStorage(), // <- here
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
    fileFilter,
  });
};
