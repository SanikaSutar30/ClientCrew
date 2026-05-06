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
  ShieldCheck,
  FileText,
  Key,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoutConfirmModal from "../../pages/LogoutConfirmModal";

function Topbar({
  darkMode,
  setDarkMode,
  notifications,
  setNotifications,
  userRole,
}) {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");
  const roleLabelMap = {
    Admin: "Administrator",
    Manager: "Manager",
    Employee: "Employee",
    Customer: "Customer",
  };

  const displayName = userName || userRole || "User";
  const displayEmail = userEmail || "user@clientcrew.com";
  const displayRole = roleLabelMap[userRole] || userRole || "User";

  const isAdmin = userRole === "Admin";
  const canAccessMessages = [
    "Admin",
    "Manager",
    "Employee",
    "Customer",
  ].includes(userRole);
  const canAccessNotifications = [
    "Admin",
    "Manager",
    "Employee",
    "Customer",
  ].includes(userRole);
  const canAccessProfile = [
    "Admin",
    "Manager",
    "Employee",
    "Customer",
  ].includes(userRole);
  const canAccessHelp = ["Admin", "Manager", "Employee", "Customer"].includes(
    userRole,
  );
  const canAccessSettings = isAdmin;

  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const messageRef = useRef(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

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

  const handleNotificationClick = (item) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)),
    );

    setShowNotifications(false);

    if (item.link) {
      navigate(item.link);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        isRead: true,
      })),
    );
  };

  const handleMessageClick = (msg) => {
    setShowMessages(false);
    navigate("/messages", { state: { selectedChat: msg } });
  };

  const typeIcons = {
    security: <ShieldCheck size={16} />,
    report: <FileText size={16} />,
    login: <Key size={16} />,
    customer: <User size={16} />,
  };

  const renderTypeIcon = (type) => typeIcons[type] || <Bell size={16} />;

  const handleProfileOptionClick = (path) => {
    setShowProfileMenu(false);
    navigate(path);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div
      className={`h-16 w-full shrink-0 flex items-center justify-between px-6 ${
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
        {canAccessMessages && (
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
                <div className="space-y-3">
                  {[
                    {
                      name: "Biplab Roy",
                      message: "Sounds good! Let's schedule...",
                      time: "2h ago",
                      unread: 2,
                    },
                    {
                      name: "John Doe",
                      message: "Please send latest report",
                      time: "4h ago",
                      unread: 1,
                    },
                  ].map((msg, index) => (
                    <div
                      key={index}
                      onClick={() => handleMessageClick(msg)}
                      className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-300"></div>

                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {msg.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate w-32">
                            {msg.message}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-400">{msg.time}</p>

                        {msg.unread > 0 && (
                          <span className="bg-[#0f766e] text-white text-xs px-2 py-0.5 rounded-full">
                            {msg.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      setShowMessages(false);
                      navigate("/messages");
                    }}
                    className="w-full text-sm text-[#0f766e] font-medium  cursor-pointer hover:underline mt-2"
                  >
                    See all messages
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notifications */}
        {canAccessNotifications && (
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
        )}

        {/* Dark mode */}
        <div
          onClick={() => setDarkMode(!darkMode)}
          className="bg-white p-2 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
        >
          <Moon size={18} />
        </div>

        {/* Profile */}
        {canAccessProfile && (
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
                <span className="text-sm font-semibold text-gray-800 capitalize">
                  {displayName}
                </span>
                <span className="text-xs text-gray-500">{displayRole}</span>
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
                <div className="px-5 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gray-300 rounded-full"></div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 capitalize">
                        {displayName}
                      </h3>
                      <p className="text-sm text-gray-500">{displayEmail}</p>
                      <p className="text-sm text-green-600 mt-1">● Online</p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <button
                    onClick={() => handleProfileOptionClick("/my-profile")}
                    className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-gray-50 text-gray-700 cursor-pointer"
                  >
                    <User size={20} />
                    <span className="text-sm font-medium">My Profile</span>
                  </button>

                  {canAccessSettings && (
                    <button
                      onClick={() => handleProfileOptionClick("/settings")}
                      className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-gray-50 text-gray-700 cursor-pointer"
                    >
                      <Settings size={20} />
                      <span className="text-sm font-medium">
                        Account Settings
                      </span>
                    </button>
                  )}

                  {canAccessNotifications && (
                    <button
                      onClick={() => handleProfileOptionClick("/notifications")}
                      className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-gray-50 text-gray-700 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Bell size={20} />
                        <span className="text-sm font-medium">
                          Notifications
                        </span>
                      </div>

                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-semibold min-w-[24px] h-6 px-2 rounded-full flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  )}

                  {canAccessHelp && (
                    <button
                      onClick={() => handleProfileOptionClick("/help-support")}
                      className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-gray-50 text-gray-700 cursor-pointer"
                    >
                      <HelpCircle size={20} />
                      <span className="text-sm font-medium">
                        Help & Support
                      </span>
                    </button>
                  )}
                </div>

                <div className="border-t border-gray-200 p-2">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowLogoutModal(true);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 text-left text-red-500 hover:bg-red-50 rounded-xl "
                  >
                    <LogOut size={20} />
                    <span className="text-sm font-semibold">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
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
