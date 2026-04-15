import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function Layout() {
  const [darkMode, setDarkMode] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      name: "Biplab Roy",
      text: "Sounds good! Let's schedule...",
      time: "2h ago",
      unread: true,
      avatar: "../assets/Profile.jpg",
    },
    {
      id: 2,
      name: "John Doe",
      text: "Please send latest report",
      time: "4h ago",
      unread: true,
      avatar: "../assets/Profile2.jpg",
    },
    {
      id: 3,
      name: "Priya Singh",
      text: "Task board UI looks good",
      time: "1d ago",
      unread: false,
      avatar: "../assets/Profile3.jpg",
    },
  ]);
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
    {
      id: 4,
      message: "New comment on Task #42: 'Design homepage wireframe'.",
      time: "2h ago",
      isRead: false,
      type: "task",
      link: "/tasks",
    },
    {
      id: 5,
      message: "Project 'ClientCrew Redesign' has been marked as completed.",
      time: "5h ago",

      isRead: true,
      type: "project",
      link: "/projects",


    }, {
      id: 6,
      message: "New login from Chrome on Windows.",
      time: "1d ago",
      isRead: true,
      type: "login",
    }
  ]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar darkMode={darkMode} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          notifications={notifications}
          setNotifications={setNotifications}
          messages={messages}
          setMessages={setMessages}
        />

        <div
          className={`flex-1 p-6 overflow-y-auto ${
            darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
          }`}
        >
          <Outlet
            context={{
              darkMode,
              setDarkMode,
              notifications,
              setNotifications,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Layout;
