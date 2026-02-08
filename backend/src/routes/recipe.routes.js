const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipe.controller");

/* ADMIN ONLY */
router.get("/", protect, authorize("admin"), getAllRecipes);
router.get("/:id", protect, authorize("admin"), getRecipeById);
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("image"),
  createRecipe
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  upload.single("image"),
  updateRecipe
);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteRecipe
);



module.exports = router;
