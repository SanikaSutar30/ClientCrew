import { useNavigate } from "react-router-dom";
import {
  CheckSquare,
  FolderKanban,
  Clock3,
  CheckCircle2,
  Users,
  FileText,
  Bell,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAllProjects } from "../../services/projectService";

export default function EmployeeDashboard({ darkMode }) {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  const loggedInEmployeeId = localStorage.getItem("userId");

  const assignedProjects = projects.filter((project) =>
    project.assignedEmployees?.some((emp) => emp.id == loggedInEmployeeId),
  );
  const stats = [
    {
      title: "My Tasks",
      value: assignedProjects.length,
      icon: CheckSquare,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Active Projects",
      value: assignedProjects.length,
      icon: FolderKanban,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
    {
      title: "Due This Week",
      value: assignedProjects.length,
      icon: Clock3,
      bg: "bg-orange-100",
      color: "text-orange-600",
    },
    {
      title: "Completed Tasks",
      value: assignedProjects.length,
      icon: CheckCircle2,
      bg: "bg-green-100",
      color: "text-green-600",
    },
  ];

  const myTasks = [
    {
      id: 1,
      title: "Design dashboard cards",
      project: "ClientCrew CRM",
      status: "In Progress",
      priority: "High",
    },
    {
      id: 2,
      title: "Fix project table layout",
      project: "Project Management",
      status: "Review",
      priority: "Medium",
    },
    {
      id: 3,
      title: "Update customer modal",
      project: "Customer Module",
      status: "To Do",
      priority: "High",
    },
  ];

  const myProjects = [
    {
      id: 1,
      name: "ClientCrew CRM",
      progress: 80,
      dueDate: "2026-05-10",
    },
    {
      id: 2,
      name: "Customer Portal",
      progress: 65,
      dueDate: "2026-05-18",
    },
    {
      id: 3,
      name: "Reports Module",
      progress: 45,
      dueDate: "2026-05-25",
    },
  ];

  const getStatusClasses = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Review":
        return "bg-purple-100 text-purple-700";
      case "Done":
        return "bg-green-100 text-green-700";
      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  const getPriorityClasses = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await getAllProjects();
        setProjects(res.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    loadProjects();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Employee Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Track your assigned tasks, projects, and updates.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`p-5 rounded-2xl shadow-sm flex items-center justify-between ${
                darkMode
                  ? "bg-gray-700 border border-gray-600"
                  : "bg-white border border-gray-100"
              }`}
            >
              <div>
                <p
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {item.title}
                </p>
                <h2
                  className={`text-2xl font-bold mt-2 ${
                    darkMode ? "text-white" : "text-black"
                  }`}
                >
                  {item.value}
                </h2>
              </div>

              <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl ${item.bg}`}
              >
                <Icon size={22} className={item.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tasks + Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Tasks */}
        <div
          className={`p-6 rounded-2xl shadow-sm ${
            darkMode
              ? "bg-gray-700 border border-gray-600"
              : "bg-white border border-gray-100"
          }`}
        >
          <div className="flex items-center justify-between mb-5">
            <h2
              className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              My Tasks
            </h2>

            <button
              onClick={() => navigate("/tasks")}
              className="text-sm cursor-pointer font-medium text-[#0f766e] hover:underline hover:text-[#115e59] transition"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {myTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-xl ${
                  darkMode ? "bg-gray-600" : "bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3
                      className={`font-semibold ${
                        darkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p
                      className={`text-sm mt-1 ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {task.project}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${getPriorityClasses(
                      task.priority,
                    )}`}
                  >
                    {task.priority}
                  </span>
                </div>

                <div className="mt-3">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusClasses(
                      task.status,
                    )}`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Projects */}
        <div
          className={`p-6 rounded-2xl shadow-sm ${
            darkMode
              ? "bg-gray-700 border border-gray-600"
              : "bg-white border border-gray-100"
          }`}
        >
          <div className="flex items-center justify-between mb-5">
            <h2
              className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              My Projects
            </h2>

            <button
              onClick={() => navigate("/projects")}
              className="text-sm cursor-pointer font-medium text-[#0f766e] hover:underline hover:text-[#115e59] transition"
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            {myProjects.map((project) => (
              <div
                key={project.id}
                className={`p-4 rounded-xl ${
                  darkMode ? "bg-gray-600" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className={`font-semibold ${
                      darkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {project.name}
                  </h3>
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {project.progress}%
                  </span>
                </div>

                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0f766e] rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>

                <p
                  className={`text-sm mt-3 ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Due: {new Date(project.dueDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div
        className={`p-3 rounded-2xl shadow-sm ${
          darkMode
            ? "bg-gray-700 border border-gray-600"
            : "bg-white border border-gray-100"
        }`}
      >
        <h2
          className={`text-xl font-semibold mb-4 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => navigate("/tasks")}
            className={`p-5 rounded-2xl border text-center transition hover:shadow-md cursor-pointer ${
              darkMode
                ? "bg-gray-600 border-gray-500 hover:bg-gray-500"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-[#0f766e] text-white flex items-center justify-center">
              <CheckSquare size={18} />
            </div>
            <p
              className={`font-medium ${darkMode ? "text-white" : "text-black"}`}
            >
              View Tasks
            </p>
          </button>

          <button
            onClick={() => navigate("/projects")}
            className={`p-5 rounded-2xl border text-center transition hover:shadow-md cursor-pointer ${
              darkMode
                ? "bg-gray-600 border-gray-500 hover:bg-gray-500"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-blue-500 text-white flex items-center justify-center">
              <FolderKanban size={18} />
            </div>
            <p
              className={`font-medium ${darkMode ? "text-white" : "text-black"}`}
            >
              View Projects
            </p>
          </button>

          <button
            onClick={() => navigate("/employees")}
            className={`p-5 rounded-2xl border text-center transition hover:shadow-md cursor-pointer ${
              darkMode
                ? "bg-gray-600 border-gray-500 hover:bg-gray-500"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-purple-500 text-white flex items-center justify-center">
              <Users size={18} />
            </div>
            <p
              className={`font-medium ${darkMode ? "text-white" : "text-black"}`}
            >
              View Team
            </p>
          </button>

          <button
            onClick={() => navigate("/reports")}
            className={`p-5 rounded-2xl border text-center transition hover:shadow-md cursor-pointer ${
              darkMode
                ? "bg-gray-600 border-gray-500 hover:bg-gray-500"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-orange-500 text-white flex items-center justify-center">
              <FileText size={18} />
            </div>
            <p
              className={`font-medium ${darkMode ? "text-white" : "text-black"}`}
            >
              View Reports
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
