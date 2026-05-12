import { Router } from "express";
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "./order.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/admin.middleware";

// ──────────────────────────────────────────────────────────────
//  Order Routes
//
//  All routes require authentication (verifyJWT).
//
//  USER:
//    POST /          — Place a new order
//    GET  /          — Get my orders
//
//  ADMIN:
//    GET   /all         — Get all orders (with optional status filter)
//    PATCH /:id/status  — Update order status
// ──────────────────────────────────────────────────────────────

const router = Router();

router.use(verifyJWT);

// User routes
router.post("/", placeOrder);
router.get("/", getMyOrders);

// Admin routes
router.get("/all", isAdmin, getAllOrders);
router.patch("/:id/status", isAdmin, updateOrderStatus);

export default router;
