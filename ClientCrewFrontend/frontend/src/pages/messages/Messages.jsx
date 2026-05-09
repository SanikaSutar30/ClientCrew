import { useState, useRef, useEffect } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import { Search, Send } from "lucide-react";

import {
  getChatContacts,
  getConversation,
  sendMessage,
  markMessagesAsRead,
} from "../../services/messageService";

export default function Messages() {
  const { darkMode } = useOutletContext();
  const location = useLocation();
  const messagesEndRef = useRef(null);

  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(
    location.state?.selectedChat?.userId || null,
  );
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const loggedInUserEmail = localStorage.getItem("userEmail");

  const selectedContact =
    contacts.find((contact) => contact.userId === selectedContactId) || null;

  const filteredContacts = contacts.filter((contact) =>
    contact.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatTime = (dateValue) => {
    if (!dateValue) return "--";

    return new Date(dateValue).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const loadContacts = async () => {
    try {
      setLoadingContacts(true);
      const data = await getChatContacts();
      setContacts(data);

      if (!selectedContactId && data.length > 0) {
        setSelectedContactId(data[0].userId);
      }
    } catch (error) {
      console.error("Failed to load chat contacts:", error);
    } finally {
      setLoadingContacts(false);
    }
  };

  const loadConversation = async (userId) => {
    if (!userId) return;

    try {
      setLoadingMessages(true);
      const data = await getConversation(userId);
      setMessages(data);

      await markMessagesAsRead(userId);

      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.userId === userId
            ? {
                ...contact,
                unreadCount: 0,
              }
            : contact,
        ),
      );
    } catch (error) {
      console.error("Failed to load conversation:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadContacts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (selectedContactId) {
      loadConversation(selectedContactId);
    }
  }, [selectedContactId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectContact = (contact) => {
    setSelectedContactId(contact.userId);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedContact) return;

    try {
      const savedMessage = await sendMessage({
        receiverId: selectedContact.userId,
        content: messageInput.trim(),
      });

      setMessages((prevMessages) => [...prevMessages, savedMessage]);
      setMessageInput("");

      setContacts((prevContacts) => {
        const updatedContacts = prevContacts.map((contact) =>
          contact.userId === selectedContact.userId
            ? {
                ...contact,
                lastMessage: savedMessage.content,
                lastMessageTime: savedMessage.sentAt,
              }
            : contact,
        );

        const activeContact = updatedContacts.find(
          (contact) => contact.userId === selectedContact.userId,
        );

        return [
          activeContact,
          ...updatedContacts.filter(
            (contact) => contact.userId !== selectedContact.userId,
          ),
        ];
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex gap-4 overflow-hidden">
      {/* LEFT: Chat List */}
      <div
        className={`w-[320px] rounded-2xl p-4 ${
          darkMode
            ? "bg-gray-800 border border-gray-700 text-white"
            : "bg-white border border-gray-200 text-black"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>

        {/* Search */}
        <div
          className={`flex items-center px-3 py-2 rounded-lg mb-4 ${
            darkMode ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          <Search size={16} className="text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contacts..."
            className={`ml-2 bg-transparent outline-none w-full text-sm ${
              darkMode
                ? "text-white placeholder:text-gray-400"
                : "text-black placeholder:text-gray-500"
            }`}
          />
        </div>

        {/* Chat List */}
        <div className="space-y-3 max-h-[calc(100vh-210px)] overflow-y-auto pr-1">
          {loadingContacts ? (
            <div className="text-sm text-gray-400 text-center py-6">
              Loading contacts...
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-sm text-gray-400 text-center py-6">
              No contacts found
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.userId}
                onClick={() => handleSelectContact(contact)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                  selectedContact?.userId === contact.userId
                    ? "bg-[#0f766e] text-white"
                    : darkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-100"
                }`}
              >
                <img
                  src={contact.userImage || "/Profile.jpg"}
                  alt={contact.fullName}
                  className="w-10 h-10 rounded-full object-cover object-top"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {contact.fullName}
                  </p>
                  <p className="text-xs opacity-70 truncate">
                    {contact.lastMessage || contact.role}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  {contact.lastMessageTime && (
                    <span className="text-[10px] opacity-70">
                      {formatTime(contact.lastMessageTime)}
                    </span>
                  )}
                  {contact.unreadCount > 0 && (
                    <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#0f766e] text-white text-[11px] flex items-center justify-center">
                      {contact.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT: Chat Window */}
      <div
        className={`flex-1 rounded-2xl flex flex-col ${
          darkMode
            ? "bg-gray-800 border border-gray-700 text-white"
            : "bg-white border border-gray-200 text-black"
        }`}
      >
        {!selectedContact ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-lg font-semibold mb-2">No chat selected</p>
            <p className="text-sm">Choose a contact to start conversation</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div
              className={`flex items-center gap-3 px-6 py-4 border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <img
                src={selectedContact.userImage || "/Profile.jpg"}
                alt={selectedContact.fullName}
                className="w-10 h-10 rounded-full object-cover object-top"
              />

              <div>
                <p className="font-semibold">{selectedContact.fullName}</p>
                <p className="text-xs text-gray-400">{selectedContact.role}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto min-h-0">
              {loadingMessages ? (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  No messages yet. Start the conversation.
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isMine = msg.senderEmail === loggedInUserEmail;
                    return (
                      <div
                        key={msg.messageId}
                        className={`flex flex-col max-w-xs ${
                          isMine ? "ml-auto items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-2 rounded-xl ${
                            isMine
                              ? "bg-[#0f766e] text-white"
                              : darkMode
                                ? "bg-gray-700 text-white"
                                : "bg-gray-200 text-black"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>

                        <span
                          className={`text-[10px] mt-1 ${
                            isMine ? "text-gray-300" : "text-gray-400"
                          }`}
                        >
                          {formatTime(msg.sentAt)}
                        </span>
                      </div>
                    );
                  })}

                  <div ref={messagesEndRef}></div>
                </div>
              )}
            </div>

            {/* Input */}
            <div
              className={`p-4 border-t flex items-center gap-3 ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && messageInput.trim()) {
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                className={`flex-1 px-4 py-2 rounded-xl outline-none ${
                  darkMode
                    ? "bg-gray-700 text-white placeholder:text-gray-400"
                    : "bg-gray-100 text-black placeholder:text-gray-500"
                }`}
              />

              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className={`p-2 rounded-xl ${
                  messageInput.trim()
                    ? "bg-[#0f766e] text-white cursor-pointer hover:opacity-90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
