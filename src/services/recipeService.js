import api from "./api";

/* ================= ADMIN RECIPES ================= */

/* GET ALL RECIPES */
export const getAllRecipesAPI = () =>
  api.get("/admin/recipes");

/* GET SINGLE RECIPE */
export const getRecipeByIdAPI = (id) =>
  api.get(`/admin/recipes/${id}`);

/* CREATE RECIPE */
export const createRecipeAPI = (data) =>
  api.post("/admin/recipes", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

/* UPDATE RECIPE */
export const updateRecipeAPI = (id, data) =>
  api.put(`/admin/recipes/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

/* DELETE RECIPE */
export const deleteRecipeAPI = (id) =>
  api.delete(`/admin/recipes/${id}`);
