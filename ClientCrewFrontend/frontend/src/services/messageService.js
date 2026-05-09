import api from "./api";

// Get allowed chat contacts
export const getChatContacts = async () => {
  const response = await api.get("/api/messages/contacts");
  return response.data;
};

// Get conversation
export const getConversation = async (userId) => {
  const response = await api.get(`/api/messages/conversation/${userId}`);

  return response.data;
};

// Send message
export const sendMessage = async (messageData) => {
  const response = await api.post("/api/messages/send", messageData);

  return response.data;
};

// Mark messages as read
export const markMessagesAsRead = async (senderId) => {
  const response = await api.patch(`/api/messages/read/${senderId}`);

  return response.data;
};

// Get unread count
export const getUnreadMessageCount = async () => {
  const response = await api.get("/api/messages/unread-count");

  return response.data;
};

// Get recent messages
export const getRecentMessages = async () => {
  const response = await api.get("/api/messages/recent");

  return response.data;
};
