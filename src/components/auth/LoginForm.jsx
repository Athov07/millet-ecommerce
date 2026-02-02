import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { isValidPhone } from "../../utils/validators";


const LoginForm = () => {
  const navigate = useNavigate();
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
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && <p className="bg-red-100 text-red-600 p-2 mb-4">{error}</p>}

        <input
          type="tel"
          name="phone"
          placeholder="Mobile Number"
          className="w-full border p-3 mb-4"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-3 mb-6"
          onChange={handleChange}
          required
        />

        <button className="w-full bg-green-600 text-white py-3 rounded">
          Login
        </button>

        <div className="flex justify-between mt-4 text-sm">
          <Link to="/register" className="text-green-600">Create Account</Link>
          <Link to="/forgot-password" className="text-green-600">Forgot Password?</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
