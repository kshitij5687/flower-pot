import { Router } from "express";
import { getWishlist, addToWishlist, removeFromWishlist } from "./wishlist.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

// ──────────────────────────────────────────────────────────────
//  Wishlist Routes — All PROTECTED (verifyJWT)
//
//  GET    /                — Get user's wishlist
//  POST   /:productId     — Add product to wishlist
//  DELETE /:productId     — Remove product from wishlist
// ──────────────────────────────────────────────────────────────

const router = Router();

router.use(verifyJWT);

router.get("/", getWishlist);
router.post("/:productId", addToWishlist);
router.delete("/:productId", removeFromWishlist);

export default router;
