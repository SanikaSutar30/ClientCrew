import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/dashboard";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getDashboardData = async (filter = "THIS_MONTH") => {
  const response = await axios.get(
    `${API_BASE_URL}?filter=${filter}`,
    getAuthHeaders(),
  );
  return response.data;
};
