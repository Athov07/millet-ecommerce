const Order = require("../models/Order");
const path = require("path");
const fs = require("fs");
const { generateInvoice } = require("../utils/generateInvoice");

exports.downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("items.product")
      .populate("user");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const invoicePath = generateInvoice(order);

    res.download(invoicePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Invoice download failed" });
  }
};
