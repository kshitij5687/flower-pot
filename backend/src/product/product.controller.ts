import { Request, Response } from "express";
import { Product } from "./product.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadToCamelCloud } from "../utils/camelCloud";

// ──────────────────────────────────────────────────────────────
//  Product Controller
//
//  PUBLIC endpoints (no auth needed):
//    GET /api/v1/products      — List all products (with pagination)
//    GET /api/v1/products/:id  — Get a single product by ID
//
//  ADMIN-ONLY endpoints (verifyJWT + isAdmin):
//    POST   /api/v1/products      — Create a new product
//    PATCH  /api/v1/products/:id  — Update product fields
//    DELETE /api/v1/products/:id  — Delete a product
// ──────────────────────────────────────────────────────────────

// ── GET /api/v1/products ──
const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  // Pagination: ?page=1&limit=10
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Optional search by name
  const search = req.query.search as string;
  const filter: Record<string, any> = {};
  if (search) {
    filter.name = { $regex: search, $options: "i" }; // case-insensitive
  }

  // Optional category filter
  if (req.query.category) {
    filter.category = req.query.category;
  }

  const [products, total] = await Promise.all([
    Product.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Product.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalProducts: total,
          limit,
        },
      },
      "Products fetched successfully"
    )
  );
});

// ── GET /api/v1/products/:id ──
const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

// ── POST /api/v1/products (Admin Only) ──
const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, price, quantity, category } = req.body;

  // Validate required fields
  if (!name || !description || price === undefined || quantity === undefined) {
    throw new ApiError(
      400,
      "Name, description, price, and quantity are required"
    );
  }

  // Handle optional product image upload
  let imageUrl: string | undefined;
  if (req.file) {
    imageUrl = await uploadToCamelCloud(req.file, "products");
  }

  const product = await Product.create({
    name,
    description,
    price: Number(price),
    quantity: Number(quantity),
    image: imageUrl,
    category: category || "flowerpot",
  });

  res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

// ── PATCH /api/v1/products/:id (Admin Only) ──
const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, price, quantity, category } = req.body;

  const updateData: Record<string, any> = {};
  if (name) updateData.name = name;
  if (description) updateData.description = description;
  if (price !== undefined) updateData.price = Number(price);
  if (quantity !== undefined) updateData.quantity = Number(quantity);
  if (category) updateData.category = category;

  // Handle optional image update
  if (req.file) {
    updateData.image = await uploadToCamelCloud(req.file, "products");
  }

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "Please provide at least one field to update");
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});

// ── DELETE /api/v1/products/:id (Admin Only) ──
const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { deletedId: product._id }, "Product deleted successfully"));
});

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
