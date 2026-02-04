import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutSummary from "../../components/checkout/CheckoutSummary";
import { getCartAPI } from "../../services/cartService";
import { createOrderAPI, previewOrderAPI } from "../../services/orderService";
import { createCardPaymentAPI, createRazorpayPaymentAPI, verifyRazorpayPaymentAPI } from "../../services/paymentService";
import api from "../../services/api";

const CheckoutSummaryPage = () => {
  const [address, setAddress] = useState(null);
  const [cart, setCart] = useState(null);
  const [preview, setPreview] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const addressId = localStorage.getItem("selectedAddressId");
        if (!addressId) return navigate("/address");

        const cartRes = await getCartAPI();
        setCart(cartRes.data.cart);

        const previewRes = await previewOrderAPI();
        setPreview(previewRes.data.preview);

        const addressRes = await api.get("/user/address");
        const selected = addressRes.data.addresses.find(a => a._id === addressId);
        if (!selected) return navigate("/address");
        setAddress(selected);
      } catch (err) {
        console.error(err);
        alert("Something went wrong while fetching cart or address");
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // CREATE ORDER
  const handlePlaceOrder = async () => {
    if (!address) return alert("Please select address first");

    try {
      setPlacingOrder(true);
      const res = await createOrderAPI({ addressId: address._id });
      setOrder(res.data.order);

      setPreview({
        subtotal: res.data.order.subtotal,
        deliveryCharge: res.data.order.deliveryCharge,
        totalPrice: res.data.order.totalPrice
      });

      alert("Order created! Please select payment method.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create order");
    } finally {
      setPlacingOrder(false);
    }
  };

  // RAZORPAY PAYMENT
  const handlePayWithRazorpay = async () => {
    if (!order) return alert("Please create order first");

    try {
      setLoading(true);
      const res = await createRazorpayPaymentAPI(order._id);
      const payment = res.data.payment;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.totalPrice * 100,
        currency: "INR",
        name: "Millet E-commerce",
        description: "Order Payment",
        handler: async function () {
          await verifyRazorpayPaymentAPI(payment._id);
          alert("Payment successful!");
          navigate("/orders");
        },
        prefill: {
          name: order.shippingAddress?.name || "John Doe",
          email: "user@example.com",
          contact: order.shippingAddress?.phone || "9999999999",
        },
        theme: { color: "#1E40AF" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Razorpay payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-20">Loading summary...</p>;
  if (!cart || cart.items.length === 0) return <p className="text-center mt-20">Cart is empty</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <CheckoutSummary
        address={address}
        cart={cart}
        preview={preview}
        onPlaceOrder={handlePlaceOrder}
        placingOrder={placingOrder}
      />

      {/* Payment buttons */}
      {order && order.paymentStatus !== "paid" && (
        <div className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold">Choose Payment Method</h2>

          <button
            onClick={() =>
                navigate("/payment/card", {
                  state: { orderId: order._id, amount: preview.totalPrice }})
              }
            disabled={processingPayment}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {processingPayment ? "Processing..." : "Pay with Card (Mock)"}
          </button>

          <button
            onClick={handlePayWithRazorpay}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Processing..." : "Pay with Razorpay"}
          </button>
        </div>
      )}

      {order && order.paymentStatus === "paid" && (
        <p className="mt-4 text-green-600 font-semibold text-center">
          Payment Successful! ✅
        </p>
      )}
    </div>
  );
};

export default CheckoutSummaryPage;
