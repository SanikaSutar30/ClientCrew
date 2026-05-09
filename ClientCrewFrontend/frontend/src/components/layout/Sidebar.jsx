import { logoutUser } from "../../services/api";

import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import LogoutConfirmModal from "../../pages/LogoutConfirmModal";
import { sidebarByRole, getUserRole } from "../../utils/roleAccess";

function Sidebar({ darkMode }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = getUserRole();
  const menu = sidebarByRole[userRole] || [];

  const handleLogout = async () => {
    console.log("Logout clicked");

    try {
      const result = await logoutUser();
      console.log("Logout API success:", result);
    } catch (error) {
      console.error("Logout activity failed:", error);
    }

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
      className={`w-64 h-full flex flex-col justify-between ${
        darkMode ? "bg-gray-100 text-black" : "bg-gray-800 text-white"
      }`}
    >
      <div>
        {showLogoutModal && (
          <LogoutConfirmModal
            darkMode={darkMode}
            setShowLogoutModal={setShowLogoutModal}
            onConfirmLogout={handleLogout}
          />
        )}

        <div className="flex items-center gap-3 px-6 py-5">
          <div className="bg-[#0f766e] w-10 h-10 rounded-lg flex items-center justify-center font-bold hover:bg-[#115e59]">
            C
          </div>
          <div>
            <h1 className="text-lg font-semibold">ClientCrew</h1>
            <p className="text-xs text-gray-400">{userRole}</p>
          </div>
        </div>

        <div className="px-4 space-y-6">
          {menu.map((section, idx) => (
            <div key={idx}>
              <p className="text-xs text-gray-400 uppercase px-2 mb-2">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item, i) => {
                  const Icon = item.icon;

                  const isProjectsRoute =
                    item.path === "/projects" &&
                    location.pathname.startsWith("/projects");

                  const isActive =
                    location.pathname === item.path || isProjectsRoute;

                  return (
                    <NavLink
                      key={i}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-[#0f766e] text-white"
                          : darkMode
                            ? "text-gray-700 hover:bg-gray-200 hover:text-black"
                            : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
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

      <div className="p-4">
        <button
          onClick={() => setShowLogoutModal(true)}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition cursor-pointer ${
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
