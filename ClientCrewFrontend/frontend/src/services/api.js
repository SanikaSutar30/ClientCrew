import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Login API
export const loginUser = (loginData) => {
  return api.post("/api/auth/login", loginData);
};

// Register API
export const registerUser = (registerData) => {
  return api.post("/api/auth/register", registerData);
};

// Logout API
export const logoutUser = async () => {
  const response = await api.post("/api/auth/logout");
  return response.data;
};

export default api;
