import { Request, Response, NextFunction } from "express";

import sendResponse from "../../../shared/sendResponse";
import { BlogCategoryService } from "./blogCategory.service";

const addNewBlogCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await BlogCategoryService.addNewBlogCategory(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

const getAllBlogCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await BlogCategoryService.getAllBlogCategory(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

const updateBlogCategoryDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await BlogCategoryService.updateBlogCategoryDetails(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

const updateBlogCategoryStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await BlogCategoryService.updateBlogCategoryStatus(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

const deleteBlogCategoryData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await BlogCategoryService.deleteBlogCategoryData(req);
    sendResponse(res, response);
  } catch (error) {
    next(error);
  }
};

export const BlogCategoryController = {
  addNewBlogCategory,
  getAllBlogCategory,
  updateBlogCategoryDetails,
  updateBlogCategoryStatus,
  deleteBlogCategoryData,
};
