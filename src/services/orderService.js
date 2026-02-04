import api from "./api";

export const createOrderAPI = (orderData) => {
  return api.post("/orders", orderData);
};

export const getMyOrdersAPI = () => {
  return api.get("/orders/my-orders");
};

export const previewOrderAPI = () => {
  return api.get("/orders/preview");
};