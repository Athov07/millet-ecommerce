import { downloadInvoiceAPI } from "../../services/invoiceService";

const MyOrders = ({ orders = [] }) => {

  if (!orders || orders.length === 0) {
    return <p className="text-center mt-10">No orders found</p>;
  }

  const handleDownloadInvoice = async (orderId) => {
    try {
      const res = await downloadInvoiceAPI(orderId);

      const blob = new Blob([res.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `invoice_${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Invoice download failed");
    }
  };

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order._id} className="border p-4 rounded">
          <p className="font-semibold">Order ID: {order._id}</p>
          <p>Status: {order.status}</p>
          <p>Total: ₹{order.totalPrice}</p>

          {order.paymentStatus === "paid" && (
            <button
              onClick={() => handleDownloadInvoice(order._id)}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
