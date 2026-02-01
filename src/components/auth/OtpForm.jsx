import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

const OtpForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const phone = state?.phone;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/verify-otp", {
        phone,
        otp,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Verify OTP</h2>
        <p className="text-sm text-center mb-4">
          OTP sent to <strong>{phone}</strong>
        </p>

        {error && <p className="text-red-600 mb-3 text-sm">{error}</p>}

        <input
          type="text"
          className="w-full border p-3 rounded mb-6 text-center"
          placeholder="Enter OTP"
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button className="w-full bg-green-600 text-white py-3 rounded">
          Verify
        </button>
      </form>
    </div>
  );
};

export default OtpForm;
