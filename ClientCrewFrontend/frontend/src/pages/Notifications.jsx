import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  User,
  FileText,
  Shield,
  LogIn,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  MessageSquare,
} from "lucide-react";

import {
  getActivities,
  markActivityAsRead,
  markAllActivitiesAsRead,
} from "../../services/activityService";

export default function Notifications() {
  const { darkMode } = useOutletContext();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const data = await getActivities();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter((item) => !item.isRead)
      : notifications;

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const safeCurrentPage =
    totalPages === 0 ? 1 : Math.min(currentPage, totalPages);

  const paginatedNotifications = filteredNotifications.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage,
  );

  const handleMarkAllAsRead = async () => {
    try {
      await markAllActivitiesAsRead();

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        })),
      );

      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const getActivityLink = (item) => {
    switch (item.moduleName) {
      case "PROJECT":
        return "/projects";
      case "TASK":
        return "/tasks";
      case "CUSTOMER":
        return "/customers";
      case "EMPLOYEE":
      case "TEAM":
        return "/employees";
      case "USER":
        return "/users";
      case "AUTH":
        return "/dashboard";
      case "REPORT":
        return "/reports";
      case "SETTINGS":
        return "/settings";
      case "MESSAGE":
        return "/messages";
      default:
        return null;
    }
  };

  const handleNotificationClick = async (item) => {
    try {
      await markActivityAsRead(item.id);

      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)),
      );

      const link = getActivityLink(item);

      if (link) {
        navigate(link);
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const renderIcon = (moduleName, activityType) => {
    if (moduleName === "AUTH" || activityType === "USER_LOGIN") {
      return <LogIn size={18} />;
    }

    switch (moduleName) {
      case "PROJECT":
        return <FolderKanban size={18} />;
      case "TASK":
        return <CheckSquare size={18} />;
      case "CUSTOMER":
      case "EMPLOYEE":
      case "USER":
      case "TEAM":
        return <Users size={18} />;
      case "REPORT":
        return <FileText size={18} />;
      case "SETTINGS":
        return <Settings size={18} />;
      case "MESSAGE":
        return <MessageSquare size={18} />;
      case "SECURITY":
        return <Shield size={18} />;
      default:
        return <User size={18} />;
    }
  };

  const getTimeLabel = (dateValue) => {
    if (!dateValue) return "";

    return new Date(dateValue).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <p className={darkMode ? "text-white" : "text-gray-700"}>
        Loading notifications...
      </p>
    );
  }

  return (
    <div className="space-y-6">
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

      <div
        className={`rounded-2xl shadow-sm overflow-hidden ${
          darkMode
            ? "bg-gray-700 border border-gray-600"
            : "bg-white border border-gray-200"
        }`}
      >
        <div
          className={`flex items-center justify-between px-6 py-2 border-b ${
            darkMode
              ? "bg-gray-800 border-gray-600"
              : "bg-gray-100 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-8">
            <button
              onClick={() => handleTabChange("all")}
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
              onClick={() => handleTabChange("unread")}
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

        <div>
          {filteredNotifications.length === 0 ? (
            <div
              className={`px-6 py-10 text-center text-sm ${
                darkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              {activeTab === "unread"
                ? "No unread notifications"
                : "No notifications found"}
            </div>
          ) : (
            paginatedNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`flex items-center justify-between px-6 py-3 border-b last:border-b-0 cursor-pointer transition-all duration-200 ${
                  darkMode
                    ? "border-gray-600 hover:bg-gray-600"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      darkMode
                        ? "bg-gray-500 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {renderIcon(item.moduleName, item.activityType)}
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`text-sm md:text-base font-semibold truncate ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {item.title}
                    </p>

                    <p
                      className={`text-sm truncate ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {item.description}
                    </p>

                    <p
                      className={`text-xs mt-1 truncate ${
                        darkMode ? "text-gray-400" : "text-gray-400"
                      }`}
                    >
                      By {item.performedByEmail || "System"}
                      {item.performedByRole ? ` • ${item.performedByRole}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5 shrink-0 ml-6">
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {getTimeLabel(item.createdAt)}
                  </span>

                  {!item.isRead && (
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {filteredNotifications.length > 0 && (
          <div
            className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-4 border-t ${
              darkMode ? "border-gray-600" : "border-gray-200"
            }`}
          >
            <p
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Showing{" "}
              <span className="font-medium">
                {(safeCurrentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  safeCurrentPage * itemsPerPage,
                  filteredNotifications.length,
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium">
                {filteredNotifications.length}
              </span>{" "}
              notifications
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={safeCurrentPage === 1}
                className={`px-3 py-2 rounded-lg text-sm border transition ${
                  safeCurrentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:bg-gray-50"
                } ${
                  darkMode
                    ? "bg-gray-600 border-gray-500 text-white hover:bg-gray-500"
                    : "bg-white border-gray-200 text-gray-700"
                }`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition cursor-pointer ${
                      safeCurrentPage === page
                        ? "bg-[#0f766e] text-white"
                        : darkMode
                          ? "bg-gray-600 text-white hover:bg-gray-500"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))
                }
                disabled={safeCurrentPage === totalPages || totalPages === 0}
                className={`px-3 py-2 rounded-lg text-sm border transition ${
                  safeCurrentPage === totalPages || totalPages === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:bg-gray-50"
                } ${
                  darkMode
                    ? "bg-gray-600 border-gray-500 text-white hover:bg-gray-500"
                    : "bg-white border-gray-200 text-gray-700"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
