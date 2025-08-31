import express from "express";
import { OrderController } from "./order.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import validateRequest from "../../middlewares/validateRequest";
import { orderValidation } from "./order.validation";

const router = express.Router();

// Create order (user or admin). imageCredit = amount; status starts as PENDING.
router.post("/add-new", auth(UserRole.USER, UserRole.ADMIN), validateRequest(orderValidation.addOrder), OrderController.createOrder);

// List all orders (admin only)
router.get("/", auth(UserRole.ADMIN), OrderController.getAllOrders);

// Get single order (user or admin)
router.get("/details/:orderId", auth(UserRole.USER, UserRole.ADMIN), OrderController.getSingleOrder);

// Update order (admin only) — approve here to credit balance
router.patch("/update/:orderId", auth(UserRole.ADMIN), validateRequest(orderValidation.updateOrder), OrderController.updateOrder);

// Delete order (admin only)
router.delete("/delete/:orderId", auth(UserRole.ADMIN), OrderController.deleteOrder);

export const OrderRoutes = router;
