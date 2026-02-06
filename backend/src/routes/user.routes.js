const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const { 
    getProfile,
    updateProfileImage,
    updateProfileInfo
    } = require("../controllers/user.controller");

const upload = require("../config/cloudinary");

router.get("/profile", protect, getProfile);
router.put(
  "/avatar",
  protect,
  upload.single("avatar"), //field name must be "avatar"
  updateProfileImage
);
router.put("/profile", protect, updateProfileInfo);

module.exports = router;
