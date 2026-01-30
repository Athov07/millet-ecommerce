const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");

const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require("../controllers/cart.controller");

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/:itemId", protect, updateCartItem);
router.delete("/:itemId", protect, removeCartItem);
router.delete("/", protect, clearCart);

module.exports = router;
