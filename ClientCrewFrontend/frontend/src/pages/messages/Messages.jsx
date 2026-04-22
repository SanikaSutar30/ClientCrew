import { useState, useRef, useEffect } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import { Search, Send, Plus, Pencil, Trash2 } from "lucide-react";
import { ConfirmationModal } from "../../components/layout";

const initialChats = [
  {
    id: 1,
    name: "Rahul Sharma",
    lastMessage: "Project update?",
    time: "2 min ago",
    avatar: "../assets/Profile.jpg",
    online: true,
    unreadCount: 2,
    messages: [
      { id: 1, sender: "them", text: "Hello 👋", time: "10:00 AM" },
      { id: 2, sender: "me", text: "Hi! How can I help?", time: "10:02 AM" },
    ],
  },
  {
    id: 2,
    name: "Priya Singh",
    lastMessage: "Meeting at 4 PM",
    time: "10 min ago",
    avatar: "../assets/Profile2.jpg",
    online: false,
    unreadCount: 0,
    messages: [
      { id: 1, sender: "them", text: "Meeting at 4 PM", time: "11:10 AM" },
      { id: 2, sender: "me", text: "Okay, noted.", time: "11:12 AM" },
    ],
  },
  {
    id: 3,
    name: "Biplab Roy",
    lastMessage: "Sounds good! Let's schedule...",
    time: "2h ago",
    avatar: "../assets/Profile3.jpg",
    online: true,
    unreadCount: 1,
    messages: [
      {
        id: 1,
        sender: "them",
        text: "Sounds good! Let's schedule...",
        time: "09:30 AM",
      },
      {
        id: 2,
        sender: "me",
        text: "Sure, I’ll check the calendar.",
        time: "09:35 AM",
      },
    ],
  },
  {
    id: 4,
    name: "John Doe",
    lastMessage: "Please send latest report",
    time: "4h ago",
    avatar: "../assets/Profile4.jpg",
    online: false,
    unreadCount: 3,
    messages: [
      {
        id: 1,
        sender: "them",
        text: "Please send latest report",
        time: "08:00 AM",
      },
      {
        id: 2,
        sender: "me",
        text: "I’ll send it shortly.",
        time: "08:05 AM",
      },
    ],
  },
  {
    id: 5,
    name: "Sneha Patil",
    lastMessage: "",
    time: "",
    avatar: "../assets/Profile5.jpg",
    online: true,
    unreadCount: 0,
    messages: [],
  },
];
export default function Messages() {
  const { darkMode } = useOutletContext();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const [isEditingChatName, setIsEditingChatName] = useState(false);
const [chatNameInput, setChatNameInput] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Chats in state (IMPORTANT)
  const [chats, setChats] = useState(() => {
    const passedChatName = location.state?.selectedChat?.name;

    return initialChats.map((chat) =>
      chat.name === passedChatName
        ? {
            ...chat,
            unreadCount: 0,
          }
        : chat,
    );
  });
  const [selectedChatId, setSelectedChatId] = useState(() => {
    const passedChatName = location.state?.selectedChat?.name;
    return (
      initialChats.find((chat) => chat.name === passedChatName)?.id || null
    );
  });
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Derive selectedChat from location.state (for Topbar navigation) or manual selection
  const effectiveSelectedChat =
    chats.find((chat) => chat.id === selectedChatId) || null;

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [effectiveSelectedChat?.messages]);

  // Select chat manually
  const handleSelectChat = (chat) => {
    setSelectedChatId(chat.id);

    setChats((prevChats) =>
      prevChats.map((item) =>
        item.id === chat.id
          ? {
              ...item,
              unreadCount: 0,
            }
          : item,
      ),
    );
  };
  // Send message (WORKING)
  const handleSendMessage = () => {
    if (!messageInput.trim() || !effectiveSelectedChat) return;

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === effectiveSelectedChat.id
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: messageInput.trim(),
              time: "Just now",
            }
          : chat,
      ),
    );

    setMessageInput("");
  };

 const handleNewChat = () => {
   const newChat = {
     id: Date.now(),
     name: "New Contact",
     lastMessage: "",
     time: "",
     avatar: "../assets/Profile5.jpg",
     online: false,
     unreadCount: 0,
     messages: [],
   };

   setChats((prevChats) => [newChat, ...prevChats]);
   setSelectedChatId(newChat.id);
   setSearchTerm("");
   setChatNameInput("New Contact");
   setIsEditingChatName(true);
  };
  

