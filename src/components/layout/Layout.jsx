import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function Layout() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar darkMode={darkMode} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <div
          className={`flex-1 p-6 overflow-y-auto ${
            darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
          }`}
        >
          <Outlet context={{ darkMode }} />
        </div>
      </div>
    </div>
  );
}

export default Layout;
