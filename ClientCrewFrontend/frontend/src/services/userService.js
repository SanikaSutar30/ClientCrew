import axios from "axios";

const BASE_URL = "http://localhost:8080/api/users";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllUsers = async () => {
  const response = await axios.get(`${BASE_URL}/all`, getAuthHeaders());
  return response.data;
};
export const addUser = async (userData) => {
  const response = await axios.post(BASE_URL, userData, getAuthHeaders());
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await axios.put(
    `${BASE_URL}/${userId}`,
    userData,
    getAuthHeaders(),
  );

  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axios.delete(
    `${BASE_URL}/${userId}`,
    getAuthHeaders(),
  );
  return response.data;
};
