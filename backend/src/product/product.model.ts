import mongoose, { Schema, Document } from "mongoose";

// ──────────────────────────────────────────────────────────────
//  Product Model
//
//  Represents a flower pot product listed on the platform.
//  Only admins can create, update, or delete products.
//  All users (even unauthenticated) can view products.
//
//  FIELDS:
//    • name        (required)  — Product display name
//    • description (required)  — Detailed product description
//    • price       (required)  — Price in currency (min 0)
//    • quantity    (required)  — Stock count (min 0)
//    • image       (optional)  — Cloudinary URL of product image
//    • category    (default: "flowerpot") — Product category
// ──────────────────────────────────────────────────────────────

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image?: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      default: "flowerpot",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<IProduct>("Product", productSchema);
