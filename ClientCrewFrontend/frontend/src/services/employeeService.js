import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/employees";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getEmployees = async () => {
  const response = await axios.get(API_BASE_URL, getAuthHeaders());
  return response.data;
};

export const addEmployee = async (employeeData) => {
  const response = await axios.post(
    API_BASE_URL,
    employeeData,
    getAuthHeaders(),
  );
  return response.data;
};

export const updateEmployee = async (userId, employeeData) => {
  const response = await axios.put(
    `${API_BASE_URL}/${userId}`,
    employeeData,
    getAuthHeaders(),
  );
  return response.data;
};

export const deleteEmployee = async (userId) => {
  const response = await axios.delete(
    `${API_BASE_URL}/${userId}`,
    getAuthHeaders(),
  );
  return response.data;
};
