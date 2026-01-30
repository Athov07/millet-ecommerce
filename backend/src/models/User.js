const mongoose = require("mongoose");

/* ===========================
   ADDRESS SUB-SCHEMA
=========================== */
const addressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: "India"
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  { _id: true }
);

/* ===========================
   CART ITEM SUB-SCHEMA
=========================== */
const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  },
  { _id: true }
);

/* ===========================
   USER SCHEMA
=========================== */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    otp: {
      type: String
    },

    otpExpiresAt: {
      type: Date
    },

    /* ===========================
       ADDRESSES
    =========================== */
    addresses: [addressSchema],

    /* ===========================
       CART
    =========================== */
    cart: {
      items: [cartItemSchema],
      totalQuantity: {
        type: Number,
        default: 0
      },
      totalPrice: {
        type: Number,
        default: 0
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
