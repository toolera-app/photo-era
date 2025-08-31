import { createMulterUploader } from "../../app/middlewares/multerUploader";
import { awsS3MultipleFileUploadHandler, awsS3SingleFileUploadHandler } from "./awsFileUploadHelper";

//  image allowed
const allowedImageTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/tiff",
  "image/svg+xml",
  "image/heic",
  "image/heif",
  "image/avif",
  "application/octet-stream", // for mobile and ios
];

const maxSizeMB = 50;

// upload handler with multer
const uploadSingleFileHandler = (folderName: string) => [
  createMulterUploader(allowedImageTypes, maxSizeMB).single("file"),
  awsS3SingleFileUploadHandler(folderName),
];
// upload multiple file handler with multer
const uploadMultipleFileHandler = (folderName: string) => [
  createMulterUploader(allowedImageTypes, maxSizeMB).array("files"),
  awsS3MultipleFileUploadHandler(folderName),
];

export const awsFileUploadHelper = {
  uploadEventImages: uploadSingleFileHandler("event-images"),
  uploadEventCategoryImages: uploadSingleFileHandler("event-categories"),
  uploadEventTicketDesignImages: uploadSingleFileHandler("event-tickets-design"),
  //
  uploadUserImages: uploadSingleFileHandler("user-images"),
  uploadVendorUserImages: uploadMultipleFileHandler("vendor-user-images"),
  uploadPromotionTypeImages: uploadSingleFileHandler("promotion-type-images"),
  uploadPromotionImages: uploadSingleFileHandler("promotion-images"),
  uploadEventReviewImages: uploadSingleFileHandler("event-review-images"),
  //
  uploadProductCategoryImages: uploadSingleFileHandler("product-category-images"),
  uploadProductImages: uploadMultipleFileHandler("product-images"),
  uploadContentImages: uploadMultipleFileHandler("content-images"),
  //
  uploadBlogImages: uploadSingleFileHandler("blog-images"),
  uploadBlogCategoryImages: uploadSingleFileHandler("blog-category-images"),
};
