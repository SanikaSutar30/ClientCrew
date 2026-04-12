import { AlertTriangle, X } from "lucide-react";

export default function DeleteTask({
  darkMode,
  task,
  setShowDeleteTask,
  onDeleteTask,
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center px-4 pt-24">
      <div
        className={`w-full max-w-md rounded-3xl shadow-xl overflow-hidden ${
          darkMode
            ? "bg-gray-800 border border-gray-700 text-white"
            : "bg-white border border-gray-200 text-black"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-5 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="text-red-500" size={22} />
            </div>
            <h2 className="text-xl font-bold">Delete Task</h2>
          </div>

          <button
            type="button"
            onClick={() => setShowDeleteTask(false)}
            className="text-gray-500 hover:text-red-500 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-8">
          <p
            className={`text-center text-base ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Are you sure you want to delete{" "}
            <span className="font-semibold">{task?.title || "this task"}</span>?
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-center gap-4 px-6 pb-6">
          <button
            type="button"
            onClick={() => setShowDeleteTask(false)}
            className={`min-w-[120px] px-5 py-2.5 rounded-xl font-medium cursor-pointer ${
              darkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onDeleteTask(task.id)}
            className="min-w-[120px] px-5 py-2.5 rounded-xl font-medium bg-red-500 hover:bg-red-600 text-white cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
