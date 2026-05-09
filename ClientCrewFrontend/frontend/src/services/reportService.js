import api from "./api";

export const getReportsDashboard = async () => {
  const response = await api.get("/api/reports/dashboard");
  return response.data;
};
