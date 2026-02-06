import api from "./api";

export const getAddressesAPI = () =>
  api.get("/user/address");

export const addAddressAPI = (data) =>
  api.post("/user/address", data);

export const updateAddressAPI = (id, data) =>
  api.put(`/user/address/${id}`, data);

export const deleteAddressAPI = (id) =>
  api.delete(`/user/address/${id}`);
