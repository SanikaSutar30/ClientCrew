import { useState } from "react";
import { X, CalendarDays, ChevronDown, Check } from "lucide-react";

export default function AddTask({
  darkMode,
  setShowAddTask,
  onAddTask,
  defaultStatus = "To Do",
}) {
  const [formData, setFormData] = useState({
    title: "",
    project: "",
    assignee: "",
    avatar: "../assets/Profile.jpg",
    dueDate: "",
    priority: "Medium",
    description: "",
    status: defaultStatus,
  });

  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [errors, setErrors] = useState({});

  const teamMembers = [
    { name: "Priya Singh", avatar: "../assets/Profile.jpg" },
    { name: "Rahul Sharma", avatar: "../assets/Profile2.jpg" },
    { name: "John Doe", avatar: "../assets/Profile3.jpg" },
    { name: "Jennifer Brown", avatar: "../assets/Profile4.jpg" },
    { name: "Amit Patil", avatar: "../assets/Profile5.jpg" },
  ];

  const projectOptions = [
    "E-commerce Website",
    "Mobile App Development",
    "CRM Platform Enhancement",
    "Digital Marketing Campaign",
    "Healthcare Management System",
  ];

  const priorityOptions = ["Low", "Medium", "High"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAssigneeSelect = (member) => {
    setFormData((prev) => ({
      ...prev,
      assignee: member.name,
      avatar: member.avatar,
    }));
  };

  const handlePrioritySelect = (priority) => {
    setFormData((prev) => ({
      ...prev,
      priority,
    }));
    setShowPriorityDropdown(false);
  };

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task name is required";
    }

    if (!formData.project) {
      newErrors.project = "Project is required";
    }

    if (!formData.assignee) {
      newErrors.assignee = "Please select an assignee";
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

    const newTask = {
      id: Date.now().toString(),
      title: formData.title,
      assignee: formData.assignee,
      avatar: formData.avatar,
      dueDate: new Date(formData.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      status: formData.status,
      project: formData.project,
      tag: getTagByPriority(formData.priority),
      priority: formData.priority,
      description: formData.description,
      borderColor: getBorderColorByStatus(formData.status),
    };

    onAddTask(newTask);
    setShowAddTask(false);
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
      : "bg-white border-gray-200 text-black placeholder:text-gray-400"
  }`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center px-4 pt-24 overflow-y-auto backdrop-blur-[3px]">
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
          <h2 className="text-2xl font-bold">Add Task</h2>

          <button
            type="button"
            onClick={() => setShowAddTask(false)}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer ${
              darkMode
                ? "bg-gray-700 text-gray-300 hover:text-white"
                : "bg-gray-100 text-gray-500 hover:text-black"
            }`}
          >
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Task Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Task Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task name..."
                className={inputClass}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Project */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Project <span className="text-red-500">*</span>
              </label>
              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">Select project</option>
                {projectOptions.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
              {errors.project && (
                <p className="text-red-500 text-xs mt-1">{errors.project}</p>
              )}
            </div>
          </div>

          {/* Assign To */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Assign To{" "}
              <span className="text-gray-400 font-normal">(1 person)</span>
            </label>

            <div
              className={`p-4 rounded-2xl border ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex flex-wrap gap-3">
                {teamMembers.map((member) => {
                  const isSelected = formData.assignee === member.name;

                  return (
                    <button
                      key={member.name}
                      type="button"
                      onClick={() => handleAssigneeSelect(member)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer transition ${
                        isSelected
                          ? "border-[#0f766e] bg-[#0f766e]/10"
                          : darkMode
                            ? "border-gray-600 bg-gray-800 hover:bg-gray-600"
                            : "border-gray-200 bg-white hover:bg-gray-100"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 shrink-0">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <span className="text-sm">{member.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {errors.assignee && (
              <p className="text-red-500 text-xs mt-1">{errors.assignee}</p>
            )}
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Due Date */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Due Date <span className="text-red-500">*</span>
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

            {/* Priority */}
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
              placeholder="Enter task description..."
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Footer */}
          <div
            className={`flex items-center gap-4 pt-6 border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#0f766e] text-white font-medium cursor-pointer hover:opacity-90"
            >
              Create Task
            </button>

            <button
              type="button"
              onClick={() => setShowAddTask(false)}
              className={`px-6 py-3 rounded-xl font-medium cursor-pointer ${
                darkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
