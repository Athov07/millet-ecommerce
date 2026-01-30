const User = require("../models/User");

/**
 * ================================
 * ADD ADDRESS
 * POST /api/v1/user/address
 * ================================
 */
exports.addAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      street,
      city,
      state,
      pincode,
      country,
      isDefault
    } = req.body;

    if (!fullName || !phone || !street || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "All required address fields must be provided"
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // If new address is default, unset old default
    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      fullName,
      phone,
      street,
      city,
      state,
      pincode,
      country,
      isDefault
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * ================================
 * GET ALL ADDRESSES
 * GET /api/v1/user/address
 * ================================
 */
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * ================================
 * UPDATE ADDRESS
 * PUT /api/v1/user/address/:addressId
 * ================================
 */
exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    // If setting new default address
    if (req.body.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    // Update fields
    address.fullName = req.body.fullName || address.fullName;
    address.phone = req.body.phone || address.phone;
    address.street = req.body.street || address.street;
    address.city = req.body.city || address.city;
    address.state = req.body.state || address.state;
    address.pincode = req.body.pincode || address.pincode;
    address.country = req.body.country || address.country;
    address.isDefault =
      req.body.isDefault !== undefined
        ? req.body.isDefault
        : address.isDefault;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * ================================
 * DELETE ADDRESS
 * DELETE /api/v1/user/address/:addressId
 * ================================
 */
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    // ✅ CORRECT WAY (Mongoose v6+)
    user.addresses.pull({ _id: req.params.addressId });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
