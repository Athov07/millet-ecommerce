import { useEffect, useState } from "react";
import { getMyOrdersAPI } from "../../services/orderService";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrdersAPI();
        setOrders(res.data.orders);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-20">Loading orders...</p>;

  if (orders.length === 0)
    return <p className="text-center mt-20">No orders found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.map((order) => (
        <div key={order._id} className="border p-4 rounded mb-4">
          <p className="font-semibold">Order ID: {order._id}</p>
          <p>Status: {order.status}</p>
          <p>Payment: {order.paymentStatus}</p>
          <p>Total: ₹{order.totalPrice}</p>
        </div>
      ))}
    </div>
  );
};

export default MyOrdersPage;
