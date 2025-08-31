/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
import { IGenericResponseRedis } from "../../../interfaces/common";
import { CoreService as HttpService } from "../../../shared/axios";
import { getAuthHeaderDetails } from "../../../utils/getAuthHeaderDetails";
import { IUploadFile } from "../../../interfaces/file";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

const BLOG_CATEGORY_ROUTE = "/blog-categories";
// Add a new blog category with image upload
const addNewBlogCategory = async (req: Request): Promise<IGenericResponseRedis> => {
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

// Get all blog categories
const getAllBlogCategory = async (req: Request): Promise<IGenericResponseRedis> => {
  return HttpService.get(`${BLOG_CATEGORY_ROUTE}/get-all`, {
    params: req.query,
    headers: getAuthHeaderDetails(req),
  });
};

// Update blog category details with optional image
const updateBlogCategoryDetails = async (req: Request): Promise<IGenericResponseRedis> => {
  const requestedData = JSON.parse(req?.body?.data);
  const obj = {
    ...requestedData,
    imagePath: req?.body?.imageUrl,
  };

  const response: IGenericResponseRedis = await HttpService.patch(
    `${BLOG_CATEGORY_ROUTE}/update-details/${req?.params?.blogCategoryId}`,
    obj,
    {
      headers: getAuthHeaderDetails(req),
    },
  );
  return response;
};

// Update status (active/inactive) of a blog category
const updateBlogCategoryStatus = async (req: Request): Promise<IGenericResponseRedis> => {
  return HttpService.patch(`${BLOG_CATEGORY_ROUTE}/update-status/${req.params.blogCategoryId}`, req.body, {
    headers: getAuthHeaderDetails(req),
  });
};

// Delete a blog category by ID
const deleteBlogCategoryData = async (req: Request): Promise<IGenericResponseRedis> => {
  return HttpService.delete(`${BLOG_CATEGORY_ROUTE}/delete/${req.params.blogCategoryId}`, {
    headers: getAuthHeaderDetails(req),
  });
};

export const BlogCategoryService = {
  addNewBlogCategory,
  getAllBlogCategory,
  updateBlogCategoryDetails,
  updateBlogCategoryStatus,
  deleteBlogCategoryData,
};
