import { useState } from "react";
import { X, Search } from "lucide-react";
import AddEmployee from "../employees/AddEmployee";
import AddProject from "../projects/AddProject";

export default function AddTask({
  darkMode,
  onClose,
  onAddTask,
  defaultStatus = "To Do",
  userRole,
}) {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const loggedInEmail = storedUser.email || "";
const [projectSearch, setProjectSearch] = useState("");
  const [teamMembers, setTeamMembers] = useState(
    [
    {
      name: "Priya Singh",
      email: "priya@gmail.com",
      role: "Manager",
      avatar: "../assets/Profile.jpg",
    },
    {
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      role: "Employee",
      avatar: "../assets/Profile2.jpg",
    },
    {
      name: "John Doe",
      email: "john@gmail.com",
      role: "Employee",
      avatar: "../assets/Profile3.jpg",
    },
    {
      name: "Jennifer Brown",
      email: "jennifer@gmail.com",
      role: "Employee",
      avatar: "../assets/Profile4.jpg",
    },
    {
      name: "Amit Patil",
      email: "amit@gmail.com",
      role: "Employee",
      avatar: "../assets/Profile5.jpg",
    },
  ]);

  const [showAddEmployee, setShowAddEmployee] = useState(false);

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

  const [errors, setErrors] = useState({});
  const [employeeSearch, setEmployeeSearch] = useState("");
const canAddProject = ["Admin", "Manager"].includes(userRole);

const [showAddProjectModal, setShowAddProjectModal] = useState(false);

const [projectOptions, setProjectOptions] = useState([
  "E-commerce Website",
  "Mobile App Development",
  "CRM Platform Enhancement",
  "Digital Marketing Campaign",
  "Healthcare Management System",
]);
  const visibleTeamMembers =
    userRole === "Admin"
      ? teamMembers
      : userRole === "Manager"
        ? teamMembers.filter((member) => member.role === "Employee")
        : userRole === "Employee"
          ? teamMembers.filter((member) => member.email === loggedInEmail)
          : [];

  
const filteredProjects = projectOptions.filter((project) =>
  project.toLowerCase().includes(projectSearch.toLowerCase()),
);
  const filteredEmployees = visibleTeamMembers.filter(
    (emp) =>
      emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      emp.role.toLowerCase().includes(employeeSearch.toLowerCase()),
  );

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
      : "bg-white border-gray-200 text-black placeholder:text-gray-400"
  }`;

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

  const handleAssigneeSelect = (member) => {
    setFormData((prev) => ({
      ...prev,
      assignee: member.name,
      avatar: member.avatar,
    }));

    setErrors((prev) => ({
      ...prev,
      assignee: "",
    }));
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
      ...formData,
      dueDate: new Date(formData.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      tag: getTagByPriority(formData.priority),
      borderColor: getBorderColorByStatus(formData.status),
    };

    onAddTask?.(newTask);
    onClose?.();
  };

  // keep this AFTER all hooks
  if (userRole === "Customer") return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6 bg-black/20 backdrop-blur-[3px]">
      {showAddEmployee && (
        <AddEmployee
          darkMode={darkMode}
          setShowAddModal={setShowAddEmployee}
          onAddEmployee={(newEmployee) => {
            const employeeToAdd = {
              ...newEmployee,
              email: newEmployee.email,
              avatar: newEmployee.image || "../assets/Profile.jpg",
            };

            setTeamMembers((prev) => [...prev, employeeToAdd]);

            setFormData((prev) => ({
              ...prev,
              assignee: employeeToAdd.name,
              avatar: employeeToAdd.avatar,
            }));
          }}
        />
      )}

      {showAddProjectModal && (
        <AddProject
          darkMode={darkMode}
          setShowAdd={setShowAddProjectModal}
          userRole={userRole}
          onAddProject={(newProject) => {
            const projectName = newProject.projectName;

            setProjectOptions((prev) => {
              if (prev.includes(projectName)) return prev;
              return [...prev, projectName];
            });

            setFormData((prev) => ({
              ...prev,
              project: projectName,
            }));

            setShowAddProjectModal(false);
          }}
        />
      )}
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Project</label>

                {canAddProject && (
                  <button
                    type="button"
                    onClick={() => setShowAddProjectModal(true)}
                    className="text-sm font-medium text-[#0f766e] hover:underline cursor-pointer"
                  >
                    + Add Project
                  </button>
                )}
              </div>

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
                name="project"
                value={formData.project}
                onChange={handleChange}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">Select project</option>
                {filteredProjects.map((project) => (
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

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold">
                Assign To{" "}
                <span className="text-gray-400 font-normal">
                  ({filteredEmployees.length} person
                  {filteredEmployees.length !== 1 ? "s" : ""})
                </span>
              </label>

              {(userRole === "Admin" || userRole === "Manager") && (
                <button
                  type="button"
                  onClick={() => setShowAddEmployee(true)}
                  className="text-sm text-[#0f766e] font-medium hover:underline cursor-pointer"
                >
                  + Add Employee
                </button>
              )}
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
                  {filteredEmployees.map((m) => {
                    const isSelected = formData.assignee === m.name;

                    return (
                      <button
                        key={m.email}
                        type="button"
                        onClick={() => handleAssigneeSelect(m)}
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
                            src={m.avatar}
                            alt={m.name}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>

                        <div className="flex flex-col text-left">
                          <span className="text-sm font-medium">{m.name}</span>
                          <span
                            className={`text-xs ${
                              darkMode ? "text-gray-300" : "text-gray-500"
                            }`}
                          >
                            {m.role}
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
                  No team members found
                </p>
              )}
            </div>

            {errors.assignee && (
              <p className="text-red-500 text-xs mt-1">{errors.assignee}</p>
            )}
          </div>

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
