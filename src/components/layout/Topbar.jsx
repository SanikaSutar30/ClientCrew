import { Search, Bell, MessageCircle, Moon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Topbar({ darkMode, setDarkMode, notifications, setNotifications }) {
  const navigate = useNavigate();

  // Dropdown states
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  // Refs for outside click
  const messageRef = useRef(null);
  const notificationRef = useRef(null);

  // Unread notification count
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (messageRef.current && !messageRef.current.contains(event.target)) {
        setShowMessages(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mark one notification as read and navigate
  const handleNotificationClick = (item) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)),
    );

    setShowNotifications(false);

    if (item.link) {
      navigate(item.link);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        isRead: true,
      })),
    );
  };

  // Icon by notification type
  const renderTypeIcon = (type) => {
    switch (type) {
      case "security":
        return "🛡️";
      case "report":
        return "📄";
      case "login":
        return "🔑";
      case "customer":
        return "👤";
      default:
        return "🔔";
    }
  };

  return (
    <div
      className={`h-16 flex items-center justify-between px-6 ${
        darkMode ? "bg-gray-800 text-black" : "bg-gray-100 text-black"
      }`}
    >
      {/* Left: Search */}
      <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm w-72">
        <Search size={16} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search customers, projects, rep..."
          className="bg-transparent outline-none ml-2 w-full text-sm text-gray-700 placeholder:text-gray-400"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Messages */}
        <div className="relative" ref={messageRef}>
          <div
            onClick={() => {
              setShowMessages((prev) => !prev);
              setShowNotifications(false);
            }}
            className="bg-white p-2 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
          >
            <MessageCircle size={18} />
          </div>

          {showMessages && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-3 z-50">
              <p className="text-sm font-semibold mb-2 text-gray-800">
                Messages
              </p>
              <p className="text-sm text-gray-600">No new messages</p>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <div
            onClick={() => {
              setShowNotifications((prev) => !prev);
              setShowMessages(false);
            }}
            className="relative bg-white p-2 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
          >
            <Bell size={18} />

            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[10px] min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </div>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg z-50 overflow-hidden border border-gray-200">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-800">
                  Notifications
                </p>

                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs font-medium text-[#0f766e] hover:underline cursor-pointer"
                >
                  Mark all as read
                </button>
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500 px-4 py-6 text-center">
                    No notifications
                  </p>
                ) : (
                  notifications.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className="flex items-start justify-between gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-sm">
                          {renderTypeIcon(item.type)}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm text-gray-800 truncate">
                            {item.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.time}
                          </p>
                        </div>
                      </div>

                      {!item.isRead && (
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-2 shrink-0"></span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate("/notifications");
                  }}
                  className="text-sm font-medium text-[#0f766e] hover:underline cursor-pointer"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dark mode */}
        <div
          onClick={() => setDarkMode(!darkMode)}
          className="bg-white p-2 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
        >
          <Moon size={18} />
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 min-w-[180px]">
          <div className="w-9 h-9 bg-gray-300 rounded-full"></div>

          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-gray-800">
              Admin Name
            </span>
            <span className="text-xs text-gray-500">Administrator</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
