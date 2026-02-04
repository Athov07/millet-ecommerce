const CheckoutSummary = ({
  address,
  cart,
  preview,
  onPlaceOrder,
  placingOrder
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Order Summary</h1>

      {/* ADDRESS */}
      {address && (
  <div className="border p-4 rounded mb-6">
    <h2 className="font-semibold mb-2">Delivery Address</h2>
    <p>{address.fullName}</p>
    <p>{address.street}</p>
    <p>
      {address.city}, {address.state} - {address.pincode}
    </p>
    <p>{address.country}</p>
    <p className="mt-2">📞 {address.phone}</p>
  </div>
)}

      {/* CART ITEMS */}
      <div className="border p-4 rounded mb-6">
        <h2 className="font-semibold mb-4">Products</h2>
        {cart.items.map((item) => (
          <div key={item._id} className="flex justify-between py-2 border-b">
            <div>
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-600">
                ₹{item.price} × {item.quantity}
              </p>
            </div>
            <p className="font-semibold">
              ₹{item.price * item.quantity}
            </p>
          </div>
        ))}
      </div>

      {/* PRICE BREAKUP */}
      {preview && (
        <div className="border p-4 rounded mb-6">
          <div className="flex justify-between mb-2">
            <span>Items Total</span>
            <span>₹{preview.subtotal}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Delivery Charges</span>
            <span>₹{preview.deliveryCharge}</span>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Grand Total</span>
            <span>₹{preview.totalPrice}</span>
          </div>
        </div>
      )}

      <button
        onClick={onPlaceOrder}
        disabled={placingOrder}
        className="bg-green-600 text-white px-6 py-3 rounded w-full hover:bg-green-700 disabled:opacity-60"
      >
        {placingOrder ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default CheckoutSummary;
