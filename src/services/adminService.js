import api from "./api";

export const getAllUsersAPI = () => {
  return api.get("/admin/users");
};

export const deleteUserAPI = (id) => {
  return api.delete(`/admin/users/${id}`);
};