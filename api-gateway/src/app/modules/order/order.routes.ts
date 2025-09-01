import express from "express";
import { OrderController } from "./order.controller";

const router = express.Router();

// Create
router.post("/add-new", OrderController.addNewOrder);

// List
router.get("/", OrderController.getAllOrders);

// Details
router.get("/details/:orderId", OrderController.getSingleOrder);

// Update
router.patch("/update/:orderId", OrderController.updateOrder);

// Delete
router.delete("/delete/:orderId", OrderController.deleteOrder);

export const OrderRoutes = router;
