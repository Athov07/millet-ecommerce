const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalQuantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    shippingAddress: {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String
    },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered"],
      default: "pending"
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },
    paymentId: String // can store Razorpay payment id later
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
