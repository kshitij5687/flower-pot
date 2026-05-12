import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

// ──────────────────────────────────────────────────────────────
//  Global Error Middleware
//
//  This is the LAST middleware registered in app.ts.
//  Express routes errors here via `next(err)` or when
//  asyncHandler catches a thrown/rejected error.
//
//  It checks whether the error is our custom ApiError or a
//  generic Error (e.g. from Mongoose / JWT) and normalises
//  the response into a consistent JSON shape:
//
//    { success: false, message: "...", errors: [...] }
//
//  Mongoose-specific errors (validation, duplicate key, cast)
//  are converted into user-friendly messages.
// ──────────────────────────────────────────────────────────────

const errorMiddleware = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: any[] = [];

  // ── Our own ApiError ──
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }
  // ── Mongoose validation error (e.g. required field missing) ──
  else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    const mongooseErr = err as any;
    errors = Object.values(mongooseErr.errors).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
  }
  // ── Mongoose duplicate key error (e.g. duplicate email) ──
  else if ((err as any).code === 11000) {
    statusCode = 409;
    const field = Object.keys((err as any).keyValue)[0];
    message = `Duplicate value for field: ${field}`;
  }
  // ── Mongoose bad ObjectId ──
  else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${(err as any).path}: ${(err as any).value}`;
  }
  // ── JWT errors ──
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired. Please log in again.";
  }
  // ── Anything else ──
  else if (err.message) {
    message = err.message;
  }

  // Log the error in development for debugging
  if (process.env.NODE_ENV === "development") {
    console.error("🔥 ERROR:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export { errorMiddleware };
