const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

const errorHandler = require("./middlewares/error.middleware");

// Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const addressRoutes = require("./routes/address.routes");
const cartRoutes = require("./routes/cart.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const invoiceRoutes = require("./routes/invoice.routes");
const getAllUsersAdminRoutes = require("./routes/admin.routes")

dotenv.config();

const app = express();

/* =====================================================
   SECURITY & CORE MIDDLEWARES
===================================================== */

// 🔥 Helmet FIX for images
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

// SINGLE CORS CONFIG (IMPORTANT)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =====================================================
   STATIC FILES (IMAGES)
===================================================== */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

/* =====================================================
   HEALTH CHECK
===================================================== */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Millet E-commerce API is running 🚀"
  });
});

/* =====================================================
   API ROUTES
===================================================== */
app.use("/api/v1/auth", require("./routes/auth.routes"));
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/user", addressRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/invoices", invoiceRoutes);

app.use("/api/v1/admin", getAllUsersAdminRoutes);

/* =====================================================
   ERROR HANDLER (ALWAYS LAST)
===================================================== */
app.use(errorHandler);

module.exports = app;











