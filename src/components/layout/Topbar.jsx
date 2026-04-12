import {
  Search,
  Bell,
  MessageCircle,
  Moon,
  User,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoutConfirmModal from "../../pages/LogoutConfirmModal";

function Topbar({ darkMode, setDarkMode, notifications, setNotifications }) {
  const navigate = useNavigate();

  // Dropdown states
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  // Logout modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Refs for outside click
  const messageRef = useRef(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

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

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
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

  const handleProfileOptionClick = (path) => {
    setShowProfileMenu(false);
    navigate(path);
  };

const handleConfirmLogout = () => {
  setShowLogoutModal(false);
  navigate("/register");
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
              setShowProfileMenu(false);
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
              setShowProfileMenu(false);
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
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => {
              setShowProfileMenu((prev) => !prev);
              setShowNotifications(false);
              setShowMessages(false);
            }}
            className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 min-w-[220px]"
          >
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>

            <div className="flex flex-col leading-tight flex-1">
              <span className="text-sm font-semibold text-gray-800">Admin</span>
              <span className="text-xs text-gray-500">Administrator</span>
            </div>

            <ChevronDown
              size={18}
              className={`text-green-600 transition-transform ${
                showProfileMenu ? "rotate-180" : ""
              }`}
            />
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl z-50 border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gray-300 rounded-full"></div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Admin
                    </h3>
                    <p className="text-sm text-gray-500">admin@company.com</p>
                    <p className="text-sm text-green-600 mt-1">● Online</p>
                  </div>
                </div>
              </div>

              {/* Menu */}
              <div className="py-2">
                <button
                  onClick={() => handleProfileOptionClick("/my-profile")}
                  className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-gray-50 text-gray-700 cursor-pointer"
                >
                  <User size={20} />
                  <span className="text-sm font-medium">My Profile</span>
                </button>

                <button
                  onClick={() => handleProfileOptionClick("/settings")}
                  className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-gray-50 text-gray-700 cursor-pointer"
                >
                  <Settings size={20} />
                  <span className="text-sm font-medium">Account Settings</span>
                </button>

                <button
                  onClick={() => handleProfileOptionClick("/notifications")}
                  className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-gray-50 text-gray-700 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Bell size={20} />
                    <span className="text-sm font-medium">Notifications</span>
                  </div>

                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-semibold min-w-[24px] h-6 px-2 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleProfileOptionClick("/help-support")}
                  className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-gray-50 text-gray-700 cursor-pointer"
                >
                  <HelpCircle size={20} />
                  <span className="text-sm font-medium">Help & Support</span>
                </button>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-2">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowLogoutModal(true);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 text-left text-red-500 hover:bg-red-50 rounded-xl cursor-pointer"
                >
                  <LogOut size={20} />
                  <span className="text-sm font-semibold">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showLogoutModal && (
        <LogoutConfirmModal
          darkMode={darkMode}
          setShowLogoutModal={setShowLogoutModal}
          onConfirmLogout={handleConfirmLogout}
        />
      )}
    </div>
  );
}

export default Topbar;
