const express = require("express");
const router = express.Router();
const {
  getAllRecipes,
  getRecipeById,
} = require("../controllers/recipe.controller");

// PUBLIC / USER
router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);


module.exports = router;
