import api from "./api";

export const getCustomers = async () => {
  const response = await api.get("/api/customers");
  return response.data;
};

export const addCustomer = async (customerData) => {
  const response = await api.post("/api/customers", customerData);
  return response.data;
};

export const updateCustomer = async (customerId, customerData) => {
  const response = await api.put(`/api/customers/${customerId}`, customerData);
  return response.data;
};

export const deleteCustomer = async (customerId) => {
  const response = await api.delete(`/api/customers/${customerId}`);
  return response.data;
};
