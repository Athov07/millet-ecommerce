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

    // 1️⃣ Cart
    const cartRes = await getCartAPI();
    setCart(cartRes.data.cart);

    // 2️⃣ Order preview
    const previewRes = await previewOrderAPI();
    setPreview(previewRes.data.preview);

    // 3️⃣ Fetch selected address ✅ CORRECTED URL
    const addressRes = await api.get("/user/address");
    const selected = addressRes.data.addresses.find(a => a._id === addressId);
    if (!selected) return navigate("/address");
    setAddress(selected);
  } catch (err) {
    console.error(err);
    alert("Something went wrong while fetching cart or address");
    navigate("/cart"); // fallback
  } finally {
    setLoading(false);
  }
};

    fetchData();
  }, []);

  // STEP 1: CREATE ORDER
  const handlePlaceOrder = async () => {
    if (!address) return alert("Please select address first");

    try {
      setPlacingOrder(true);

      const res = await createOrderAPI({ addressId: address._id });
      setOrder(res.data.order);

      // Preview will now reflect order totals from backend
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

  // STEP 2: MOCK CARD PAYMENT
  const handlePayWithCard = async () => {
    if (!order) return alert("Please create order first");

    try {
      setProcessingPayment(true);
      const res = await createCardPaymentAPI(order._id);
      alert("Payment successful!");
      setOrder({ ...order, paymentStatus: "paid", status: "paid" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setProcessingPayment(false);
    }
  };

  // STEP 3: RAZORPAY PAYMENT
  const handlePayWithRazorpay = async () => {
    if (!order) return alert("Please create order first");

    try {
      setProcessingPayment(true);
      // 1️⃣ Create Razorpay order
      const res = await createRazorpayPaymentAPI(order._id);
      const paymentId = res.data.payment._id;

      // NOTE: Normally here you would integrate Razorpay checkout
      // For testing, we just mock verify
      await verifyRazorpayPaymentAPI(paymentId);

      alert("Razorpay payment successful!");
      setOrder({ ...order, paymentStatus: "paid", status: "paid" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Razorpay payment failed");
    } finally {
      setProcessingPayment(false);
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

      {/* ✅ Payment buttons only appear after order is created */}
      {order && order.paymentStatus !== "paid" && (
        <div className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold">Choose Payment Method</h2>

          <button
            onClick={() => navigate("/payment/card", {
      state: { orderId: order._id, amount: preview.totalPrice }
    })}
  disabled={processingPayment}
            className="bg-blue-600 text-white px-6 py-3 rounded w-full hover:bg-blue-700 disabled:opacity-60"
          >
            {processingPayment ? "Processing..." : "Pay with Card (Mock)"}
          </button>

          <button
            onClick={handlePayWithRazorpay}
            disabled={processingPayment}
            className="bg-orange-600 text-white px-6 py-3 rounded w-full hover:bg-orange-700 disabled:opacity-60"
          >
            {processingPayment ? "Processing..." : "Pay with Razorpay"}
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
