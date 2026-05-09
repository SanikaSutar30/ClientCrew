import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardData } from "../../services/dashboardService";

import {
  Folder,
  FolderKanban,
  FileText,
  CheckSquare,
  Users,
  Clock3,
  Plus,
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

  const [apiData, setApiData] = useState(null);
  const [chartFilter, setChartFilter] = useState("Monthly");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboardData();
        setApiData(data);
      } catch (error) {
        console.error("Error fetching manager dashboard:", error);
      }
    };

    loadDashboard();
  }, []);

  if (!apiData) {
    return (
      <div
        className={`flex items-center justify-center h-[70vh] ${
          darkMode ? "text-white" : "text-black"
        }`}
      >
        Loading dashboard...
      </div>
    );
  }

  const chartData =
    apiData.projectProgressChart?.length > 0
      ? apiData.projectProgressChart
      : [
          { label: "Projects", value: apiData.stats?.totalProjects || 0 },
          { label: "Tasks", value: apiData.stats?.totalTasks || 0 },
          { label: "Completed", value: apiData.stats?.completedTasks || 0 },
          { label: "Pending", value: apiData.stats?.pendingTasks || 0 },
        ];

  const projectStatusData =
    apiData.projectStatusChart?.length > 0
      ? apiData.projectStatusChart.map((item, index) => ({
          ...item,
          color: ["#0f766e", "#22c55e", "#f97316", "#3b82f6"][index % 4],
        }))
      : [
          {
            label: "Projects",
            value: apiData.stats?.totalProjects || 0,
            color: "#0f766e",
          },
          {
            label: "Tasks",
            value: apiData.stats?.totalTasks || 0,
            color: "#3b82f6",
          },
          {
            label: "Completed",
            value: apiData.stats?.completedTasks || 0,
            color: "#22c55e",
          },
        ];

  const recentTasks = apiData.recentTasks || [];
  const teamMembers = apiData.teamMembers || [];

  const stats = [
    {
      title: "My Projects",
      value: apiData.stats?.totalProjects || 0,
      icon: Folder,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
    {
      title: "Pending Tasks",
      value: apiData.stats?.pendingTasks || 0,
      icon: CheckSquare,
      bg: "bg-orange-100",
      color: "text-orange-600",
    },
    {
      title: "Team Members",
      value: teamMembers.length,
      icon: Users,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Due This Week",
      value: apiData.stats?.dueThisWeek || 0,
      icon: Clock3,
      bg: "bg-red-100",
      color: "text-red-600",
    },
  ];

  const getStatusClasses = (status) => {
    switch (status) {
      case "DONE":
      case "Completed":
        return "bg-green-100 text-green-700";
      case "IN_PROGRESS":
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "REVIEW":
        return "bg-purple-100 text-purple-700";
      case "BLOCKED":
      case "On Hold":
        return "bg-red-100 text-red-700";
      case "On Leave":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  return (
    <div className="space-y-6">
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
                  dataKey="label"
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
                  dataKey="value"
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
                  {projectStatusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 mt-4">
            {projectStatusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
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
                    {item.label}
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
            {recentTasks.length === 0 ? (
              <p className="text-sm text-gray-500">No recent tasks found.</p>
            ) : (
              recentTasks.map((task) => (
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
                      {task.projectName}
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
              ))
            )}
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
            {teamMembers.length === 0 ? (
              <p className="text-sm text-gray-500">No team members found.</p>
            ) : (
              teamMembers.map((member) => (
                <div
                  key={member.userId}
                  className={`p-4 rounded-xl flex items-center justify-between ${
                    darkMode ? "bg-gray-600" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                      {member.userImage ? (
                        <img
                          src={member.userImage}
                          alt={member.fullName}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <UserCheck size={18} className="text-gray-600" />
                      )}
                    </div>
                    <div>
                      <h3
                        className={`font-semibold ${
                          darkMode ? "text-white" : "text-black"
                        }`}
                      >
                        {member.fullName}
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
                    {member.status || "Active"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

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
