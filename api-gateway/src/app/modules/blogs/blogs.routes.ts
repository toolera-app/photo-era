import express from "express";
import { BlogsController } from "./blogs.controller";
import { awsFileUploadHelper } from "../../../helpers/aws_file_uploader/awsFileUploadStorage";

const router = express.Router();

// Create a new blog post
router.post("/add-new", awsFileUploadHelper.uploadBlogImages, BlogsController.addNewBlog);

router.post("/upload-content-image", awsFileUploadHelper.uploadBlogImages, BlogsController.uploadBlogContentImage);

// Get all blog posts
router.get("/get-all", BlogsController.getAllBlogs);

// Get blog details by slug (public)
router.get("/get-details/:slug", BlogsController.getSingleBlogDetails);
// Get blog details by slug (ADMIN01915271655)
router.get("/get-details-for-dashboard/:slug", BlogsController.getSingleBlogDetailsForAdmin);
// Update blog details
router.patch("/update-details/:blogId", awsFileUploadHelper.uploadBlogImages, BlogsController.updateBlogDetails);

// Update blog status (e.g., publish/unpublish) —
router.patch("/update-status/:blogId", BlogsController.updateBlogStatus);

// Delete a blog post
router.delete("/delete/:blogId", BlogsController.deleteBlogData);

export const BlogRoutes = router;
