const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { protect, adminOnly } = require("../middlewares/auth.middleware");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getRelatedProducts
} = require("../controllers/product.controller");

// Admin only - handle image upload (mainImage + multiple images)
router.post(
  "/",
  protect,
  adminOnly,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  createProduct
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  updateProduct
);

router.delete("/:id", protect, adminOnly, deleteProduct);


// Public
router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/:id/related", getRelatedProducts);

module.exports = router;
