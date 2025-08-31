import express from "express";
import { BlogCategoryController } from "./blogCategory.controller";
import { awsFileUploadHelper } from "../../../helpers/aws_file_uploader/awsFileUploadStorage";

const router = express.Router();

// Add a new blog category
router.post("/add-new", awsFileUploadHelper.uploadBlogCategoryImages, BlogCategoryController.addNewBlogCategory);

// Get all blog categories
router.get("/get-all", BlogCategoryController.getAllBlogCategory);

// Update blog category details
router.patch(
  "/update-details/:blogCategoryId",
  awsFileUploadHelper.uploadBlogCategoryImages,
  BlogCategoryController.updateBlogCategoryDetails,
);

// Update blog category status
router.patch("/update-status/:blogCategoryId", BlogCategoryController.updateBlogCategoryStatus);

// Delete blog category
router.delete("/delete/:blogCategoryId", BlogCategoryController.deleteBlogCategoryData);

export const BlogCategoryRoutes = router;
