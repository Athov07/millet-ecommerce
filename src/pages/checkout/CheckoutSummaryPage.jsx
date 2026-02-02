import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutSummary from "../../components/checkout/CheckoutSummary";
import { getCartAPI } from "../../services/cartService";

const DELIVERY_CHARGE = 40; // temporary frontend (we'll move to backend)

const CheckoutSummaryPage = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAddress = localStorage.getItem("selectedAddress");

    if (!storedAddress) {
      navigate("/address");
      return;
    }

    setAddress(JSON.parse(storedAddress));

    const fetchCart = async () => {
      try {
        const res = await getCartAPI();
        setCart(res.data.cart);
      } catch (err) {
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const handlePlaceOrder = async () => {
    alert("Order API will be called here next 🚀");
  };

  if (loading) {
    return <p className="text-center mt-20">Loading summary...</p>;
  }

  if (!cart || cart.items.length === 0) {
    return <p className="text-center mt-20">Cart is empty</p>;
  }

  return (
    <CheckoutSummary
      address={address}
      cart={cart}
      deliveryCharge={DELIVERY_CHARGE}
      onPlaceOrder={handlePlaceOrder}
    />
  );
};

export default CheckoutSummaryPage;
