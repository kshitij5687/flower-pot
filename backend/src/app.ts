import cookieParser from "cookie-parser";
/// <reference path="./types/express.d.ts" />
import express from "express";
import path from "path";
import cors from "cors";


// ──────────────────────────────────────────────────────────────
//  Express App Setup
//
//  This file configures the Express application:
//    1. Middleware: JSON parsing, URL encoding, CORS, cookies
//    2. Static file serving (for uploaded images before Cloudinary)
//    3. Route mounting — all feature routes under /api/v1/
//    4. Global error handler (must be LAST middleware)
//
//  The app is exported and used by server.ts, which connects
//  to MongoDB and then starts listening.
// ──────────────────────────────────────────────────────────────

const app = express();

// ── Core Middleware ──

// Parse JSON request bodies (e.g. login, create product)
app.use(express.json({ limit: "16kb" }));

// Parse URL-encoded bodies (e.g. form submissions)
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "../public")));

// Enable CORS with all origins while still allowing cookies.
// When credentials: true is enabled, CORS reflects the request origin.
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// Parse cookies from incoming requests
app.use(cookieParser());

// ── Import Routes ──
import authRoutes from "./auth/auth.routes";
import userRoutes from "./user/user.routes";
import productRoutes from "./product/product.routes";
import wishlistRoutes from "./wishlist/wishlist.routes";
import orderRoutes from "./order/order.routes";
import feedbackRoutes from "./feedback/feedback.routes";

// ── Mount Routes ──
// All API routes are versioned under /api/v1/
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/feedback", feedbackRoutes);

// ── Health Check ──
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "🌻 Flowerpot API is running!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "🌻 Flowerpot API is running!",
    timestamp: new Date().toISOString(),
  });
});

// ── Global Error Handler (must be LAST) ──
import { errorMiddleware } from "./middlewares/error.middleware";
app.use(errorMiddleware);

export { app };
