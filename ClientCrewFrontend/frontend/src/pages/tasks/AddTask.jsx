import { useEffect, useState } from "react";
import axios from "axios";
import { X, Search } from "lucide-react";

export default function AddTask({
  darkMode,
  onClose,
  onAddTask,
  defaultStatus = "To Do",
  userRole,
}) {
  const [projectSearch, setProjectSearch] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");

  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    projectId: "",
    project: "",
    assigneeId: "",
    assignee: "",
    avatar: "../assets/Profile.jpg",
    dueDate: "",
    priority: "Medium",
    description: "",
    status: defaultStatus,
  });

  const [errors, setErrors] = useState({});

  const normalizedRole = userRole?.toUpperCase();
  const canCreateTask =
    normalizedRole === "ADMIN" ||
    normalizedRole === "MANAGER" ||
    userRole === "Admin" ||
    userRole === "Manager";

  const getLoggedInEmailFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return "";

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub || payload.email || payload.userEmail || "";
    } catch {
      return "";
    }
  };

  const loggedInEmail = getLoggedInEmailFromToken();

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
      setTeamMembers(employeesRes.data || []);
    } catch (error) {
      console.error("Failed to fetch task dropdown data:", error);
    }
  };

  useEffect(() => {
    fetchDropdownData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProjectId = (project) => project.id || project.projectId;

  const getProjectName = (project) =>
    project.projectName || project.name || project.title || "";

  const getEmployeeId = (emp) => emp.userId || emp.id || emp.employeeId;

  const getEmployeeName = (emp) =>
    emp.userFullName || emp.fullName || emp.name || emp.employeeName || "";

  const getEmployeeEmail = (emp) =>
    emp.userEmail || emp.email || emp.employeeEmail || "";

  const getEmployeeRole = (emp) =>
    emp.userRole || emp.role || emp.employeeRole || "Employee";

  const getEmployeeImage = (emp) =>
    emp.userImage || emp.image || emp.avatar || "../assets/Profile.jpg";

  const filteredProjects = projects.filter((project) =>
    getProjectName(project).toLowerCase().includes(projectSearch.toLowerCase()),
  );

  const selectedProject = projects.find(
    (project) => String(getProjectId(project)) === String(formData.projectId),
  );

  const selectedProjectMemberIds =
    selectedProject?.assignedEmployees?.map((emp) => getEmployeeId(emp)) || [];

const employeeSource =
  selectedProject?.assignedEmployees?.length > 0
    ? selectedProject.assignedEmployees
    : teamMembers;

const filteredEmployees = employeeSource.filter((emp) => {
  const employeeId = getEmployeeId(emp);
  const name = getEmployeeName(emp).toLowerCase();
  const role = String(getEmployeeRole(emp)).toLowerCase();

  const isSearchMatch =
    name.includes(employeeSearch.toLowerCase()) ||
    role.includes(employeeSearch.toLowerCase());

  if (!isSearchMatch) return false;

  if (!formData.projectId) return false;

  return selectedProjectMemberIds.includes(employeeId);
});

  const canAssignMember = (member) => {
    const role = String(getEmployeeRole(member)).toUpperCase();

    if (normalizedRole === "ADMIN" || userRole === "Admin") {
      return true;
    }

    if (normalizedRole === "MANAGER" || userRole === "Manager") {
      return role === "EMPLOYEE";
    }

    return false;
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
      : "bg-white border-gray-200 text-black placeholder:text-gray-400"
  }`;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "projectId") {
      const selected = projects.find(
        (project) => String(getProjectId(project)) === String(value),
      );

      setFormData((prev) => ({
        ...prev,
        projectId: value,
        project: selected ? getProjectName(selected) : "",
        assigneeId: "",
        assignee: "",
        avatar: "../assets/Profile.jpg",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleAssigneeSelect = (member) => {
    if (!canAssignMember(member)) return;

    setFormData((prev) => ({
      ...prev,
      assigneeId: getEmployeeId(member),
      assignee: getEmployeeName(member),
      avatar: getEmployeeImage(member),
    }));

    setErrors((prev) => ({
      ...prev,
      assigneeId: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task name is required";
    }

    if (!formData.projectId) {
      newErrors.projectId = "Project is required";
    }

    if (!formData.assigneeId) {
      newErrors.assigneeId = "Please select an assignee";
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
      ...formData,
      projectId: Number(formData.projectId),
      assigneeId: Number(formData.assigneeId),
      dueDate: formData.dueDate,
    };

    onAddTask?.(newTask);
    onClose?.();
  };

  if (!canCreateTask) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6 bg-black/20 backdrop-blur-[3px]">
      <div
        className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-xl ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <div
          className={`flex items-center justify-between px-8 py-6 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h2 className="text-2xl font-bold">Add Task</h2>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:text-red-500"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Task Name <span className="text-red-500">*</span>
              </label>

              <input
                name="title"
                placeholder="Enter task name"
                value={formData.title}
                onChange={handleChange}
                className={inputClass}
              />

              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Project <span className="text-red-500">*</span>
              </label>

              <div
                className={`flex items-center px-4 py-3 rounded-xl border mb-3 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <Search size={16} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className={`bg-transparent outline-none ml-2 w-full text-sm ${
                    darkMode
                      ? "text-white placeholder:text-gray-300"
                      : "text-gray-700 placeholder:text-gray-400"
                  }`}
                />
              </div>

              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">Select project</option>

                {filteredProjects.map((project) => (
                  <option
                    key={getProjectId(project)}
                    value={getProjectId(project)}
                  >
                    {getProjectName(project)}
                  </option>
                ))}
              </select>

              {errors.projectId && (
                <p className="text-red-500 text-xs mt-1">{errors.projectId}</p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold">
                Assign To{" "}
                <span className="text-gray-400 font-normal">
                  ({filteredEmployees.length} project member
                  {filteredEmployees.length !== 1 ? "s" : ""})
                </span>
              </label>
            </div>

            <div
              className={`flex items-center px-4 py-3 rounded-xl w-full lg:w-96 border mb-4 ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <Search size={16} className="text-gray-500" />

              <input
                type="text"
                placeholder="Search team members..."
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                className={`bg-transparent outline-none ml-2 w-full text-sm ${
                  darkMode
                    ? "text-white placeholder:text-gray-300"
                    : "text-gray-700 placeholder:text-gray-400"
                }`}
              />
            </div>

            <div
              className={`p-4 rounded-2xl border ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              {filteredEmployees.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {filteredEmployees.map((member) => {
                    const memberId = getEmployeeId(member);
                    const memberName = getEmployeeName(member);
                    const memberEmail = getEmployeeEmail(member);
                    const memberRole = getEmployeeRole(member);
                    const memberImage = getEmployeeImage(member);
                    const allowedToAssign = canAssignMember(member);

                    const displayName =
                      memberEmail?.toLowerCase() ===
                      loggedInEmail?.toLowerCase()
                        ? "You"
                        : memberName;

                    const isSelected =
                      String(formData.assigneeId) === String(memberId);

                    return (
                      <button
                        key={memberId}
                        type="button"
                        disabled={!allowedToAssign}
                        onClick={() => handleAssigneeSelect(member)}
                        title={
                          allowedToAssign
                            ? "Assign task"
                            : "Manager can assign task only to employees"
                        }
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition ${
                          !allowedToAssign
                            ? "opacity-50 cursor-not-allowed bg-gray-100 border-gray-200"
                            : isSelected
                              ? "cursor-pointer border-[#0f766e] bg-[#0f766e]/10"
                              : darkMode
                                ? "cursor-pointer border-gray-600 bg-gray-800 hover:bg-gray-600"
                                : "cursor-pointer border-gray-200 bg-white hover:bg-gray-100"
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 shrink-0">
                          <img
                            src={memberImage}
                            alt={memberName}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>

                        <div className="flex flex-col text-left">
                          <span className="text-sm font-medium">
                            {displayName}
                          </span>

                          <span
                            className={`text-xs ${
                              darkMode ? "text-gray-300" : "text-gray-500"
                            }`}
                          >
                            {memberRole}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Select a project first or no team members are assigned to this
                  project.
                </p>
              )}
            </div>

            {errors.assigneeId && (
              <p className="text-red-500 text-xs mt-1">{errors.assigneeId}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Due Date <span className="text-red-500">*</span>
              </label>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={inputClass}
              />

              {errors.dueDate && (
                <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Priority
              </label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
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
              placeholder="Enter task description..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <div
            className={`flex items-center justify-end gap-4 pt-6 border-t ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-3 rounded-xl font-medium cursor-pointer ${
                darkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-[#0f766e] text-white px-6 py-3 rounded-xl cursor-pointer hover:opacity-90"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
