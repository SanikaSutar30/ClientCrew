import { useState } from "react";
import { X, CalendarDays, ChevronDown, Check } from "lucide-react";

export default function EditTask({
  darkMode,
  task,
  setShowEditTask,
  onUpdateTask,
}) {
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    const parsed = new Date(dateString);
    if (!isNaN(parsed)) {
      return parsed.toISOString().split("T")[0];
    }

    return "";
  };

  const [formData, setFormData] = useState({
    ...task,
    dueDate: formatDateForInput(task.dueDate),
    priority: task.priority || "Medium",
    description: task.description || "",
    createdBy: task.createdBy || "Admin",
    subtasks: task.subtasks || "",
    tag: task.tag || "",
  });

  const [errors, setErrors] = useState({});
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const priorityOptions = ["Low", "Medium", "High"];
  const statusOptions = ["To Do", "In Progress", "Review", "Blocked", "Done"];

  const getTagByPriority = (priority) => {
    switch (priority) {
      case "High":
        return "Critical";
      case "Medium":
        return "Development";
      case "Low":
        return "Marketing";
      default:
        return "";
    }
  };

  const getBorderColorByStatus = (status) => {
    switch (status) {
      case "To Do":
        return "border-l-blue-400";
      case "In Progress":
        return "border-l-amber-400";
      case "Review":
        return "border-l-purple-400";
      case "Blocked":
        return "border-l-red-400";
      case "Done":
        return "border-l-emerald-400";
      default:
        return "border-l-gray-400";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrioritySelect = (priority) => {
    setFormData((prev) => ({
      ...prev,
      priority,
      tag: getTagByPriority(priority),
    }));
    setShowPriorityDropdown(false);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }

    if (!formData.project.trim()) {
      newErrors.project = "Project is required";
    }

    if (!formData.assignee.trim()) {
      newErrors.assignee = "Assignee is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const updatedTask = {
      ...formData,
      dueDate: new Date(formData.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      borderColor: getBorderColorByStatus(formData.status),
    };

    onUpdateTask(updatedTask);
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
      : "bg-white border-gray-200 text-black placeholder:text-gray-400"
  }`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center px-4 pt-20 overflow-y-auto">
      <div
        className={`w-full max-w-4xl rounded-3xl shadow-xl overflow-hidden ${
          darkMode
            ? "bg-gray-800 border border-gray-700 text-white"
            : "bg-white border border-gray-200 text-black"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-8 py-6 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h2 className="text-2xl font-bold">Edit Task</h2>

          <button
            type="button"
            onClick={() => setShowEditTask(false)}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer ${
              darkMode
                ? "bg-gray-700 text-gray-300 hover:text-white"
                : "bg-gray-100 text-gray-500 hover:text-black"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Task Name
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Project
              </label>
              <input
                type="text"
                name="project"
                value={formData.project}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.project && (
                <p className="text-red-500 text-xs mt-1">{errors.project}</p>
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Assigned To
              </label>
              <input
                type="text"
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.assignee && (
                <p className="text-red-500 text-xs mt-1">{errors.assignee}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Created By
              </label>
              <input
                type="text"
                name="createdBy"
                value={formData.createdBy}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={`${inputClass} pr-10`}
                />
                <CalendarDays
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
              {errors.dueDate && (
                <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-semibold mb-2">
                Priority
              </label>

              <button
                type="button"
                onClick={() => setShowPriorityDropdown((prev) => !prev)}
                className={`w-full px-4 py-3 rounded-xl border flex items-center justify-between cursor-pointer ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-200 text-black"
                }`}
              >
                <span>{formData.priority}</span>
                <ChevronDown size={18} className="text-gray-400" />
              </button>

              {showPriorityDropdown && (
                <div
                  className={`absolute top-full left-0 mt-2 w-full rounded-2xl shadow-lg border z-20 overflow-hidden ${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {priorityOptions.map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => handlePrioritySelect(priority)}
                      className={`w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer ${
                        formData.priority === priority
                          ? darkMode
                            ? "bg-gray-700"
                            : "bg-orange-50"
                          : darkMode
                            ? "hover:bg-gray-700"
                            : "hover:bg-gray-50"
                      }`}
                    >
                      <span>{priority}</span>
                      {formData.priority === priority && <Check size={16} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`${inputClass} cursor-pointer`}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2">Tag</label>
              <input
                type="text"
                name="tag"
                value={formData.tag}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Subtasks
              </label>
              <input
                type="text"
                name="subtasks"
                value={formData.subtasks}
                onChange={handleChange}
                placeholder="Example: 3 / 5"
                className={inputClass}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Footer */}
          <div
            className={`flex justify-end gap-3 pt-6 border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <button
              type="button"
              onClick={() => setShowEditTask(false)}
              className={`px-5 py-2.5 rounded-xl font-medium cursor-pointer ${
                darkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0f766e] text-white font-medium cursor-pointer hover:opacity-90"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
