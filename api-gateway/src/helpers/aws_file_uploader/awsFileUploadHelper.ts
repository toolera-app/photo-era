/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  // ListObjectsV2Command,
  // DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextFunction, Request, Response, Express } from "express";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import sharp from "sharp";
import path from "path";
import config from "../../config";

// ! aws
const s3Client = new S3Client({
  region: config.aws.AWS_REGION,
  credentials: {
    accessKeyId: config.aws.AWS_ACCESS_KEY,
    secretAccessKey: config.aws.AWS_SECRET_KEY,
  },
});

// !

type UploadedFile = string;
// ! aws processor

export const uploadToS3 = async (
  fileOrFiles: Express.Multer.File | Express.Multer.File[],
  folder: string,
): Promise<UploadedFile | UploadedFile[]> => {
  if (!fileOrFiles || (Array.isArray(fileOrFiles) && fileOrFiles.length === 0)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No Image(s) Uploaded");
  }

  const uploadSingleFile = async (file: Express.Multer.File): Promise<UploadedFile> => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext);
    const finalFileName = `${timestamp}---${baseName}${ext}`;

    // const compressedImageBuffer = await sharp(file.buffer).jpeg({ quality: 60 }).toBuffer();
    let buffer = file.buffer;
    try {
      buffer = await sharp(file.buffer)
        .toFormat(ext.replace(".", "") as any, { quality: 60 })
        .toBuffer();
    } catch {
      // fallback silently if sharp fails
    }
    const urlKey = `uploads/${folder}/${finalFileName}`;

    const uploadParams = {
      Bucket: config.aws.AWS_BUCKET_NAME,
      Key: urlKey,
      Body: buffer,
      ContentType: file.mimetype,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    return urlKey;
  };

  if (Array.isArray(fileOrFiles)) {
    const uploadedFiles = await Promise.all(fileOrFiles.map(uploadSingleFile));
    return uploadedFiles;
  } else {
    return await uploadSingleFile(fileOrFiles);
  }
};

// ! single file uploads
export const awsS3SingleFileUploadHandler = (folder: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req?.file) {
        return next(); // ✅ return here to stop further execution
      }

      const uploaded = await uploadToS3(req.file as any, folder);

      if (!uploaded || Array.isArray(uploaded)) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Unexpected upload result");
      }

      req.body.imageUrl = uploaded;

      next();
    } catch (err: any) {
      next(new ApiError(httpStatus.BAD_REQUEST, "S3 Upload Error", err));
    }
  };
};

// ! multiple file uploads
export const awsS3MultipleFileUploadHandler = (folder: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return next();
      }

      const uploaded = await uploadToS3(files, folder);

      if (!Array.isArray(uploaded)) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Unexpected upload result");
      }

      req.body.files = uploaded;

      next();
    } catch (err: any) {
      next(new ApiError(httpStatus.BAD_REQUEST, "S3 Upload Error", err));
    }
  };
};

//!
// generate the presigned URL

export const getObjectFileURL = async (key: string, expiresIn = 3600): Promise<string | null> => {
  const bucket = process.env.AWS_BUCKET_NAME;
  if (!bucket) {
    console.error("AWS_BUCKET_NAME is not defined in environment variables.");
    return null;
  }

  try {
    // Optional: Verify the file exists
    await s3Client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));

    // Generate the presigned URL
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error: any) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      console.warn(`File not found in S3 for key: ${key}`);
    } else {
      console.error("Error generating presigned URL:", error);
    }
    return null;
  }
};
