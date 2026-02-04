import api from "./api";

// STEP 1: Create MOCK payment
export const createCardPaymentAPI = (cardData) =>
  api.post("/payments/card", cardData);

// STEP 2: Create Razorpay order
export const createRazorpayPaymentAPI = (orderId) => {
  return api.post("/payments/razorpay/create", { orderId });
};

// STEP 3: Verify Razorpay payment
export const verifyRazorpayPaymentAPI = (paymentId) => {
  return api.post("/payments/razorpay/verify", { paymentId });
};

// Download invoice
export const downloadInvoiceAPI = (orderId) => {
  return api.get(`/invoice/${orderId}`, {
    responseType: "blob",
  });
};
