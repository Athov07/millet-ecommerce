import api from "./api";

export const getAddressesAPI = () =>
  api.get("/user/address");

export const addAddressAPI = (data) =>
  api.post("/user/address", data);
