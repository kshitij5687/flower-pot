import { Request, Response } from "express";
import { User } from "./user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadToCamelCloud } from "../utils/camelCloud";

// ──────────────────────────────────────────────────────────────
//  User Controller
//
//  These routes are all PROTECTED (verifyJWT middleware runs first).
//  The authenticated user is available on `req.user`.
//
//  ENDPOINTS:
//    GET   /api/v1/users/profile  — Get the logged-in user's profile
//    PATCH /api/v1/users/profile  — Update name, image, favouriteFlower
// ──────────────────────────────────────────────────────────────

// ── GET /api/v1/users/profile ──
const getProfile = asyncHandler(async (req: Request, res: Response) => {
  // req.user is set by verifyJWT middleware (password already excluded)
  const user = await User.findById(req.user!._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully"));
});

// ── PATCH /api/v1/users/profile ──
const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const { name, favouriteFlower } = req.body;

  // Build an update object with only the fields that were sent
  const updateData: Record<string, any> = {};
  if (name) updateData.name = name;
  if (favouriteFlower !== undefined) updateData.favouriteFlower = favouriteFlower;

  // Handle image upload if a file was sent
  if (req.file) {
    updateData.image = await uploadToCamelCloud(req.file, "users");
  }

  // If nothing to update, tell the user
  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "Please provide at least one field to update");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user!._id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

export { getProfile, updateProfile };
