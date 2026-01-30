const User = require("../models/User");

/**
 * Utility to recalc cart totals
 */
const recalcCart = (user) => {
  let totalQty = 0;
  let totalPrice = 0;

  user.cart.items.forEach(item => {
    totalQty += item.quantity;
    totalPrice += item.quantity * item.price;
  });

  user.cart.totalQuantity = totalQty;
  user.cart.totalPrice = totalPrice;
};

/**
 * ADD TO CART
 * POST /api/v1/cart
 */
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, price } = req.body;

    if (!productId || !quantity || !price) {
      return res.status(400).json({
        success: false,
        message: "productId, quantity and price are required"
      });
    }

    const user = await User.findById(req.user._id);

    const existingItem = user.cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.items.push({
        product: productId,
        quantity,
        price
      });
    }

    recalcCart(user);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET CART
 * GET /api/v1/cart
 */
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("cart.items.product");

    res.status(200).json({
      success: true,
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE CART ITEM
 * PUT /api/v1/cart/:itemId
 */
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be >= 1"
      });
    }

    const user = await User.findById(req.user._id);
    const item = user.cart.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found"
      });
    }

    item.quantity = quantity;

    recalcCart(user);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * REMOVE CART ITEM
 * DELETE /api/v1/cart/:itemId
 */
exports.removeCartItem = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.cart.items.pull({ _id: req.params.itemId });

    recalcCart(user);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * CLEAR CART
 * DELETE /api/v1/cart
 */
exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.cart.items = [];
    user.cart.totalQuantity = 0;
    user.cart.totalPrice = 0;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
