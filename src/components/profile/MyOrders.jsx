import { useEffect, useState } from "react";
import { getMyOrdersAPI } from "../../services/orderService";
import { downloadInvoiceAPI } from "../../services/invoiceService";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrdersAPI();
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ✅ MUST be inside component
  const handleDownloadInvoice = async (orderId) => {
    try {
      const res = await downloadInvoiceAPI(orderId);

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice_${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download invoice");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;
  if (!orders.length) return <p className="text-center mt-10">No orders found</p>;

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="border p-4 rounded">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ₹{order.totalPrice}</p>

          {order.paymentStatus === "paid" && (
            <button
              onClick={() => handleDownloadInvoice(order._id)}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Download Invoice
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
