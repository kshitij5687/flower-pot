import mongoose, { Schema, Document } from "mongoose";

// ──────────────────────────────────────────────────────────────
//  Feedback Model
//
//  Allows users to submit feedback or request that a specific
//  flower be added to the platform. Admins can view all feedback
//  and update its status as they process requests.
//
//  FIELDS:
//    • user       — Reference to the User who submitted
//    • message    — The feedback text (required)
//    • flowerName — The specific flower they want added (optional)
//    • status     — "pending" → "reviewed" → "resolved"
// ──────────────────────────────────────────────────────────────

export interface IFeedback extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  message: string;
  flowerName?: string;
  status: "pending" | "reviewed" | "resolved";
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: [true, "Feedback message is required"],
      trim: true,
      maxlength: [1000, "Feedback message cannot exceed 1000 characters"],
    },
    flowerName: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Feedback = mongoose.model<IFeedback>("Feedback", feedbackSchema);
