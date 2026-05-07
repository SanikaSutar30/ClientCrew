import { useEffect, useState } from "react";
import axios from "axios";
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
    id: task.id,
    title: task.title || "",
    description: task.description || "",
    projectId: task.projectId || "",
    project: task.project || "",
    assigneeId: task.assigneeId || "",
    assignee: task.assignee || "",
    dueDate: formatDateForInput(task.dueDate),
    priority: task.priority || "Medium",
    status: task.status || "To Do",
    createdBy: task.createdBy || "",
    tag: task.tag || "",
    subtasks: task.subtasks || "",
  });

  const [errors, setErrors] = useState({});
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  const priorityOptions = ["Low", "Medium", "High"];
  const statusOptions = ["To Do", "In Progress", "Review", "Blocked", "Done"];

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchDropdownData = async () => {
    try {
      const [projectsRes, employeesRes] = await Promise.all([
        axios.get("http://localhost:8080/api/projects", getAuthHeaders()),
        axios.get("http://localhost:8080/api/employees", getAuthHeaders()),
      ]);

      setProjects(projectsRes.data || []);
      setEmployees(employeesRes.data || []);
    } catch (error) {
      console.error("Failed to load dropdown data:", error);
    }
  };

  useEffect(() => {
    fetchDropdownData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleProjectChange = (e) => {
    const selectedProject = projects.find(
      (project) => String(project.id) === String(e.target.value),
    );

    setFormData((prev) => ({
      ...prev,
      projectId: e.target.value,
      project: selectedProject?.projectName || "",
    }));

    setErrors((prev) => ({
      ...prev,
      projectId: "",
    }));
  };

  const handleAssigneeChange = (e) => {
    const selectedEmployee = employees.find(
      (employee) => String(employee.userId) === String(e.target.value),
    );

    setFormData((prev) => ({
      ...prev,
      assigneeId: e.target.value,
      assignee: selectedEmployee?.userFullName || "",
    }));

    setErrors((prev) => ({
      ...prev,
      assigneeId: "",
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

    if (!formData.projectId) {
      newErrors.projectId = "Project is required";
    }

    if (!formData.assigneeId) {
      newErrors.assigneeId = "Assignee is required";
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
      projectId: Number(formData.projectId),
      assigneeId: Number(formData.assigneeId),
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

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
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

              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleProjectChange}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">Select Project</option>

                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.projectName}
                  </option>
                ))}
              </select>

              {errors.projectId && (
                <p className="text-red-500 text-xs mt-1">{errors.projectId}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Assigned To
              </label>

              <select
                name="assigneeId"
                value={formData.assigneeId}
                onChange={handleAssigneeChange}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">Select Assignee</option>

                {employees.map((employee) => (
                  <option key={employee.userId} value={employee.userId}>
                    {employee.userFullName}
                  </option>
                ))}
              </select>

              {errors.assigneeId && (
                <p className="text-red-500 text-xs mt-1">{errors.assigneeId}</p>
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
                disabled
                className={`${inputClass} cursor-not-allowed opacity-80`}
              />
            </div>
          </div>

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
