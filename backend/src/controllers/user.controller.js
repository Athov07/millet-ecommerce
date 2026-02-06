const User = require("../models/User");

exports.getProfile = (req, res) => {
  res.json({
    success: true,
    message: "User profile accessed",
    user: req.user
  });
};

/**
 * ================================
 * UPDATE PROFILE IMAGE
 * PUT /api/v1/user/avatar
 * ================================
 */
exports.updateProfileImage = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        success: false,
        message: "Image upload failed"
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.avatar = req.file.path;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image updated",
      avatar: user.avatar
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/**
 * ================================
 * UPDATE PROFILE INFO
 * PUT /api/v1/user/profile
 * ================================
 */
exports.updateProfileInfo = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;

    // email added first time OR changed later
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};