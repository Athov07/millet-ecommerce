const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/auth.middleware");
const { getAllUsers,
        deleteUser
      } = require("../controllers/admin.controller");

router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);


module.exports = router;
