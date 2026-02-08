const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const instructionSchema = new mongoose.Schema(
  {
    step: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true, // Cloudinary URL
    },

    ingredients: {
      type: [ingredientSchema],
      required: true,
    },

    instructions: {
      type: [instructionSchema],
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdByRole: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
