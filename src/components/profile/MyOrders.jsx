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

  // ✅ Fix for Cloudinary images
  const getProductImage = (product) => {
    if (!product || !product.mainImage) return "/placeholder.png";
    // Use the full URL directly from Cloudinary
    return product.mainImage;
  };

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;
  if (!orders.length) return <p className="text-center mt-10">No orders found</p>;

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order._id} className="border rounded-lg p-4 bg-card space-y-4">
          {/* ORDER SUMMARY */}
          <div className="flex flex-wrap justify-between text-sm gap-2">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> ₹{order.totalPrice}</p>
          </div>

          {/* ORDER ITEMS */}
          <div className="space-y-3">
            {order.items?.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 items-center border rounded p-3"
              >
                {/* PRODUCT IMAGE */}
                <img
                  src={getProductImage(item.product)}
                  alt={item.product?.name}
                  className="w-20 h-20 object-cover rounded-lg border bg-gray-100"
                  onError={(e) => { e.target.src = "/placeholder.png"; }}
                />

                {/* PRODUCT INFO */}
                <div className="flex-1 text-sm">
                  <p className="font-medium">
                    {item.product?.name || "Product"}
                  </p>
                  <p className="text-muted">
                    ₹{item.product?.price} × {item.quantity}
                  </p>
                </div>

                {/* ITEM TOTAL */}
                <p className="font-semibold text-sm">
                  ₹{item.product?.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* INVOICE */}
          {order.paymentStatus === "paid" && (
            <button
              onClick={() => handleDownloadInvoice(order._id)}
              className="bg-primary text-white px-4 py-2 rounded hover:opacity-90"
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
