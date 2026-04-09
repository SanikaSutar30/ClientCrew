import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

// 👉 (optional later) import images properly
// import profile1 from "../../assets/Profile1.jpg";

function Layout() {
  const [darkMode, setDarkMode] = useState(false);

  // ✅ GLOBAL notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Neha Verma has been added as a new customer.",
      time: "3m ago",
      isRead: false,
      type: "customer",
      link: "/customers",
    },
    {
      id: 2,
      message: "Your password was changed successfully.",
      time: "15m ago",
      isRead: false,
      type: "security",
      link: "/settings",
    },
    {
      id: 3,
      message: "Weekly performance report is now available.",
      time: "1h ago",
      isRead: true,
      type: "report",
      link: "/reports",
    },
  ]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar darkMode={darkMode} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ✅ PASS notifications to Topbar */}
        <Topbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          notifications={notifications}
          setNotifications={setNotifications}
        />

        <div
          className={`flex-1 p-6 overflow-y-auto ${
            darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
          }`}
        >
          {/* ✅ PASS to all pages */}
          <Outlet context={{ darkMode, notifications, setNotifications }} />
        </div>
      </div>
    </div>
  );
}

export default Layout;