const handleSaveChatName = () => {
  if (!effectiveSelectedChat) {
    setIsEditingChatName(false);
    setChatNameInput("");
    return;
  }

  if (!chatNameInput.trim()) {
    setChatNameInput(effectiveSelectedChat.name);
    setIsEditingChatName(false);
    return;
  }

  setChats((prevChats) =>
    prevChats.map((chat) =>
      chat.id === effectiveSelectedChat.id
        ? {
            ...chat,
            name: chatNameInput.trim(),
          }
        : chat,
    ),
  );

  setIsEditingChatName(false);
};


  const handleCancelChatNameEdit = () => {
    if (effectiveSelectedChat) {
      setChatNameInput(effectiveSelectedChat.name);
    } else {
      setChatNameInput("");
    }

    setIsEditingChatName(false);
  };
 const handleDeleteChat = () => {
   setShowDeleteModal(true);
  };
  

  const confirmDeleteChat = () => {
    if (!effectiveSelectedChat) return;

    const updatedChats = chats.filter(
      (chat) => chat.id !== effectiveSelectedChat.id,
    );

    setChats(updatedChats);

    if (updatedChats.length > 0) {
      setSelectedChatId(updatedChats[0].id);
    } else {
      setSelectedChatId(null);
    }

    setIsEditingChatName(false);
    setChatNameInput("");
    setShowDeleteModal(false);
  };


  return (
    <div className="h-[calc(100vh-80px)] flex gap-4">
      <ConfirmationModal
        darkMode={darkMode}
        isOpen={showDeleteModal}
        type="danger"
        title="Delete Chat"
        message={`Are you sure you want to delete the chat with "${effectiveSelectedChat?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteChat}
        onCancel={() => setShowDeleteModal(false)}
      />
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

          <button
            onClick={handleNewChat}
            className="bg-[#0f766e] text-white p-2 rounded-lg cursor-pointer hover:opacity-90"
            title="New Chat"
          >
            <Plus size={16} />
          </button>
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
            placeholder="Search chats..."
            className={`ml-2 bg-transparent outline-none w-full text-sm ${
              darkMode
                ? "text-white placeholder:text-gray-400"
                : "text-black placeholder:text-gray-500"
            }`}
          />
        </div>

        {/* Chat List */}
        <div className="space-y-3">
          {filteredChats.length === 0 ? (
            <div className="text-sm text-gray-400 text-center py-6">
              No chats found
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
                  effectiveSelectedChat?.id === chat.id
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
                    {chat.lastMessage?.trim()
                      ? chat.lastMessage
                      : "No message yet"}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs">
                    {chat.time?.trim() ? chat.time : "--"}
                  </span>

                  {chat.unreadCount > 0 && (
                    <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#0f766e] text-white text-[11px] flex items-center justify-center">
                      {chat.unreadCount}
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
        {!effectiveSelectedChat ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-lg font-semibold mb-2">No chat selected</p>
            <p className="text-sm">Choose a conversation or start a new one</p>
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
                src={effectiveSelectedChat.avatar}
                alt={effectiveSelectedChat.name}
                className="w-10 h-10 rounded-full object-cover object-top"
              />
              <div className="flex items-start justify-between w-full">
                <div>
                  {isEditingChatName ? (
                    <input
                      value={chatNameInput}
                      onChange={(e) => setChatNameInput(e.target.value)}
                      onBlur={handleSaveChatName}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveChatName();
                        if (e.key === "Escape") handleCancelChatNameEdit();
                      }}
                      autoFocus
                      className={`px-2 py-1 rounded-md outline-none text-sm font-semibold ${
                        darkMode
                          ? "bg-gray-700 text-white"
                          : "bg-gray-100 text-black"
                      }`}
                    />
                  ) : (
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => {
                        setChatNameInput(effectiveSelectedChat.name);
                        setIsEditingChatName(true);
                      }}
                    >
                      <p className="font-semibold">
                        {effectiveSelectedChat.name}
                      </p>
                      <Pencil size={14} className="text-gray-400" />
                    </div>
                  )}

                  <p
                    className={`text-xs ${
                      effectiveSelectedChat.online
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  >
                    ● {effectiveSelectedChat.online ? "Online" : "Offline"}
                  </p>
                </div>

                <button
                  onClick={handleDeleteChat}
                  className="p-2 rounded-lg hover:bg-red-100 text-red-500 cursor-pointer"
                  title="Delete Chat"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto">
              {effectiveSelectedChat.messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  No messages yet. Start the conversation.
                </div>
              ) : (
                <div className="space-y-4">
                  {effectiveSelectedChat.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-xs ${
                        msg.sender === "me"
                          ? "ml-auto items-end"
                          : "items-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-xl ${
                          msg.sender === "me"
                            ? "bg-[#0f766e] text-white"
                            : darkMode
                              ? "bg-gray-700 text-white"
                              : "bg-gray-200 text-black"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                      </div>

                      <span
                        className={`text-[10px] mt-1 ${
                          msg.sender === "me"
                            ? "text-gray-300"
                            : "text-gray-400"
                        }`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  ))}

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
