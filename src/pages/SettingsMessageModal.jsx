import { CheckCircle, AlertCircle } from "lucide-react";

export default function SettingsMessageModal({
  darkMode,
  title,
  message,
  type = "success",
  onClose,
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
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              type === "success" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {type === "success" ? (
              <CheckCircle size={32} className="text-green-500" />
            ) : (
              <AlertCircle size={32} className="text-red-500" />
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">{title}</h2>

        {/* Message */}
        <p
          className={`text-center text-sm mb-6 ${
            darkMode ? "text-gray-300" : "text-gray-500"
          }`}
        >
          {message}
        </p>

        {/* Button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-medium bg-[#0f766e] text-white hover:opacity-90 cursor-pointer"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}