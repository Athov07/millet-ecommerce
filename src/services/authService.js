import axios from "axios";

const API = "http://localhost:5000/api/v1/auth";

const USER_API = "http://localhost:5000/api/v1/user";

export const registerAPI = (data) =>
  axios.post(`${API}/register`, data);

export const verifyOtpAPI = (data) =>
  axios.post(`${API}/verify-otp`, data);

export const loginAPI = (data) =>
  axios.post(`${API}/login`, data);

export const sendResetOtp = (data) =>
  axios.post(`${API}/forgot-password`, data);

export const resetPassword = (data) =>
  axios.post(`${API}/reset-password`, data);

export const getProfile = () => {
  return api.get("/user/profile");};

export const updateProfileImageAPI = (formData) =>
  axios.put(`${USER_API}/avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  export const updateProfileInfoAPI = (data) =>
  axios.put("http://localhost:5000/api/v1/user/profile", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });