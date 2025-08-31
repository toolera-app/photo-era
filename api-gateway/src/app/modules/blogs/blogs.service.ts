/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
import { IGenericResponseRedis } from "../../../interfaces/common";
import { CoreService as HttpService } from "../../../shared/axios";
import { getAuthHeaderDetails } from "../../../utils/getAuthHeaderDetails";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import config from "../../../config";

const BLOG_CATEGORY_ROUTE = "/blogs";

// Add a new blog category with image upload
const addNewBlog = async (req: Request): Promise<IGenericResponseRedis> => {
  if (!req?.body?.imageUrl) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Image is Required!");
  }

  const requestedData = JSON.parse(req?.body?.data);
  const obj = {
    ...requestedData,
    imagePath: req?.body?.imageUrl,
  };

  const response: IGenericResponseRedis = await HttpService.post(`${BLOG_CATEGORY_ROUTE}/add-new`, obj, {
    headers: getAuthHeaderDetails(req),
  });
  return response;
};
const uploadBlogContentImage = async (req: Request): Promise<IGenericResponseRedis> => {
  if (!req?.body?.imageUrl) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Image is Required!");
  }

  const obj: IGenericResponseRedis = {
    message: "Successfully Uploaded Image",
    statusCode: httpStatus.OK,
    success: true,
    data: {
      imagePath: `${config.apiServiceFileUrl}/${req?.body?.imageUrl}`,
    },
  };

  return obj;
};

// Get all blog categories
const getAllBlogs = async (req: Request): Promise<IGenericResponseRedis> => {
  return HttpService.get(`${BLOG_CATEGORY_ROUTE}/get-all`, {
    params: req.query,
    headers: getAuthHeaderDetails(req),
  });
};
//  get single blog details
const getSingleBlogDetails = async (req: Request): Promise<IGenericResponseRedis> => {
  return HttpService.get(`${BLOG_CATEGORY_ROUTE}/get-details/${req.params.slug}`, {
    headers: getAuthHeaderDetails(req),
  });
};

// get single blog details (ADMIN DASHBOARD)
const getSingleBlogDetailsForAdmin = async (req: Request): Promise<IGenericResponseRedis> => {
  return HttpService.get(`${BLOG_CATEGORY_ROUTE}/get-details-for-dashboard/${req.params.slug}`, {
    headers: getAuthHeaderDetails(req),
  });
};

// Update blog category details with optional image
const updateBlogDetails = async (req: Request): Promise<IGenericResponseRedis> => {
  const requestedData = JSON.parse(req?.body?.data);
  const obj = {
    ...requestedData,
    imagePath: req?.body?.imageUrl,
  };
  const response: IGenericResponseRedis = await HttpService.patch(
    `${BLOG_CATEGORY_ROUTE}/update-details/${req?.params?.blogId}`,
    obj,
    {
      headers: getAuthHeaderDetails(req),
    },
  );
  return response;
};

// Update status (active/inactive) of a blog category
const updateBlogStatus = async (req: Request): Promise<IGenericResponseRedis> => {
  return HttpService.patch(`${BLOG_CATEGORY_ROUTE}/update-status/${req.params.blogId}`, req.body, {
    headers: getAuthHeaderDetails(req),
  });
};

// Delete a blog category by ID
const deleteBlogData = async (req: Request): Promise<IGenericResponseRedis> => {
  return HttpService.delete(`${BLOG_CATEGORY_ROUTE}/delete/${req.params.blogId}`, {
    headers: getAuthHeaderDetails(req),
  });
};

export const BlogsService = {
  addNewBlog,
  uploadBlogContentImage,
  getAllBlogs,
  getSingleBlogDetails,
  getSingleBlogDetailsForAdmin,
  updateBlogDetails,
  updateBlogStatus,
  deleteBlogData,
};
