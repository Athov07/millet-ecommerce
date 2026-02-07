const User = require("../models/User");

/**
 * GET /api/v1/admin/users
 * Admin only
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -otp -otpExpiresAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};

/**
 * DELETE /api/v1/admin/users
 * Admin only
 */

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Do not allow deleting admin
    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin user cannot be deleted",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};
