import { useState } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import { Search, Send } from "lucide-react";

export default function Messages() {
  const { darkMode } = useOutletContext();
  const location = useLocation();

  const chats = [
    {
      id: 1,
      name: "Rahul Sharma",
      lastMessage: "Project update?",
      time: "2 min ago",
      avatar: "../assets/Profile.jpg",
      messages: [
        { id: 1, sender: "them", text: "Hello 👋" },
        { id: 2, sender: "me", text: "Hi! How can I help?" },
      ],
    },
    {
      id: 2,
      name: "Priya Singh",
      lastMessage: "Meeting at 4 PM",
      time: "10 min ago",
      avatar: "../assets/Profile2.jpg",
      messages: [
        { id: 1, sender: "them", text: "Meeting at 4 PM" },
        { id: 2, sender: "me", text: "Okay, noted." },
      ],
    },
    {
      id: 3,
      name: "Biplab Roy",
      lastMessage: "Sounds good! Let's schedule...",
      time: "2h ago",
      avatar: "../assets/Profile3.jpg",
      messages: [
        { id: 1, sender: "them", text: "Sounds good! Let's schedule..." },
        { id: 2, sender: "me", text: "Sure, I’ll check the calendar." },
      ],
    },
    {
      id: 4,
      name: "John Doe",
      lastMessage: "Please send latest report",
      time: "4h ago",
      avatar: "../assets/Profile4.jpg",
      messages: [
        { id: 1, sender: "them", text: "Please send latest report" },
        { id: 2, sender: "me", text: "I’ll send it shortly." },
      ],
    },
  ];

  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");

  // Derive selectedChat from location.state directly instead of using useEffect
  const passedChat = location.state?.selectedChat;
  const initialSelectedChat = passedChat
    ? chats.find((chat) => chat.name === passedChat.name) || null
    : null;

  // Only set initial state once when component mounts
  useState(() => {
    if (initialSelectedChat) {
      setSelectedChat(initialSelectedChat);
    }
  });

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    setMessageInput("");
  };

  return (
    <div className="h-[calc(100vh-80px)] flex gap-4">
      {/* LEFT: Chat List */}
      <div
        className={`w-[320px] rounded-2xl p-4 ${
          darkMode
            ? "bg-gray-800 border border-gray-700 text-white"
            : "bg-white border border-gray-200 text-black"
        }`}
      >
        <h2 className="text-lg font-semibold mb-4">Messages</h2>

        <div
          className={`flex items-center px-3 py-2 rounded-lg mb-4 ${
            darkMode ? "bg-gray-700" : "bg-gray-100"
          }`}
        >
          <Search size={16} className="text-gray-400" />
          <input
            placeholder="Search chats..."
            className={`ml-2 bg-transparent outline-none w-full text-sm ${
              darkMode
                ? "text-white placeholder:text-gray-400"
                : "text-black placeholder:text-gray-500"
            }`}
          />
        </div>

        <div className="space-y-3">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                selectedChat?.id === chat.id
                  ? "bg-[#0f766e] text-white"
                  : darkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-100"
              }`}
            >
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-10 h-10 rounded-full object-cover object-top"
              />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{chat.name}</p>
                <p className="text-xs opacity-70 truncate">
                  {chat.lastMessage}
                </p>
              </div>

              <span className="text-xs shrink-0">{chat.time}</span>
            </div>
          ))}
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
        {!selectedChat ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a chat to start messaging
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
                src={selectedChat.avatar}
                alt={selectedChat.name}
                className="w-10 h-10 rounded-full object-cover object-top"
              />
              <div>
                <p className="font-semibold">{selectedChat.name}</p>
                <p className="text-xs text-green-500">● Online</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {selectedChat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-xs px-4 py-2 rounded-xl ${
                    msg.sender === "me"
                      ? "ml-auto bg-[#0f766e] text-white"
                      : darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
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
                placeholder="Type a message..."
                className={`flex-1 px-4 py-2 rounded-xl outline-none ${
                  darkMode
                    ? "bg-gray-700 text-white placeholder:text-gray-400"
                    : "bg-gray-100 text-black placeholder:text-gray-500"
                }`}
              />

              <button
                onClick={handleSendMessage}
                className="bg-[#0f766e] text-white p-2 rounded-xl cursor-pointer hover:opacity-90"
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
