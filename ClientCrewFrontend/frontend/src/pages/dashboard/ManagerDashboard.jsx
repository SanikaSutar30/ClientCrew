import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProjects } from "../../services/projectService";
import {
  Folder,
  FolderKanban,
  FileText,
  CheckSquare,
  Users,
  Clock3,
  Plus,
  Eye,
  UserCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function ManagerDashboard({ darkMode }) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  const [chartFilter, setChartFilter] = useState("Monthly");

  const monthlyProjectData = [
    { month: "Jan", projects: 3 },
    { month: "Feb", projects: 5 },
    { month: "Mar", projects: 7 },
    { month: "Apr", projects: 9 },
    { month: "May", projects: 12 },
    { month: "Jun", projects: 15 },
  ];

  const weeklyProjectData = [
    { month: "Week 1", projects: 4 },
    { month: "Week 2", projects: 7 },
    { month: "Week 3", projects: 10 },
    { month: "Week 4", projects: 15 },
  ];

  const chartData =
    chartFilter === "Monthly" ? monthlyProjectData : weeklyProjectData;

  const projectStatusData = [
    { name: "In Progress", value: 6, color: "#0f766e" },
    { name: "Completed", value: 4, color: "#22c55e" },
    { name: "On Hold", value: 2, color: "#f97316" },
    { name: "Planning", value: 3, color: "#3b82f6" },
  ];

  const recentTasks = [
    {
      id: 1,
      title: "Review CRM dashboard UI",
      project: "CRM Platform",
      status: "In Progress",
      priority: "High",
    },
    {
      id: 2,
      title: "Assign API integration tasks",
      project: "ClientCrew Backend",
      status: "Pending",
      priority: "Medium",
    },
    {
      id: 3,
      title: "Check customer feedback module",
      project: "Customer Portal",
      status: "Completed",
      priority: "Low",
    },
  ];

  const teamMembers = [
    { id: 1, name: "Rohan Deshmukh", role: "Developer", status: "Active" },
    { id: 2, name: "Sneha Kulkarni", role: "UI/UX Designer", status: "Active" },
    { id: 3, name: "Neha Jadhav", role: "Tester", status: "On Leave" },
  ];

  const stats = [
    {
      title: "My Projects",
      value: projects.length,
      icon: Folder,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
    {
      title: "Pending Tasks",
      value: projects.length,
      icon: CheckSquare,
      bg: "bg-orange-100",
      color: "text-orange-600",
    },
    {
      title: "Team Members",
      value: projects.length,
      icon: Users,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Due This Week",
      value: projects.length,
      icon: Clock3,
      bg: "bg-red-100",
      color: "text-red-600",
    },
  ];

  const getStatusClasses = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "On Leave":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-orange-100 text-orange-700";
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Manager Dashboard
          </h1>
          <p
            className={`text-sm mt-1 ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            Track your projects, tasks, and team performance.
          </p>
        </div>

        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#0f766e] text-white hover:opacity-90 cursor-pointer"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`p-5 rounded-2xl shadow-sm hover:shadow-md transition flex items-center justify-between ${
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

      {/* Chart + Team */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className={`lg:col-span-2 p-6 rounded-2xl shadow-sm ${
            darkMode
              ? "bg-gray-700 border border-gray-600"
              : "bg-white border border-gray-100"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              Project Progress
            </h2>

            <div
              className={`flex items-center rounded-full p-1 ${
                darkMode ? "bg-gray-600" : "bg-gray-100"
              }`}
            >
              {["Monthly", "Weekly"].map((item) => (
                <button
                  key={item}
                  onClick={() => setChartFilter(item)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer ${
                    chartFilter === item
                      ? darkMode
                        ? "bg-gray-500 text-white"
                        : "bg-white text-gray-700 shadow-sm"
                      : darkMode
                        ? "text-gray-300"
                        : "text-gray-500"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#4b5563" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="month"
                  stroke={darkMode ? "#d1d5db" : "#6b7280"}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={darkMode ? "#d1d5db" : "#6b7280"}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="projects"
                  stroke="#0f766e"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className={`p-6 rounded-2xl shadow-sm ${
            darkMode
              ? "bg-gray-700 border border-gray-600"
              : "bg-white border border-gray-100"
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-5 ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            Project Status
          </h2>

          <div className="w-full h-[190px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  dataKey="value"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {projectStatusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 mt-4">
            {projectStatusData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
                <span className={darkMode ? "text-white" : "text-black"}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tasks + Team */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              Recent Tasks
            </h2>
            <button
              onClick={() => navigate("/tasks")}
              className="text-sm text-[#0f766e] font-medium hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-xl flex items-center justify-between gap-4 ${
                  darkMode ? "bg-gray-600" : "bg-gray-50"
                }`}
              >
                <div>
                  <h3
                    className={`font-semibold ${
                      darkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {task.project}
                  </p>
                </div>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusClasses(
                    task.status,
                  )}`}
                >
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>

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
              My Team
            </h2>
            <button
              onClick={() => navigate("/employees")}
              className="text-sm text-[#0f766e] font-medium hover:underline cursor-pointer"
            >
              View Team
            </button>
          </div>

          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className={`p-4 rounded-xl flex items-center justify-between ${
                  darkMode ? "bg-gray-600" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <UserCheck size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <h3
                      className={`font-semibold ${
                        darkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {member.name}
                    </h3>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {member.role}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusClasses(
                    member.status,
                  )}`}
                >
                  {member.status}
                </span>
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
          {/* Manage Projects */}
          <button
            onClick={() => navigate("/projects")}
            className={`p-5 rounded-2xl border text-center transition hover:shadow-md cursor-pointer ${
              darkMode
                ? "bg-gray-600 border-gray-500 hover:bg-gray-500"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-[#0f766e] text-white flex items-center justify-center">
              <FolderKanban size={18} />
            </div>
            <p
              className={`font-medium ${darkMode ? "text-white" : "text-black"}`}
            >
              Manage Projects
            </p>
          </button>

          {/* Manage Tasks */}
          <button
            onClick={() => navigate("/tasks")}
            className={`p-5 rounded-2xl border text-center transition hover:shadow-md cursor-pointer ${
              darkMode
                ? "bg-gray-600 border-gray-500 hover:bg-gray-500"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-blue-500 text-white flex items-center justify-center">
              <CheckSquare size={18} />
            </div>
            <p
              className={`font-medium ${darkMode ? "text-white" : "text-black"}`}
            >
              Manage Tasks
            </p>
          </button>

          {/* View Team */}
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

          {/* View Reports */}
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
