import { Router } from "express";
import {
  submitFeedback,
  getMyFeedback,
  getAllFeedback,
  updateFeedbackStatus,
} from "./feedback.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/admin.middleware";

// ──────────────────────────────────────────────────────────────
//  Feedback Routes
//
//  All routes require authentication (verifyJWT).
//
//  USER:
//    POST /       — Submit feedback / flower request
//    GET  /mine   — Get my feedback submissions
//
//  ADMIN:
//    GET   /            — Get all feedback (paginated, filterable)
//    PATCH /:id/status  — Update feedback status
// ──────────────────────────────────────────────────────────────

const router = Router();

router.use(verifyJWT);

// User routes
router.post("/", submitFeedback);
router.get("/mine", getMyFeedback);

// Admin routes
router.get("/", isAdmin, getAllFeedback);
router.patch("/:id/status", isAdmin, updateFeedbackStatus);

export default router;
