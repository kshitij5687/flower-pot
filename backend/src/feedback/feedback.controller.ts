import { Request, Response } from "express";
import { Feedback } from "./feedback.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

// ──────────────────────────────────────────────────────────────
//  Feedback Controller
//
//  USER endpoints (verifyJWT):
//    POST /api/v1/feedback  — Submit feedback or a flower request
//    GET  /api/v1/feedback/mine — Get my feedback submissions
//
//  ADMIN endpoints (verifyJWT + isAdmin):
//    GET   /api/v1/feedback           — Get all feedback (paginated)
//    PATCH /api/v1/feedback/:id/status — Update feedback status
// ──────────────────────────────────────────────────────────────

// ── POST /api/v1/feedback ──
const submitFeedback = asyncHandler(async (req: Request, res: Response) => {
  const { message, flowerName } = req.body;

  if (!message) {
    throw new ApiError(400, "Feedback message is required");
  }

  const feedback = await Feedback.create({
    user: req.user!._id,
    message,
    flowerName,
  });

  const populatedFeedback = await Feedback.findById(feedback._id).populate(
    "user",
    "name email"
  );

  res
    .status(201)
    .json(
      new ApiResponse(201, populatedFeedback, "Feedback submitted successfully")
    );
});

// ── GET /api/v1/feedback/mine ──
const getMyFeedback = asyncHandler(async (req: Request, res: Response) => {
  const feedback = await Feedback.find({ user: req.user!._id })
    .sort({ createdAt: -1 })
    .populate("user", "name email");

  res
    .status(200)
    .json(
      new ApiResponse(200, feedback, "Your feedback fetched successfully")
    );
});

// ── GET /api/v1/feedback (Admin Only) ──
const getAllFeedback = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Optional status filter: ?status=pending
  const filter: Record<string, any> = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }

  const [feedbacks, total] = await Promise.all([
    Feedback.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Feedback.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        feedbacks,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalFeedbacks: total,
          limit,
        },
      },
      "All feedback fetched successfully"
    )
  );
});

// ── PATCH /api/v1/feedback/:id/status (Admin Only) ──
const updateFeedbackStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { status } = req.body;
    const validStatuses = ["pending", "reviewed", "resolved"];

    if (!status || !validStatuses.includes(status)) {
      throw new ApiError(
        400,
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      );
    }

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate("user", "name email");

    if (!feedback) {
      throw new ApiError(404, "Feedback not found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          feedback,
          `Feedback status updated to "${status}"`
        )
      );
  }
);

export { submitFeedback, getMyFeedback, getAllFeedback, updateFeedbackStatus };
