const express = require("express");
const router = express.Router();

const {
  createRazorpayPayment,
  verifyRazorpayPayment,
  createMockPayment,
  getMyPayments,
  getAllPayments
} = require("../controllers/payment.controller");

const { protect, authorize } = require("../middlewares/auth.middleware");

router.post("/razorpay/create", protect, createRazorpayPayment);
router.post("/razorpay/verify", protect, verifyRazorpayPayment);

router.post("/mock", protect, createMockPayment);

router.get("/my-payments", protect, getMyPayments);
router.get("/", protect, authorize("admin"), getAllPayments);

module.exports = router;
