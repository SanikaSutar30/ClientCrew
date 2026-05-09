import api from "./api";

export const getActivities = async () => {
  const response = await api.get("/api/activities");
  return response.data;
};

export const markActivityAsRead = async (id) => {
  const response = await api.patch(`/api/activities/${id}/read`);
  return response.data;
};

export const markAllActivitiesAsRead = async () => {
  const response = await api.patch("/api/activities/read-all");
  return response.data;
};
