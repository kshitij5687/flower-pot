import { Request, Response } from "express";
import { Wishlist } from "./wishlist.model";
import { Product } from "../product/product.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// ──────────────────────────────────────────────────────────────
//  Wishlist Controller
//
//  All routes are PROTECTED (user must be logged in).
//
//  ENDPOINTS:
//    GET    /api/v1/wishlist              — Get user's wishlist (populated)
//    POST   /api/v1/wishlist/:productId  — Add a product
//    DELETE /api/v1/wishlist/:productId  — Remove a product
// ──────────────────────────────────────────────────────────────

// ── GET /api/v1/wishlist ──
const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  // Find or create the user's wishlist, then populate product details
  let wishlist = await Wishlist.findOne({ user: req.user!._id }).populate(
    "products",
    "name price image quantity category"
  );

  if (!wishlist) {
    // Create an empty wishlist if one doesn't exist yet
    wishlist = await Wishlist.create({ user: req.user!._id, products: [] });
  }

  res
    .status(200)
    .json(new ApiResponse(200, wishlist, "Wishlist fetched successfully"));
});

// ── POST /api/v1/wishlist/:productId ──
const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;

  // Verify the product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Find or create the user's wishlist
  let wishlist = await Wishlist.findOne({ user: req.user!._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user!._id, products: [] });
  }

  // Check if the product is already in the wishlist
  if (wishlist.products.some((id) => id.toString() === productId)) {
    throw new ApiError(400, "Product is already in your wishlist");
  }

  // Add product to wishlist
  wishlist.products.push(product._id);
  await wishlist.save();

  // Return populated wishlist
  const populatedWishlist = await Wishlist.findById(wishlist._id).populate(
    "products",
    "name price image quantity category"
  );

  res
    .status(200)
    .json(
      new ApiResponse(200, populatedWishlist, "Product added to wishlist")
    );
});

// ── DELETE /api/v1/wishlist/:productId ──
const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: req.user!._id });

  if (!wishlist) {
    throw new ApiError(404, "Wishlist not found");
  }

  // Check if the product is actually in the wishlist
  const productIndex = wishlist.products.findIndex(
    (id) => id.toString() === productId
  );

  if (productIndex === -1) {
    throw new ApiError(400, "Product is not in your wishlist");
  }

  // Remove the product
  wishlist.products.splice(productIndex, 1);
  await wishlist.save();

  // Return populated wishlist
  const populatedWishlist = await Wishlist.findById(wishlist._id).populate(
    "products",
    "name price image quantity category"
  );

  res
    .status(200)
    .json(
      new ApiResponse(200, populatedWishlist, "Product removed from wishlist")
    );
});

export { getWishlist, addToWishlist, removeFromWishlist };
