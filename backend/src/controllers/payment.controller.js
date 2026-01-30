const Payment = require("../models/Payment");
const Order = require("../models/Order");
const mongoose = require("mongoose");

/* ============================
   CREATE RAZORPAY PAYMENT
============================ */
exports.createRazorpayPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID"
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Order already paid"
      });
    }

    const payment = await Payment.create({
      user: req.user._id,
      order: order._id,
      amount: order.totalPrice,
      method: "razorpay",
      gatewayOrderId: "rzp_order_" + Date.now(),
      status: "created"
    });

    res.status(201).json({
      success: true,
      message: "Razorpay payment created",
      payment
    });
  } catch (error) {
    console.error("RAZORPAY CREATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ============================
   VERIFY RAZORPAY PAYMENT (MOCK VERIFY)
============================ */
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Payment ID"
      });
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    if (payment.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment already verified"
      });
    }

    // mock verification success
    payment.status = "paid";
    payment.gatewayPaymentId = "rzp_pay_" + Date.now();
    await payment.save();

    await Order.findByIdAndUpdate(payment.order, {
      paymentStatus: "paid",
      status: "paid"
    });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment
    });
  } catch (error) {
    console.error("RAZORPAY VERIFY ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ============================
   CREATE MOCK PAYMENT (STEP 1)
============================ */
exports.createMockPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID"
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Order already paid"
      });
    }

    const payment = await Payment.create({
      user: req.user._id,
      order: order._id,
      amount: order.totalPrice,
      method: "mock",
      status: "created"
    });

    res.status(201).json({
      success: true,
      message: "Mock payment created",
      payment
    });
  } catch (error) {
    console.error("MOCK CREATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ============================
   VERIFY MOCK PAYMENT
============================ */
exports.verifyMockPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Payment ID"
      });
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    if (payment.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment already verified"
      });
    }

    payment.status = "paid";
    payment.gatewayPaymentId = "mock_pay_" + Date.now();
    await payment.save();

    await Order.findByIdAndUpdate(payment.order, {
      paymentStatus: "paid",
      status: "paid"
    });

    res.status(200).json({
      success: true,
      message: "Mock payment verified",
      payment
    });
  } catch (error) {
    console.error("MOCK VERIFY ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ============================
   GET MY PAYMENTS
============================ */
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate("order")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ============================
   GET ALL PAYMENTS (ADMIN)
============================ */
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name phone role")
      .populate("order")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
