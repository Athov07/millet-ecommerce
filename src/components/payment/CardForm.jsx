// src/components/payment/CardForm.jsx
import { useState } from "react";

const CardForm = ({ amount, onSubmit }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !cardNumber.match(/^\d{16}$/) ||
      !expiry.match(/^\d{2}\/\d{2}$/) ||
      !cvv.match(/^\d{3,4}$/) ||
      !nameOnCard
    ) {
      setError("Please enter valid card details");
      return;
    }

    setError("");
    onSubmit({ cardNumber, expiry, cvv, nameOnCard });
  };

  return (
    <form className="max-w-md mx-auto p-6 border rounded" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Card Payment</h2>
      <p className="mb-4">Payable Amount: ₹{amount}</p>

      <div className="mb-3">
        <label className="block mb-1">Card Number</label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="1234 5678 9012 3456"
          className="border p-2 w-full rounded"
        />
      </div>

      <div className="flex gap-2 mb-3">
        <div className="flex-1">
          <label className="block mb-1">Expiry (MM/YY)</label>
          <input
            type="text"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            placeholder="12/25"
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1">CVV</label>
          <input
            type="text"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            placeholder="123"
            className="border p-2 w-full rounded"
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="block mb-1">Name on Card</label>
        <input
          type="text"
          value={nameOnCard}
          onChange={(e) => setNameOnCard(e.target.value)}
          placeholder="John Doe"
          className="border p-2 w-full rounded"
        />
      </div>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded w-full hover:bg-green-700"
      >
        Pay Now
      </button>
    </form>
  );
};

export default CardForm;
