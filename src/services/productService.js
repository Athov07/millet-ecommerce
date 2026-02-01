import api from "./api";

const productService = {
  getAllProducts: async () => {
    const { data } = await api.get("/products");
    return data;
  },
};

export default productService;


// import api from "./api";

export const getAllProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};


export const getRelatedProducts = async (id) => {
  const res = await api.get(`/products/${id}/related`);
  return res.data;
};
