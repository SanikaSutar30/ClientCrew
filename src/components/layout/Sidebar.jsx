import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  UserCog,
  BarChart3,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import LogoutConfirmModal from "./LogoutConfirmModal";

const menu = [
  {
    title: "MAIN",
    items: [{ name: "Dashboard", path: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "MANAGEMENT",
    items: [
      { name: "Customers", path: "/customers", icon: Users },
      { name: "Projects", path: "/projects", icon: FolderKanban },
      { name: "Tasks", path: "/tasks", icon: CheckSquare },
      { name: "Employees / Teams", path: "/employees", icon: UserCog },
    ],
  },
  {
    title: "INSIGHTS",
    items: [{ name: "Reports", path: "/reports", icon: BarChart3 }],
  },
  {
    title: "SYSTEM",
    items: [
      { name: "Notifications", path: "/notifications", icon: Bell },
      { name: "Settings", path: "/settings", icon: Settings },
    ],
  },
];

function Sidebar({ darkMode }) {
  // Store logout modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Enable page navigation
  const navigate = useNavigate();

  // Handle logout and redirect to register page
  const handleLogout = () => {
    setShowLogoutModal(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    navigate("/register");
  };

  return (
    <div
      className={`w-64 h-full flex flex-col justify-between ${
        darkMode ? "bg-gray-100 text-black" : "bg-gray-800 text-white"
      }`}
    >
      <div>
        {/* Logout modal */}
        {showLogoutModal && (
          <LogoutConfirmModal
            darkMode={darkMode}
            setShowLogoutModal={setShowLogoutModal}
            onConfirmLogout={handleLogout}
          />
        )}

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5">
          <div className="bg-[#0f766e] w-10 h-10 rounded-lg flex items-center justify-center font-bold hover:bg-[#115e59]">
            C
          </div>
          <h1 className="text-lg font-semibold">ClientCrew</h1>
        </div>

        {/* Sidebar menu */}
        <div className="px-4 space-y-6">
          {menu.map((section, idx) => (
            <div key={idx}>
              <p className="text-xs text-gray-400 uppercase px-2 mb-2">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={i}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-[#0f766e] text-white"
                            : darkMode
                              ? "text-gray-700 hover:bg-gray-200 hover:text-black"
                              : "text-gray-300 hover:bg-white/10 hover:text-white"
                        }`
                      }
                    >
                      <Icon size={18} />
                      {item.name}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout button */}
      <div className="p-4">
        <button
          onClick={() => setShowLogoutModal(true)}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition ${
            darkMode
              ? "hover:bg-gray-200 text-black"
              : "hover:bg-white/10 text-white"
          }`}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
