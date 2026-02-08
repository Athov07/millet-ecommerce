import { useEffect, useState } from "react";
import {
  getAllOrdersAPI,
  shipOrderAPI,
  deliverOrderAPI,
} from "../../services/adminOrderService";

const statusBadge = (status) => {
  const base = "px-3 py-1 rounded-full text-xs font-medium capitalize";

  switch (status) {
    case "paid":
      return `${base} bg-success/10 text-success`;
    case "shipped":
      return `${base} bg-info/10 text-info`;
    case "delivered":
      return `${base} bg-success text-white`;
    case "cancelled":
      return `${base} bg-error/10 text-error`;
    default:
      return `${base} bg-warning/10 text-warning`;
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrdersAPI();
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleShip = async (id) => {
    await shipOrderAPI(id);
    fetchOrders();
  };

  const handleDeliver = async (id) => {
    await deliverOrderAPI(id);
    fetchOrders();
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading orders...</p>;
  }

  return (
    <div className="bg-card p-6 rounded-xl shadow space-y-6">
      <h2 className="text-xl font-semibold">Orders</h2>

      {orders.length === 0 && (
        <p className="text-gray-500">No orders found</p>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg p-4 space-y-4"
          >
            {/* HEADER */}
            <div className="flex justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium">{order._id}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className={statusBadge(order.status)}>
                  {order.status}
                </span>
                <span className="text-sm text-gray-500">
                  ₹{order.totalPrice}
                </span>
              </div>
            </div>

            {/* USER */}
            <div className="text-sm text-gray-600">
              <p>
                <strong>User:</strong> {order.user?.name}
              </p>
              <p>
                <strong>Phone:</strong> {order.user?.phone}
              </p>
            </div>

            {/* PRODUCTS */}
<div className="divide-y">
  {order.items.map((item) => (
    <div
      key={item._id}
      className="grid grid-cols-4 gap-4 py-3 text-sm items-center"
    >
      {/* PRODUCT NAME */}<span>Product<p className="font-medium">
        {item.product?.name || "Product removed"}
      </p></span>
      

      {/* UNIT PRICE */}<span>Price<p className="text-gray-600">
        ₹{item.price}
      </p></span>
      

      {/* QUANTITY */}<span className="text-center">Qty<p className="text-center">
        {item.quantity}
      </p></span>
      

      {/* TOTAL */}<span className="text-right">Total<p className="font-semibold text-right">
        ₹{item.price * item.quantity}
      </p></span>
      
    </div>
  ))}
</div>


            {/* ACTIONS */}
            <div className="flex gap-3 justify-end">
              {order.status === "paid" && (
                <button
                  onClick={() => handleShip(order._id)}
                  className="px-4 py-2 text-sm rounded bg-info text-white hover:opacity-90"
                >
                  Ship
                </button>
              )}

              {order.status === "shipped" && (
                <button
                  onClick={() => handleDeliver(order._id)}
                  className="px-4 py-2 text-sm rounded bg-success text-white hover:opacity-90"
                >
                  Deliver
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
