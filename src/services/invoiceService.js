import api from "./api";

export const downloadInvoiceAPI = (orderId) => {
  return api.get(`/invoice/${orderId}`, {
    responseType: "blob", // IMPORTANT
  });
};
