import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { isValidPhone } from "../../utils/validators";
import { useAuth } from "../../hooks/useAuth";


const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ phone: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidPhone(form.phone)) {
      setError("Enter valid 10 digit mobile number");
      return;
    }

    try {
      const res = await api.post("/auth/login", {
        phone: form.phone,
        password: form.password,
      });

      // ✅ SINGLE SOURCE OF TRUTH
      login({
        token: res.data.token,
        user: res.data.user,
      });
      console.log("Logged in role:", res.data.user.role);
      // ✅ ROLE BASED REDIRECT
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

      // navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 mb-4 rounded">
            {error}
          </p>
        )}

        <input
          type="tel"
          name="phone"
          placeholder="Mobile Number"
          className="w-full border p-3 mb-4 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-3 mb-6 rounded"
          onChange={handleChange}
          required
        />

        <button className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700">
          Login
        </button>

        <div className="flex justify-between mt-4 text-sm">
          <Link to="/register" className="text-green-600">
            Create Account
          </Link>
          <Link to="/forgot-password" className="text-green-600">
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
