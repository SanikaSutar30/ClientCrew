import { CheckCircle, AlertTriangle, X } from "lucide-react";

export default function ConfirmationModal({
  darkMode,
  isOpen,
  type = "success",
  title,
  message,
  confirmText = "OK",
  cancelText,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const icon =
    type === "success" ? (
      <CheckCircle className="text-green-500" size={28} />
    ) : (
      <AlertTriangle className="text-red-500" size={28} />
    );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div
        className={`w-full max-w-md rounded-3xl shadow-xl p-6 ${
          darkMode
            ? "bg-gray-800 border border-gray-700 text-white"
            : "bg-white border border-gray-200 text-black"
        }`}
      >
        {/* Close */}
        {type !== "success" && (
          <div className="flex justify-end">
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-red-500 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Icon */}
        <div className="flex justify-center mb-4">{icon}</div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-2">{title}</h2>

        {/* Message */}
        <p
          className={`text-center text-sm mb-6 ${
            darkMode ? "text-gray-300" : "text-gray-500"
          }`}
        >
          {message}
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          {cancelText && (
            <button
              onClick={onCancel}
              className={`px-4 py-2 cursor-pointer rounded-xl ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {cancelText}
            </button>
          )}

          <button
            onClick={onConfirm}
            className={`px-5 py-2 rounded-xl text-white cursor-pointer ${
              type === "success"
                ? "bg-[#0f766e] hover:opacity-90"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
