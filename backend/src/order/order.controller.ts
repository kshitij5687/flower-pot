import { Request, Response } from "express";
import { Order } from "./order.model";
import { Product } from "../product/product.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { sendOrderMail, sendStatusUpdateMail } from "../mails/sendMail";

// ──────────────────────────────────────────────────────────────
//  Order Controller
//
//  USER endpoints (verifyJWT):
//    POST /api/v1/orders       — Place a new order
//    GET  /api/v1/orders       — Get my orders
//
//  ADMIN endpoints (verifyJWT + isAdmin):
//    GET   /api/v1/orders/all         — Get all orders
//    PATCH /api/v1/orders/:id/status  — Update order status
//
//  PLACE ORDER FLOW:
//    1. Validate the items array and shipping address
//    2. For each item, verify the product exists and has enough stock
//    3. Snapshot the current price into the order item
//    4. Decrement the product's quantity (stock)
//    5. Calculate total price
//    6. Create the order document
// ──────────────────────────────────────────────────────────────

// ── POST /api/v1/orders ──
const placeOrder = asyncHandler(async (req: Request, res: Response) => {
  const { items, shippingAddress } = req.body;

  // 1. Validate input
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Order must contain at least one item");
  }

  if (!shippingAddress) {
    throw new ApiError(400, "Shipping address is required");
  }

  // 2. Process each item — validate stock & snapshot price
  let totalPrice = 0;
  const orderItems = [];

  for (const item of items) {
    if (!item.product || !item.quantity) {
      throw new ApiError(400, "Each item must have a product ID and quantity");
    }

    const product = await Product.findById(item.product);
    if (!product) {
      throw new ApiError(404, `Product not found: ${item.product}`);
    }

    if (product.quantity < item.quantity) {
      throw new ApiError(
        400,
        `Insufficient stock for "${product.name}". Available: ${product.quantity}, Requested: ${item.quantity}`
      );
    }

    // 3. Snapshot current price
    const itemTotal = product.price * item.quantity;
    totalPrice += itemTotal;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
    });

    // 4. Decrement stock
    product.quantity -= item.quantity;
    await product.save();
  }

  // 5. Create the order
  const order = await Order.create({
    user: req.user!._id,
    items: orderItems,
    totalPrice,
    shippingAddress,
  });

  // Populate product details in the response
  const populatedOrder = await Order.findById(order._id)
    .populate("items.product", "name price image")
    .populate("user", "name email");

  // Send confirmation email
  if (populatedOrder && (populatedOrder.user as any).email) {
    sendOrderMail(
      (populatedOrder.user as any).email,
      (populatedOrder.user as any).name,
      populatedOrder._id.toString()
    );
  }

  res
    .status(201)
    .json(new ApiResponse(201, populatedOrder, "Order placed successfully"));
});

// ── GET /api/v1/orders ──
const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user!._id })
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments({ user: req.user!._id }),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          limit,
        },
      },
      "Orders fetched successfully"
    )
  );
});

// ── GET /api/v1/orders/all (Admin Only) ──
const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Optional status filter: ?status=pending
  const filter: Record<string, any> = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("items.product", "name price image")
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          limit,
        },
      },
      "All orders fetched successfully"
    )
  );
});

// ── PATCH /api/v1/orders/:id/status (Admin Only) ──
const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;

  const validStatuses = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!status || !validStatuses.includes(status)) {
    throw new ApiError(
      400,
      `Invalid status. Must be one of: ${validStatuses.join(", ")}`
    );
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // If cancelling, restore the stock for each item
  if (status === "cancelled" && order.status !== "cancelled") {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: item.quantity },
      });
    }
  }

  order.status = status;
  await order.save();

  const updatedOrder = await Order.findById(order._id)
    .populate("items.product", "name price image")
    .populate("user", "name email");

  // Send status update email
  if (updatedOrder && (updatedOrder.user as any).email) {
    sendStatusUpdateMail(
      (updatedOrder.user as any).email,
      (updatedOrder.user as any).name,
      updatedOrder._id.toString(),
      status
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedOrder, `Order status updated to "${status}"`)
    );
});

export { placeOrder, getMyOrders, getAllOrders, updateOrderStatus };
