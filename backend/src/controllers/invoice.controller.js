const Order = require("../models/Order");
const { generateInvoice } = require("../utils/invoiceGenerator");

exports.downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("items.product")
      .populate("user");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // User can only download their own invoice
    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    if (order.paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Invoice available only for paid orders"
      });
    }

    const filePath = generateInvoice(order);

    res.download(filePath);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
