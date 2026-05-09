import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  const isAuthApi =
    config.url.includes("/auth/login") || config.url.includes("/auth/register");

  if (token && !isAuthApi) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Login API
export const loginUser = (loginData) => {
  return api.post("/auth/login", loginData);
};

// Register API
export const registerUser = (registerData) => {
  return api.post("/auth/register", registerData);
};

// Logout API
export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export default api;
