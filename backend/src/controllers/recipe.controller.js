const Recipe = require("../models/Recipe");
const cloudinary = require("cloudinary").v2;

/* helper */
const dataUri = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

/* =========================
   CREATE RECIPE (ADMIN)
========================= */
exports.createRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Recipe image is required",
      });
    }

    const uploadedImage = await cloudinary.uploader.upload(
      dataUri(req.file),
      { folder: "recipes" }
    );

    const recipe = await Recipe.create({
      title,
      image: uploadedImage.secure_url,
      ingredients: JSON.parse(ingredients),
      instructions: JSON.parse(instructions),
      createdBy: req.user._id,
      createdByRole: "admin",
    });

    res.status(201).json({
      success: true,
      recipe,
    });
  } catch (error) {
    console.error("Create Recipe Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET ALL RECIPES (PUBLIC)
========================= */
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ isApproved: true })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, recipes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   GET SINGLE RECIPE
========================= */
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    res.status(200).json({ success: true, recipe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   UPDATE RECIPE (ADMIN)
========================= */
exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }

    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(
        dataUri(req.file),
        { folder: "recipes" }
      );
      recipe.image = uploadedImage.secure_url;
    }

    if (req.body.title) recipe.title = req.body.title;
    if (req.body.ingredients)
      recipe.ingredients = JSON.parse(req.body.ingredients);
    if (req.body.instructions)
      recipe.instructions = JSON.parse(req.body.instructions);

    await recipe.save();

    res.status(200).json({ success: true, recipe });
  } catch (error) {
    console.error("Update Recipe Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   DELETE RECIPE (ADMIN)
========================= */
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    await recipe.deleteOne();

    res.status(200).json({
      success: true,
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
