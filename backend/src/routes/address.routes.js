const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");

const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress
} = require("../controllers/address.controller");

router.post("/address", protect, addAddress);
router.get("/address", protect, getAddresses);
router.put("/address/:addressId", protect, updateAddress);
router.delete("/address/:addressId", protect, deleteAddress);

module.exports = router;
