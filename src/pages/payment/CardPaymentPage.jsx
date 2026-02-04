// src/pages/payment/CardPaymentPage.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createCardPaymentAPI } from "../../services/paymentService";
import CardForm from "../../components/payment/CardForm";

const CardPaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const orderId = location.state?.orderId;
  const amount = location.state?.amount;

  const [loading, setLoading] = useState(false);

  // Redirect if orderId or amount missing
  useEffect(() => {
    if (!orderId || !amount) {
      navigate("/checkout/summary");
    }
  }, [orderId, amount, navigate]);

  const handleCardSubmit = async (cardDetails) => {
    try {
      setLoading(true);
      // Send card details along with orderId
      await createCardPaymentAPI({ orderId, ...cardDetails });
      alert("Payment successful! ✅");
      navigate("/orders"); // redirect to orders page
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!orderId || !amount) return null;

  return <CardForm amount={amount} onSubmit={handleCardSubmit} loading={loading} />;
};

export default CardPaymentPage;
