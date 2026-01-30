const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth.middleware");
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require("../controllers/order.controller");

// User routes
router.post("/", protect, createOrder);      // Create order from cart
router.get("/my-orders", protect, getUserOrders);

// Admin routes
router.get("/", protect, authorize("admin"), getAllOrders);
router.put("/:id", protect, authorize("admin"), updateOrderStatus);

module.exports = router;
