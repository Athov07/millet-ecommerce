import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { phone });

      navigate("/reset-password", {
        state: { phone },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Forgot Password</h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <input
          type="tel"
          placeholder="Mobile Number"
          className="w-full border p-3 rounded mb-4"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
