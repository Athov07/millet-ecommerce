const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      trim: true
    },
    stock: {
      type: Number,
      default: 0
    },
    images: [
      {
        url: String,
        public_id: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
