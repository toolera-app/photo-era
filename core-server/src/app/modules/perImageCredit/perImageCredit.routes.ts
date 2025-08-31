import { perImageCreditValidation } from "./perImageCredit.validation";
import express from "express";
import { PerImageCreditController } from "./perImageCredit.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

// ! add new event review
router.post("/add-new", auth(UserRole.ADMIN), validateRequest(perImageCreditValidation.addPerImageCredit), PerImageCreditController.createPerImageCredit);

// ! Get all Per Image Credits----------------------------------->>>
router.get("/", PerImageCreditController.getAllPerImageCredits);

// ! get single Per Image Credit----------------------------------->>>
router.get("/details/:perImageCreditId", PerImageCreditController.singlePerImageCredit);

// ! update Per Image Credit----------------------------------->>>
router.patch("/update-review/:perImageCreditId", auth(UserRole.ADMIN), validateRequest(perImageCreditValidation.editPerImageCredit), PerImageCreditController.updatePerImageCredit);

// ! delete Per Image Credit----------------------------------->>>
router.delete("/delete-review/:perImageCreditId", PerImageCreditController.deletePerImageCredit);

export const PerImageCreditRoutes = router;
