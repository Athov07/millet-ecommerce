import api from "./api";

/* CREATE PRODUCT */
export const createProductAPI = (data) =>
  api.post("/products", data);

/* GET ALL PRODUCTS */
export const getAllProductsAPI = () =>
  api.get("/products");

/* DELETE PRODUCT */
export const deleteProductAPI = (id) =>
  api.delete(`/products/${id}`);
