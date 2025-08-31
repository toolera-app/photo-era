import { Request, Response, NextFunction } from "express";

import sendResponse from "../../../shared/sendResponse";
import { BlogsService } from "./blogs.service";

const addNewBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await BlogsService.addNewBlog(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};
const uploadBlogContentImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await BlogsService.uploadBlogContentImage(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

const getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await BlogsService.getAllBlogs(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};
const getSingleBlogDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await BlogsService.getSingleBlogDetails(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};
const getSingleBlogDetailsForAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await BlogsService.getSingleBlogDetailsForAdmin(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

const updateBlogDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await BlogsService.updateBlogDetails(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

const updateBlogStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await BlogsService.updateBlogStatus(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

const deleteBlogData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await BlogsService.deleteBlogData(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

export const BlogsController = {
  addNewBlog,
  uploadBlogContentImage,
  getAllBlogs,
  getSingleBlogDetails,
  getSingleBlogDetailsForAdmin,
  updateBlogDetails,
  updateBlogStatus,
  deleteBlogData,
};
