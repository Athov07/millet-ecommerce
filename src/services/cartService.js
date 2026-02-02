import api from "./api";

export const addToCartAPI = (productId, quantity = 1) => {
  return api.post("/cart", { productId, quantity });
};

export const getCartAPI = () =>
  api.get("/cart");

export const updateCartItemAPI = (itemId, quantity) =>
  api.put(`/cart/${itemId}`, { quantity });

export const removeCartItemAPI = (itemId) =>
  api.delete(`/cart/${itemId}`);