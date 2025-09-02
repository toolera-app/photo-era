import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { TryOnController } from "./photoEra.controller";
import multer from "multer";
import config from "../../../config";
import { minio } from "../../../shared/minio.client";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/text_prompt", TryOnController.textPrompt);

router.post(
  "/tryon",
  auth(UserRole.USER, UserRole.ADMIN),
  upload.fields([
    { name: "customer", maxCount: 1 },
    { name: "garment", maxCount: 1 },
  ]),
  TryOnController.tryon,
);

router.get("/:bucket/:objectName(*)", async (req, res, next) => {
  try {
    const { bucket, objectName } = req.params as { bucket: string; objectName: string };

    if (bucket !== config.MINIO_BUCKET_IMAGES) {
      return res.status(403).json({ error: "Bucket not allowed" });
    }

    // 👇 fetch metadata first
    const stat = await minio.statObject(bucket, objectName);

    if (stat.metaData && stat.metaData["content-type"]) {
      res.setHeader("Content-Type", stat.metaData["content-type"]);
    }

    const stream = await minio.getObject(bucket, objectName);
    stream.on("error", (err) => next(err));
    stream.pipe(res);
  } catch (err) {
    next(err);
  }
});

export const photoEra = router;
