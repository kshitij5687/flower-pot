import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import { User } from "../user/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

// ──────────────────────────────────────────────────────────────
//  Auth Middleware — Protects routes that need a logged-in user.
//
//  FLOW:
//    1. Read the JWT from `req.cookies.accessToken`
//       (set by the login/signup controller)
//    2. Verify the token using JWT_SECRET
//    3. Find the user in the database (excluding password)
//    4. Attach the user document to `req.user`
//    5. Call `next()` so the controller can use `req.user`
//
//  If the token is missing or invalid → 401 Unauthorized
//  If the user no longer exists → 401 Unauthorized
// ──────────────────────────────────────────────────────────────

interface JwtPayload {
  _id: string;
}

const verifyJWT = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    // 1. Get token from cookies (or Authorization header as fallback)
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized — no token provided");
    }

    // 2. Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // 3. Find user by decoded ID, exclude password
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      throw new ApiError(401, "Unauthorized — user not found (invalid token)");
    }

    // 4. Attach user to request
    req.user = user;

    next();
  }
);

export { verifyJWT };
