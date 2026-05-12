import { Request, Response, NextFunction } from "express";

// ──────────────────────────────────────────────────────────────
//  asyncHandler — Wraps an async Express route handler so that
//  any rejected promise is automatically forwarded to `next()`.
//
//  WITHOUT this wrapper, every controller would need its own
//  try/catch block. With it, thrown ApiError instances (or any
//  other errors) bubble up to the global error middleware.
//
//  USAGE:
//    router.get("/products", asyncHandler(async (req, res) => {
//      const products = await Product.find();
//      res.json(new ApiResponse(200, products));
//    }));
// ──────────────────────────────────────────────────────────────

type AsyncRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

const asyncHandler = (fn: AsyncRouteHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
