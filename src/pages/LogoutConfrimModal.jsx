import { AlertCircle } from "lucide-react";

export default function LogoutConfirmModal({
  darkMode,
  setShowLogoutModal,
  onConfirmLogout,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl p-6 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle size={32} className="text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">
          Are you sure you want to logout?
        </h2>

        {/* Description */}
        <p
          className={`text-center text-sm mb-6 ${
            darkMode ? "text-gray-300" : "text-gray-500"
          }`}
        >
          You will be returned to the login screen.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowLogoutModal(false)}
            className={`px-6 py-2.5 rounded-xl font-medium cursor-pointer ${
              darkMode
                ? "bg-gray-600 text-white hover:bg-gray-500"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Cancel
          </button>

          <button
            onClick={onConfirmLogout}
            className="px-6 py-2.5 rounded-xl font-medium bg-[#0f766e] text-white hover:opacity-90 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
