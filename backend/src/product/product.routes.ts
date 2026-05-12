import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./product.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/admin.middleware";
import { upload } from "../middlewares/multer.middleware";

// ──────────────────────────────────────────────────────────────
//  Product Routes
//
//  PUBLIC (no auth):
//    GET /            — List all products (paginated, searchable)
//    GET /:id         — Get single product
//
//  ADMIN (verifyJWT + isAdmin):
//    POST /           — Create product (with optional image)
//    PATCH /:id       — Update product (with optional image)
//    DELETE /:id      — Delete product
// ──────────────────────────────────────────────────────────────

const router = Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin-only routes
router.post("/", verifyJWT, isAdmin, upload.single("image"), createProduct);
router.patch("/:id", verifyJWT, isAdmin, upload.single("image"), updateProduct);
router.delete("/:id", verifyJWT, isAdmin, deleteProduct);

export default router;
