/* eslint-disable @typescript-eslint/ban-ts-comment */
import express from "express";
import { register } from "../../../shared/prometheus";

const router = express.Router();

router.get("/", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

export const PromQLRoutes = router;
