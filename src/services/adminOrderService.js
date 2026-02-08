import api from "./api";

/* GET ALL ORDERS (ADMIN) */
export const getAllOrdersAPI = () =>
  api.get("/orders");

/* UPDATE ORDER STATUS (ADMIN) */
export const updateOrderStatusAPI = (id, data) =>
  api.put(`/orders/${id}`, data);

/* SHIP ORDER (ADMIN) */
export const shipOrderAPI = (id) =>
  api.patch(`/orders/${id}/ship`);

/* DELIVER ORDER (ADMIN) */
export const deliverOrderAPI = (id) =>
  api.patch(`/orders/${id}/deliver`);

/* CANCEL ORDER (ADMIN / USER) */
export const cancelOrderAPI = (id) =>
  api.post(`/orders/${id}/cancel`);
