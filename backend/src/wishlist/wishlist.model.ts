import mongoose, { Schema, Document } from "mongoose";

// ──────────────────────────────────────────────────────────────
//  Wishlist Model
//
//  Each user has ONE wishlist document containing an array of
//  product references. The `user` field is unique to enforce
//  a 1:1 relationship (one wishlist per user).
//
//  Products can be added or removed from the array without
//  creating/deleting the wishlist document itself.
// ──────────────────────────────────────────────────────────────

export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One wishlist per user
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Wishlist = mongoose.model<IWishlist>("Wishlist", wishlistSchema);
