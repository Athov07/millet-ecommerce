import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const phone = state?.phone; // ✅ SAFE

  const [form, setForm] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  // 🚨 PREVENT BLANK SCREEN
  if (!phone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Invalid password reset request</p>
      </div>
    );
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/reset-password", {
        phone,
        otp: form.otp,
        password: form.password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Reset Password</h2>

        <p className="text-center text-gray-600 mb-4">
          OTP sent to <strong>{phone}</strong>
        </p>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <input
          name="otp"
          placeholder="OTP"
          className="w-full border p-3 rounded mb-3"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="New Password"
          className="w-full border p-3 rounded mb-3"
          onChange={handleChange}
          required
        />

        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-3 rounded mb-4"
          onChange={handleChange}
          required
        />

        <button className="w-full bg-green-600 text-white py-3 rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
