import { Request, Response } from "express";

import { uploadToCamelCloud } from "../utils/camelCloud";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { User } from "../user/user.model";


// ──────────────────────────────────────────────────────────────
//  Auth Controller
//
//  Handles user registration, login, and logout.
//  Uses HTTP-only cookies to store the JWT — the client never
//  sees or handles the token directly, which protects against XSS.
//
//  ENDPOINTS:
//    POST /api/v1/auth/signup  — Register a new user
//    POST /api/v1/auth/login   — Authenticate and set cookie
//    POST /api/v1/auth/logout  — Clear the cookie
// ──────────────────────────────────────────────────────────────

// Cookie configuration — reused across signup/login
const cookieOptions = {
  httpOnly: true, // JS cannot read the cookie (XSS protection)
  secure: true, // Always use HTTPS in production/Vercel
  sameSite: "none" as const, // Allow cross-site requests (frontend and backend on different domains)
  maxAge: Number(process.env.COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ── POST /api/v1/auth/signup ──
const signup = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, favouriteFlower } = req.body;

  // 1. Validate required fields
  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  // 2. Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(
      409,
      "A user with this email already exists. Please login instead.",
    );
  }

  // 3. Handle optional profile image upload
  let imageUrl: string | undefined;
  if (req.file) {
    imageUrl = await uploadToCamelCloud(req.file, "users");
  }

  // 4. Create the user (password is hashed by pre-save hook)
  const user = await User.create({
    name,
    email,
    password,
    image: imageUrl,
    favouriteFlower,
  });

  // 5. Generate JWT
  const accessToken = user.generateAccessToken();

  // 6. Fetch user without password for the response
  const createdUser = await User.findById(user._id).select("-password");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // 7. Set cookie and respond
  res
    .status(201)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        201,
        { user: createdUser },
        "User registered successfully",
      ),
    );
});

// ── POST /api/v1/auth/login ──
const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // 1. Validate
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // 2. Find user — we need password for comparison, so use `+password`
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 3. Verify password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 4. Generate JWT
  const accessToken = user.generateAccessToken();

  // 5. Fetch user without password for the response
  const loggedInUser = await User.findById(user._id).select("-password");

  // 6. Set cookie and respond
  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser },
        "User logged in successfully",
      ),
    );
});

// ── POST /api/v1/auth/logout ──
const logout = asyncHandler(async (_req: Request, res: Response) => {
  // Clear the access token cookie
  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { signup, login, logout };
