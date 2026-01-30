const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const { downloadInvoice } = require("../controllers/invoice.controller");

router.get("/:orderId", protect, downloadInvoice);

module.exports = router;
