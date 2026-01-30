const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateOtp = require("../utils/generateOtp");
const generateToken = require("../utils/generateToken");

// --------------------- REGISTER USER ---------------------
exports.register = async (req, res, next) => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (unverified)
    const user = await User.create({
      name,
      phone,
      password: hashedPassword,
      isVerified: false
    });

    // Generate OTP and save in user
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
    await user.save();

    // Respond (for testing, OTP included)
    res.status(201).json({
      success: true,
      message: "User registered. OTP sent to mobile.",
      otp // remove in production
    });

  } catch (error) {
    next(error);
  }
};

// --------------------- VERIFY OTP ---------------------
exports.verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: "Phone and OTP are required" });
    }

    const user = await User.findOne({ phone });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.isVerified) return res.status(400).json({ success: false, message: "User already verified" });

    const cleanOtp = otp.trim();

    if (!user.otp || user.otp !== cleanOtp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // OTP verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "OTP verified successfully" });

  } catch (error) {
    next(error);
  }
};


// --------------------- LOGIN ---------------------
exports.login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and password are required"
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify OTP before login"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
