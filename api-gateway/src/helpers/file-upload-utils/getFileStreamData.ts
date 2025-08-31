import fs from "fs";
import path from "path";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";

// Function to retrieve file if path is provided
export const retrieveSingleFile = (filePath: string): fs.ReadStream | undefined => {
  if (!filePath) return undefined;

  // Construct absolute path based on the current working directory
  const absolutePath = path.join(process.cwd(), filePath);

  // Check if file exists at this path
  if (fs.existsSync(absolutePath)) {
    return fs.createReadStream(absolutePath);
  } else {
    throw new ApiError(httpStatus.NOT_FOUND, `File not found at path: ${absolutePath}`);
  }
};

// Function to process file data and retrieve the file stream
export const getFileStreamFromData = (fileData: {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}): fs.ReadStream | undefined => {
  const filePath = fileData.path;

  if (!filePath || typeof filePath !== "string" || filePath.trim() === "") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid file path provided.");
  }

  // Pass the file path to the retrieve function
  return retrieveSingleFile(filePath);
};
