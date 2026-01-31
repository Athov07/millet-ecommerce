const User = require("../models/User");
const Product = require("../models/Product");

/* ============================
   UTILITY: RECALCULATE CART
============================ */
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

/* ============================
   ADD TO CART (WITH STOCK VALIDATION)
   POST /api/v1/cart
============================ */
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "productId and quantity are required"
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const user = await User.findById(req.user._id).populate("cart.items.product");

    const existingItem = user.cart.items.find(
      item => item.product._id.toString() === productId
    );

    // CALCULATE TOTAL QUANTITY AFTER ADDING
    const totalQuantity = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    // STOCK VALIDATION
    if (totalQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Cannot add ${quantity} items. Only ${product.stock - (existingItem?.quantity || 0)} more available for ${product.name}.`
      });
    }

    // ADD OR UPDATE ITEM
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.items.push({
        product: product._id,
        quantity,
        price: product.price // price from DB only
      });
    }

    // RECALCULATE TOTALS
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

/* ============================
   GET CART (AUTO CLEAN NULLS)
   GET /api/v1/cart
============================ */
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("cart.items.product");

    if (!user || !user.cart) {
      return res.status(200).json({
        success: true,
        cart: { items: [], totalQuantity: 0, totalPrice: 0 }
      });
    }

    // 🧹 REMOVE NULL PRODUCTS
    user.cart.items = user.cart.items.filter(
      item => item.product !== null
    );

    recalcCart(user);
    await user.save();

    res.status(200).json({
      success: true,
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ============================
   UPDATE CART ITEM
   PUT /api/v1/cart/:itemId
============================ */
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

/* ============================
   REMOVE CART ITEM
   DELETE /api/v1/cart/:itemId
============================ */
exports.removeCartItem = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.cart.items.pull({ _id: req.params.itemId });

    recalcCart(user);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Item removed",
      cart: user.cart
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ============================
   CLEAR CART
   DELETE /api/v1/cart
============================ */
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
