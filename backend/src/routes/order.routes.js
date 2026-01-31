const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth.middleware");
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  shipOrder,
  deliverOrder,
  getOrderById,
  cancelOrder
} = require("../controllers/order.controller");


// User routes
router.post("/", protect, createOrder);      // Create order from cart
router.get("/my-orders", protect, getUserOrders);

// Admin routes
router.get("/", protect, authorize("admin"), getAllOrders);
router.put("/:id", protect, authorize("admin"), updateOrderStatus);
router.post("/:id/cancel", protect, cancelOrder); // User can cancel pending orders




/* USER / ADMIN */
router.get("/:id", protect, getOrderById);

/* ADMIN ONLY */
router.patch("/:id/ship", protect, authorize("admin"), shipOrder);
router.patch("/:id/deliver", protect, authorize("admin"), deliverOrder);




module.exports = router;





