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
    required: true,
    min: 0
    },

  mainImage: {
  type: String,
  required: true
},
images: [
  {
    url: String
  }
]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
