import { useEffect, useState } from "react";
import { getMyOrdersAPI } from "../../services/orderService";
import { CheckCircle, Clock, Truck, XCircle } from "lucide-react";

const ORDER_STEPS = ["pending", "paid", "shipped", "delivered", "cancelled"];

const statusIcon = (status) => {
  switch (status) {
    case "paid":
      return <CheckCircle className="text-success w-5 h-5" />;
    case "shipped":
      return <Truck className="text-info w-5 h-5" />;
    case "delivered":
      return <CheckCircle className="text-success w-5 h-5" />;
    case "cancelled":
      return <XCircle className="text-error w-5 h-5" />;
    default:
      return <Clock className="text-gray-400 w-5 h-5" />;
  }
};

// Updated to use full Cloudinary URL
const getProductImage = (product) => {
  if (!product || !product.mainImage) return "/placeholder.png";
  return product.mainImage; // already full URL from Cloudinary
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrdersAPI();
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading orders...
      </p>
    );
  }

  if (!orders.length) {
    return (
      <p className="text-center text-gray-500 mt-10">
        You have not placed any orders yet.
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-card border rounded-xl shadow-sm p-6"
        >
          {/* ---------- HEADER ---------- */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div>
              <p className="font-semibold text-sm text-gray-600">
                Order ID
              </p>
              <p className="text-sm">{order._id}</p>
            </div>

            <div className="flex items-center gap-2">
              {statusIcon(order.status)}
              <span className="capitalize font-medium">{order.status}</span>
            </div>
          </div>

          {/* ---------- PRODUCTS ---------- */}
          <div className="divide-y">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-6 py-5"
              >
                <img
                  src={getProductImage(item.product)}
                  alt={item.product?.name}
                  className="w-20 h-20 object-cover rounded-lg border bg-gray-100"
                />

                <div className="flex-1">
                  <p className="font-medium text-base">
                    {item.product?.name || "Product removed"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold text-right min-w-[80px]">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* ---------- TIMELINE ---------- */}
          <div className="mt-8">
            <p className="font-semibold mb-4">Order Timeline</p>

            <div className="flex justify-between items-start gap-2">
              {ORDER_STEPS.map((step, index) => {
                const currentIndex = ORDER_STEPS.indexOf(order.status);
                const completed = currentIndex >= index;

                return (
                  <div key={step} className="flex-1 text-center">
                    <div
                      className={`mx-auto w-9 h-9 flex items-center justify-center rounded-full ${
                        completed
                          ? "bg-success text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <p className="text-xs mt-2 capitalize">{step}</p>
                  </div>
                );
              })}
            </div>

            {order.status !== "delivered" &&
              order.status !== "cancelled" && (
                <p className="text-sm text-gray-500 mt-4 text-right">
                  Expected delivery in 3–5 business days
                </p>
              )}
          </div>

          {/* ---------- TOTAL ---------- */}
          <div className="flex justify-end mt-6 border-t pt-4">
            <p className="text-lg font-semibold">Total: ₹{order.totalPrice}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrdersPage;
