import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { TryOnController } from "./photoQuivers.controller";
import multer from "multer";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/healthz", TryOnController.healthz);

router.post("/text_prompt", TryOnController.textPrompt);

router.post("/remove_bg", upload.single("garment"), TryOnController.removeBg);

router.post(
  "/tryon",
  auth(UserRole.USER, UserRole.ADMIN), // authenticate first (sets req.user)
  upload.fields([
    { name: "customer", maxCount: 1 },
    { name: "garment", maxCount: 1 },
  ]),
  TryOnController.tryon,
);

export const photoQuivers = router;
