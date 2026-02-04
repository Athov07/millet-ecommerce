const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const { calculateDeliveryCharge } = require("../utils/deliveryCharge");

/* ============================
   CREATE ORDER – NO STOCK CHANGE
============================ */
exports.createOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.cart.items.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    const { addressId } = req.body;

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Invalid address"
      });
    }

    // ✅ STOCK VALIDATION
    for (const item of user.cart.items) {
      const product = await Product.findById(item.product);
      if (!product || item.quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product?.name}`
        });
      }
    }

    const subtotal = user.cart.totalPrice;
    const deliveryCharge = calculateDeliveryCharge(subtotal);
    const totalPrice = subtotal + deliveryCharge;

    const order = await Order.create({
      user: user._id,
      items: user.cart.items,
      totalQuantity: user.cart.totalQuantity,
      subtotal,
      deliveryCharge,
      totalPrice,
      shippingAddress: address
    });

    // ✅ CLEAR CART
    user.cart.items = [];
    user.cart.totalQuantity = 0;
    user.cart.totalPrice = 0;
    await user.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ============================
   GET USER ORDERS
============================ */
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



/* ============================
   GET ALL ORDERS (ADMIN)
============================ */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name phone role")
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ============================
   UPDATE ORDER STATUS (ADMIN)
============================ */

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // ✅ DEDUCT STOCK ONLY WHEN BOTH ARE PAID AND NOT DEDUCTED BEFORE
    if (order.paymentStatus !== "paid") {
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.product._id },
          { $inc: { stock: -item.quantity } }
        );
        
      }

      order.paymentStatus = "paid";
      order.status = "paid";
    }

    // update other status safely
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



/* ============================
   SHIP ORDER
============================ */
exports.shipOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    if (order.paymentStatus !== "paid")
      return res.status(400).json({ success: false, message: "Order not paid" });

    if (order.status !== "paid")
      return res.status(400).json({ success: false, message: "Order cannot be shipped" });

    order.status = "shipped";
    await order.save();

    res.json({ success: true, message: "Order shipped", order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



/* ============================
   DELIVER ORDER
============================ */
exports.deliverOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    if (order.status !== "shipped")
      return res.status(400).json({
        success: false,
        message: "Order must be shipped before delivery"
      });

    order.status = "delivered";
    await order.save();

    res.json({ success: true, message: "Order delivered", order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



/* ============================
   GET SINGLE ORDER
============================ */
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("user");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



/* ============================
   CANCEL ORDER + REFUND
============================ */
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered orders cannot be cancelled"
      });
    }

    // ✅ RESTORE STOCK ONLY IF PAID
    if (order.paymentStatus === "paid") {
      await restoreStock(order);
    }

    order.status = "cancelled";
    order.paymentStatus = "refunded";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled & stock restored",
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const restoreStock = async (order) => {
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product) {
      product.stock += item.quantity;
      await product.save();
    }
  }
};

//Order Preview Controller
exports.previewOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    const subtotal = user.cart.totalPrice;
    const deliveryCharge = calculateDeliveryCharge(subtotal);
    const totalPrice = subtotal + deliveryCharge;

    res.status(200).json({
      success: true,
      preview: {
        subtotal,
        deliveryCharge,
        totalPrice
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};