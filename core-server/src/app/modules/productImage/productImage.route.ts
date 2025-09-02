import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { ProductImageGenerateController } from "./productImage.controller";
import multer from "multer";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/generate", auth(UserRole.USER, UserRole.ADMIN), upload.single("input"), ProductImageGenerateController.ProductImageGenerate);

export const productImageGenerateRouter = router;
