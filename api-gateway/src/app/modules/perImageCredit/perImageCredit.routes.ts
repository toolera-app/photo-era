import express from "express";
import { PerImageCreditController } from "./perImageCredit.controller";

const router = express.Router();

// Create
router.post("/add-new", PerImageCreditController.addPerImageCredit);

// List
router.get("/", PerImageCreditController.getAllPerImageCredits);

// Details
router.get("/details/:perImageCreditId", PerImageCreditController.getSinglePerImageCredit);

// Update
router.patch("/update/:perImageCreditId", PerImageCreditController.updatePerImageCredit);

// Delete
router.delete("/delete/:perImageCreditId", PerImageCreditController.deletePerImageCredit);

export const PerImageCreditRoutes = router;
