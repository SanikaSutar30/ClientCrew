import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/tasks";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllTasks = async () => {
  const response = await axios.get(API_BASE_URL, getAuthHeaders());
  return response.data;
};

export const getTaskById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`, getAuthHeaders());
  return response.data;
};

export const addTask = async (taskData) => {
  const response = await axios.post(API_BASE_URL, taskData, getAuthHeaders());
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await axios.put(
    `${API_BASE_URL}/${id}`,
    taskData,
    getAuthHeaders(),
  );
  return response.data;
};

export const updateTaskStatus = async (id, status) => {
  const response = await axios.patch(
    `${API_BASE_URL}/${id}/status`,
    { status },
    getAuthHeaders(),
  );
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(
    `${API_BASE_URL}/${id}`,
    getAuthHeaders(),
  );
  return response.data;
};
