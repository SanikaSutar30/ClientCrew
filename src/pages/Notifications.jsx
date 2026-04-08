import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { User, FileText, Shield, LogIn } from "lucide-react";

export default function Notifications() {
  const { darkMode } = useOutletContext();

  const [activeTab, setActiveTab] = useState("all");

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Neha Verma has been added as a new customer.",
      time: "3m ago",
      isRead: false,
      type: "customer",
      image: "../assets/Profile5.jpg",
    },
    {
      id: 2,
      message: "Your password was changed successfully.",
      time: "15m ago",
      isRead: false,
      type: "security",
    },
    {
      id: 3,
      message: "Weekly performance report is now available.",
      time: "1h ago",
      isRead: true,
      type: "report",
    },
    {
      id: 4,
      message: "Amit Patil updated customer contact information.",
      time: "2h ago",
      isRead: false,
      type: "customer",
      image: "../assets/Profile2.jpg",
    },
    {
      id: 5,
      message: "New login detected from Chrome on Windows.",
      time: "5h ago",
      isRead: true,
      type: "login",
    },
  ]);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter((item) => !item.isRead)
      : notifications;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        isRead: true,
      })),
    );
  };

  const renderIcon = (type) => {
    switch (type) {
      case "security":
        return <Shield size={18} />;
      case "report":
        return <FileText size={18} />;
      case "login":
        return <LogIn size={18} />;
      default:
        return <User size={18} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Notifications
        </h1>
        <p
          className={`text-sm mt-1 ${
            darkMode ? "text-gray-300" : "text-gray-500"
          }`}
        >
          Stay updated with customer activity, project updates, and system
          alerts
        </p>
      </div>

      {/* Main notification card */}
      <div
        className={`rounded-2xl shadow-sm overflow-hidden ${
          darkMode
            ? "bg-gray-700 border border-gray-600"
            : "bg-white border border-gray-200"
        }`}
      >
        {/* Top tabs row */}
        <div
          className={`flex items-center justify-between px-6 py-2 border-b ${
            darkMode
              ? "bg-gray-800 border-gray-600"
              : "bg-gray-100 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-2 text-sm border-b-2 cursor-pointer transition ${
                activeTab === "all"
                  ? darkMode
                    ? "text-white font-semibold border-[#0f766e]"
                    : "text-black font-semibold border-[#0f766e]"
                  : darkMode
                    ? "text-gray-300 font-medium border-transparent"
                    : "text-gray-500 font-medium border-transparent"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setActiveTab("unread")}
              className={`pb-2 text-sm border-b-2 cursor-pointer transition ${
                activeTab === "unread"
                  ? darkMode
                    ? "text-white font-semibold border-[#0f766e]"
                    : "text-black font-semibold border-[#0f766e]"
                  : darkMode
                    ? "text-gray-300 font-medium border-transparent"
                    : "text-gray-500 font-medium border-transparent"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <button
            onClick={handleMarkAllAsRead}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
              darkMode
                ? "bg-gray-700 text-white shadow-sm hover:bg-gray-600"
                : "bg-gray-50 text-gray-700 shadow-sm hover:bg-gray-100"
            }`}
          >
            Mark all as read
          </button>
        </div>

        {/* Notification list */}
        <div>
          {filteredNotifications.length === 0 ? (
            <div
              className={`px-6 py-10 text-center text-sm ${
                darkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              No unread notifications
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between px-6 py-2 border-b last:border-b-0 cursor-pointer transition-all duration-200 ${
                  darkMode
                    ? "border-gray-600 hover:bg-gray-600"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.type === "customer" ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 shrink-0">
                      <img
                        src={item.image}
                        alt="notification avatar"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        darkMode
                          ? "bg-gray-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {renderIcon(item.type)}
                    </div>
                  )}

                  <p
                    className={`text-sm md:text-base font-medium truncate ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {item.message}
                  </p>
                </div>

                <div className="flex items-center gap-5 shrink-0 ml-6">
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {item.time}
                  </span>

                  {!item.isRead && (
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
