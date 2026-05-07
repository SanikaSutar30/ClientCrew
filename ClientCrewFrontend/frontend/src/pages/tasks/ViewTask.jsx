import { X, Pencil, Trash2, CalendarDays, Folder, User } from "lucide-react";

export default function ViewTask({
  darkMode,
  task,
  setShowViewTask,
  onEditTask,
  onDeleteTask,
  userRole,
}) {
  if (!task) return null;

  const normalizedRole = userRole?.toUpperCase();

  const isAdmin = normalizedRole === "ADMIN" || userRole === "Admin";
  const isManager = normalizedRole === "MANAGER" || userRole === "Manager";

  const canEdit = isAdmin || isManager;
  const canDelete = isAdmin;

  return (
    <div className="fixed inset-0 z-[999] flex justify-center pt-20 px-4">
      <div
        className={`w-full max-w-3xl rounded-3xl shadow-xl p-6 ${
          darkMode
            ? "bg-gray-800 border border-gray-700 text-white"
            : "bg-white border border-gray-200 text-black"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Task Details</h2>

          <button
            onClick={() => setShowViewTask(false)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer ${
              darkMode
                ? "bg-gray-700 text-gray-300 hover:text-white"
                : "bg-gray-100 text-gray-500 hover:text-black"
            }`}
          >
            <X size={18} />
          </button>
        </div>

        <h3 className="text-xl font-semibold mb-2">{task.title}</h3>

        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              task.status === "To Do"
                ? "bg-blue-100 text-blue-700"
                : task.status === "In Progress"
                  ? "bg-amber-100 text-amber-700"
                  : task.status === "Review"
                    ? "bg-purple-100 text-purple-700"
                    : task.status === "Blocked"
                      ? "bg-red-100 text-red-700"
                      : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {task.status}
          </span>

          {task.priority && (
            <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
              {task.priority} Priority
            </span>
          )}

          {task.tag && (
            <span className="text-xs px-3 py-1 rounded-full bg-gray-200 text-gray-700">
              {task.tag}
            </span>
          )}
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium mb-1">Description</p>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {task.description || "No description provided"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center gap-3">
            <Folder size={18} className="text-[#0f766e]" />
            <div>
              <p className="text-xs text-gray-500">Project</p>
              <p className="text-sm font-medium">{task.project}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-300">
              <img
                src={task.avatar}
                alt={task.assignee}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <p className="text-xs text-gray-500">Assigned To</p>
              <p className="text-sm font-medium">{task.assignee}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <User size={18} className="text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Created By</p>
              <p className="text-sm font-medium">{task.createdBy || "Admin"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CalendarDays size={18} className="text-orange-500" />
            <div>
              <p className="text-xs text-gray-500">Due Date</p>
              <p className="text-sm font-medium">
                {task.dueDate || "No due date"}
              </p>
            </div>
          </div>
        </div>

        {task.subtasks && (
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Subtasks</p>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {task.subtasks}
            </div>
          </div>
        )}

        {typeof task.progress === "number" && (
          <div className="mb-6">
            <p className="text-sm mb-2 font-medium">Progress</p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0f766e] rounded-full"
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {(canEdit || canDelete) && (
          <div className="flex justify-end gap-3">
            {canDelete && (
              <button
                onClick={() => onDeleteTask(task)}
                className="flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}

            {canEdit && (
              <button
                onClick={() => onEditTask(task)}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer rounded-xl bg-green-50 text-green-600 hover:bg-green-100"
              >
                <Pencil size={16} />
                Edit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
