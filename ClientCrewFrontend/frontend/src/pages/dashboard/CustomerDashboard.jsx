import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FolderKanban, Users, FileText, Clock3, Eye } from "lucide-react";
import { getDashboardData } from "../../services/dashboardService";

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

export default function CustomerDashboard({ darkMode }) {
  const navigate = useNavigate();

  const [apiData, setApiData] = useState(null);
  const [chartFilter, setChartFilter] = useState("Monthly");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboardData();
        setApiData(data);
      } catch (error) {
        console.error("Error fetching customer dashboard:", error);
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
          { label: "Progress", value: apiData.stats?.activeProjects || 0 },
        ];

  const projectStatusData =
    apiData.projectStatusChart?.length > 0
      ? apiData.projectStatusChart.map((item, index) => ({
          ...item,
          color: ["#22c55e", "#3b82f6", "#f59e0b", "#0f766e"][index % 4],
        }))
      : [
          {
            label: "Completed",
            value: apiData.stats?.completedTasks || 0,
            color: "#22c55e",
          },
          {
            label: "In Progress",
            value: apiData.stats?.activeProjects || 0,
            color: "#3b82f6",
          },
          {
            label: "Tasks",
            value: apiData.stats?.totalTasks || 0,
            color: "#f59e0b",
          },
        ];

  const stats = [
    {
      title: "My Projects",
      value: apiData.stats?.totalProjects || 0,
      icon: FolderKanban,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Completed Tasks",
      value: apiData.stats?.completedTasks || 0,
      icon: FileText,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Total Tasks",
      value: apiData.stats?.totalTasks || 0,
      icon: Clock3,
      bg: "bg-orange-100",
      color: "text-orange-600",
    },
    {
      title: "Team Members",
      value: apiData.teamMembers?.length || 0,
      icon: Users,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Customer Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Track your project progress and updates
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
                  className={`text-sm ${
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

      {/* Chart + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <div
          className={`lg:col-span-2 p-6 rounded-2xl ${
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
              Project Progress
            </h2>

            <div className="flex gap-2">
              {["Monthly", "Weekly"].map((item) => (
                <button
                  key={item}
                  onClick={() => setChartFilter(item)}
                  className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                    chartFilter === item
                      ? "bg-[#0f766e] text-white"
                      : darkMode
                        ? "bg-gray-600 text-gray-200"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#4b5563" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="label"
                  stroke={darkMode ? "#d1d5db" : "#6b7280"}
                />
                <YAxis stroke={darkMode ? "#d1d5db" : "#6b7280"} />
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

        {/* Status */}
        <div
          className={`p-6 rounded-2xl ${
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
            Project Status
          </h2>

          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={75}
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
            onClick={() => navigate("/projects")}
            className={`p-5 rounded-2xl border text-center transition hover:shadow-md cursor-pointer ${
              darkMode
                ? "bg-gray-600 border-gray-500 hover:bg-gray-500"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="w-10 h-10 mx-auto mb-3 bg-blue-500 text-white rounded-xl flex items-center justify-center">
              <FolderKanban size={18} />
            </div>
            <p
              className={`font-medium ${
                darkMode ? "text-white" : "text-black"
              }`}
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
            <div className="w-10 h-10 mx-auto mb-3 bg-purple-500 text-white rounded-xl flex items-center justify-center">
              <Users size={18} />
            </div>
            <p
              className={`font-medium ${
                darkMode ? "text-white" : "text-black"
              }`}
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
            <div className="w-10 h-10 mx-auto mb-3 bg-orange-500 text-white rounded-xl flex items-center justify-center">
              <FileText size={18} />
            </div>
            <p
              className={`font-medium ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              View Reports
            </p>
          </button>

          <button
            onClick={() => navigate("/notifications")}
            className={`p-5 rounded-2xl border text-center transition hover:shadow-md cursor-pointer ${
              darkMode
                ? "bg-gray-600 border-gray-500 hover:bg-gray-500"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="w-10 h-10 mx-auto mb-3 bg-red-500 text-white rounded-xl flex items-center justify-center">
              <Eye size={18} />
            </div>
            <p
              className={`font-medium ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              View Updates
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
