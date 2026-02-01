import api from "./api";

export const addToCart = async (productId, quantity = 1) => {
  try {
    const { data } = await api.post("/cart", { productId, quantity });
    return data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Please login to add items to cart");
    }
    throw error;
  }
};
