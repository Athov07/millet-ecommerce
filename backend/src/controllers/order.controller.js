const Order = require("../models/Order");
const User = require("../models/User");
const Cart = require("../models/Cart");

/* ============================
   CREATE ORDER FROM CART
============================ */
exports.createOrder = async (req, res) => {
  try {
    const { addressId } = req.body;

    if (!addressId) {
      return res.status(400).json({ success: false, message: "Address is required" });
    }

    // Get user and cart
    const user = await User.findById(req.user._id);

    if (!user.cart.items.length) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Get shipping address
    const shippingAddress = user.addresses.id(addressId);
    if (!shippingAddress) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    // Create order
    const order = new Order({
      user: user._id,
      items: user.cart.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price
      })),
      totalQuantity: user.cart.totalQuantity,
      totalPrice: user.cart.totalPrice,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        country: shippingAddress.country
      },
      status: "pending",
      paymentStatus: "pending"
    });

    await order.save();

    // Clear user cart
    user.cart.items = [];
    user.cart.totalQuantity = 0;
    user.cart.totalPrice = 0;
    await user.save();

    res.status(201).json({ success: true, message: "Order created", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ============================
   GET USER ORDERS
============================ */
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("items.product");
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
    const orders = await Order.find({
      items: { $exists: true, $not: { $size: 0 } } // 🔒 exclude empty orders
    })
      .populate("user", "name phone role")
      .populate("items.product", "name price image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });

  } catch (error) {
    console.error("ADMIN ORDERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

/* ============================
   UPDATE ORDER STATUS (ADMIN)
============================ */
exports.updateOrderStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID"
      });
    }

    const { status } = req.body;

    const allowedStatus = ["pending", "paid", "shipped", "delivered"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Prevent illegal jumps
    if (status === "shipped" && order.paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Order must be paid before shipping"
      });
    }

    if (status === "delivered" && order.status !== "shipped") {
      return res.status(400).json({
        success: false,
        message: "Order must be shipped before delivery"
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
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
   SHIP ORDER (ADMIN)
============================ */
exports.shipOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Order must be paid before shipping"
      });
    }

    if (order.status !== "pending" && order.status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be shipped"
      });
    }

    order.status = "shipped";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order shipped successfully",
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
   DELIVER ORDER (ADMIN)
============================ */
exports.deliverOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.status !== "shipped") {
      return res.status(400).json({
        success: false,
        message: "Order must be shipped before delivery"
      });
    }

    order.status = "delivered";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order delivered successfully",
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
   GET SINGLE ORDER (USER/ADMIN)
============================ */
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("user");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // user can only see their own order
    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
