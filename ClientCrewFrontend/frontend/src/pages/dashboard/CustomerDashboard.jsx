import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FolderKanban, Users, FileText, Clock3, Eye } from "lucide-react";
import { getAllProjects } from "../../services/projectService";

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
  const [projects, setProjects] = useState([]);

  const [chartFilter, setChartFilter] = useState("Monthly");

  // Project progress data
  const monthlyData = [
    { name: "Jan", progress: 20 },
    { name: "Feb", progress: 35 },
    { name: "Mar", progress: 50 },
    { name: "Apr", progress: 65 },
    { name: "May", progress: 80 },
    { name: "Jun", progress: 95 },
  ];

  const weeklyData = [
    { name: "W1", progress: 50 },
    { name: "W2", progress: 65 },
    { name: "W3", progress: 75 },
    { name: "W4", progress: 90 },
  ];

  const chartData = chartFilter === "Monthly" ? monthlyData : weeklyData;

  const projectStatusData = [
    { name: "Completed", value: 2, color: "#22c55e" },
    { name: "In Progress", value: 1, color: "#3b82f6" },
    { name: "Pending", value: 1, color: "#f59e0b" },
  ];

  const stats = [
    {
      title: "My Projects",
      value: projects.length,
      icon: FolderKanban,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      title: "Completed",
      value: projects.length,
      icon: FileText,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "In Progress",
      value: projects.length,
      icon: Clock3,
      bg: "bg-orange-100",
      color: "text-orange-600",
    },
    {
      title: "Team Members",
      value: projects.length,
      icon: Users,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
  ];

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
                <p className="text-sm text-gray-500">{item.title}</p>
                <h2 className="text-2xl font-bold mt-2">{item.value}</h2>
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
            <h2 className="text-xl font-semibold">Project Progress</h2>

            <div className="flex gap-2">
              {["Monthly", "Weekly"].map((item) => (
                <button
                  key={item}
                  onClick={() => setChartFilter(item)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    chartFilter === item
                      ? "bg-[#0f766e] text-white"
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="progress"
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
          <h2 className="text-xl font-semibold mb-4">Project Status</h2>

          <div className="h-[200px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={75}
                >
                  {projectStatusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
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
          {/* View Projects */}
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

          {/* View Team */}
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

          {/* View Reports */}
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

          {/* View Updates */}
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
