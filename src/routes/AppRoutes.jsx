import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminRoute from "./AdminRoute";
import AdminLayout from "../layouts/AdminLayout";


import Home from "../pages/user/Home";
import Products from "../pages/user/Products";
import ProductDetails from "../pages/user/ProductDetails";
import Cart from "../pages/user/Cart";
import Profile from "../pages/user/ProfilePage";
import Recipes from "../pages/user/Recipes";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import AddressPage from "../pages/checkout/AddressPage";
import CheckoutSummaryPage from "../pages/checkout/CheckoutSummaryPage";
import MyOrdersPage from "../pages/order/MyOrdersPage";
import CardPaymentPage from "../pages/payment/CardPaymentPage";


// admin pages
import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import AdminProducts from "../pages/admin/AdminProducts";
import Orders from "../pages/admin/Orders";
import AddProduct from "../pages/admin/AddProduct";
import EditProduct from "../pages/admin/EditProduct";


const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        /* User Pages */
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recipes" element={<Recipes />} />
        /* Auth Pages */
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/checkout/summary" element={<CheckoutSummaryPage />}/>
        <Route path="/orders" element={<MyOrdersPage />} />
        <Route path="/payment/card" element={<CardPaymentPage />} />
      </Route>

       {/* ADMIN ROUTES */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/add" element={<AddProduct />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/products/edit/:id" element={<EditProduct />} />
        </Route>
      </Route>
    
    </Routes>
  );
};

export default AppRoutes;




