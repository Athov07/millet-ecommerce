import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCartAPI,
  updateCartItemAPI,
  removeCartItemAPI,
} from "../../services/cartService";
import { useCart } from "../../hooks/useCart";

const CartView = () => {
  const navigate = useNavigate();
  const { setCartCount } = useCart();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState(null);

  // 🔹 Fetch Cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getCartAPI();
        setCart(res.data.cart);
        setCartCount(res.data.cart.totalQuantity);
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate, setCartCount]);

  // 🔹 Update Quantity
  const updateQty = async (itemId, qty) => {
    if (qty < 1) return;

    try {
      setUpdatingItem(itemId);

      const res = await updateCartItemAPI(itemId, qty);

      setCart(res.data.cart);
      setCartCount(res.data.cart.totalQuantity);
    } catch (err) {
      alert("Failed to update cart");
    } finally {
      setUpdatingItem(null);
    }
  };

  // 🔹 Remove Item
  const removeItem = async (itemId) => {
    try {
      setUpdatingItem(itemId);

      const res = await removeCartItemAPI(itemId);

      setCart(res.data.cart);
      setCartCount(res.data.cart.totalQuantity);
    } catch (err) {
      alert("Failed to remove item");
    } finally {
      setUpdatingItem(null);
    }
  };

  if (loading) {
    return <p className="text-center mt-20">Loading cart...</p>;
  }

  if (!cart || cart.items.length === 0) {
    return <p className="text-center mt-20">🛒 Cart is empty</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cart.items.map((item) => (
        <div
          key={item._id}
          className="flex items-center justify-between border-b py-4"
        >
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <img
              src={
                item.product?.mainImage || "/placeholder.png"
              }
              alt={item.product?.name || "product"}
              className="w-20 h-20 object-cover rounded"
              onError={(e) => {
                e.target.src = "/placeholder.png";
              }}
            />

            <div>
              <h3 className="font-semibold">{item.product?.name}</h3>
              <p className="text-sm text-gray-600">₹{item.price}</p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateQty(item._id, item.quantity - 1)}
              className="px-2 border"
            >
              −
            </button>

            <span>{item.quantity}</span>

            <button
              onClick={() => updateQty(item._id, item.quantity + 1)}
              className="px-2 border"
            >
              +
            </button>

            <button
              onClick={() => removeItem(item._id)}
              className="text-red-600 ml-4"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="text-right mt-6">
        <p className="text-lg font-semibold">Total: ₹{cart.totalPrice}</p>

        <button
          onClick={() => navigate("/address")}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartView;
