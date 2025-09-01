// photoEra.routes.ts
import express from "express";
import multer from "multer";
import { PhotoEraController } from "./photo-era.controller";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Health check
router.get("/healthz", PhotoEraController.healthz);

// Generate text prompt
router.post("/text_prompt", PhotoEraController.generateTextPrompt);

router.post("/remove_bg", upload.single("garment"), PhotoEraController.removeBg);

router.post(
  "/tryon",
  upload.fields([
    { name: "customer", maxCount: 1 },
    { name: "garment", maxCount: 1 },
  ]),
  PhotoEraController.tryon,
);

export const photoEraRoutes = router;
