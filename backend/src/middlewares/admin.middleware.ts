import { Response, NextFunction, Request } from "express";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

// ──────────────────────────────────────────────────────────────
//  Admin Middleware — Restricts access to admin-only routes.
//
//  MUST be placed AFTER verifyJWT in the route middleware chain
//  because it depends on `req.user` being set.
//
//  If the user's role is not "admin" → 403 Forbidden
//
//  USAGE:
//    router.post("/products", verifyJWT, isAdmin, createProduct);
// ──────────────────────────────────────────────────────────────

const isAdmin = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized — please login first");
    }

    if (req.user.role !== "admin") {
      throw new ApiError(
        403,
        "Forbidden — you do not have admin privileges"
      );
    }

    next();
  }
);

export { isAdmin };
