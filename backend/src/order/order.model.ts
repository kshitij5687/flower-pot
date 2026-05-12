import mongoose, { Schema, Document } from "mongoose";

// ──────────────────────────────────────────────────────────────
//  Order Model
//
//  Represents a purchase made by a user. Each order contains:
//    • A reference to the user who placed it
//    • An array of order items (product ref + quantity + price snapshot)
//    • A total price (computed at order-creation time)
//    • A status that progresses through the order lifecycle
//    • A shipping address
//
//  The `price` inside each item is a SNAPSHOT of the product
//  price at the time of purchase — so later price changes
//  don't affect historical orders.
// ──────────────────────────────────────────────────────────────

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number; // Price snapshot at time of purchase
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, "Item quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    price: {
      type: Number,
      required: [true, "Item price is required"],
      min: [0, "Price cannot be negative"],
    },
  },
  { _id: false } // No separate _id for sub-documents
);

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items: IOrderItem[]) => items.length > 0,
        message: "Order must contain at least one item",
      },
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      type: String,
      required: [true, "Shipping address is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
