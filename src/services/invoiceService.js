import api from "./api";

export const downloadInvoiceAPI = (orderId) => {
  return api.get(`/invoices/${orderId}`, {
    responseType: "blob",
  });
};
