import { useEffect, useState } from "react";

import {
  Users,
  Folder,
  CheckCircle2,
  Clock3,
  AlertCircle,
  ListChecks,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { getReportsDashboard } from "../../services/reportService";

export default function AdminReports({ darkMode }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const data = await getReportsDashboard();
      setReport(data);
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <p className={darkMode ? "text-white" : "text-gray-700"}>
        Loading reports...
      </p>
    );
  }

  if (!report) {
    return <p className="text-red-500">Failed to load reports.</p>;
  }

  const summary = report.summary;
  const recentActivities = report.recentActivities || [];

  const reportStats = [
    {
      title: "Total Users",
      value: summary.totalUsers,
      icon: Users,
      iconBg: "bg-[#0f766e]/10",
      iconColor: "text-[#0f766e]",
    },
    {
      title: "Total Projects",
      value: summary.totalProjects,
      icon: Folder,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Completed Tasks",
      value: summary.completedTasks,
      icon: CheckCircle2,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Blocked Tasks",
      value: summary.blockedTasks,
      icon: AlertCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    {
      title: "Total Employees",
      value: summary.totalEmployees,
      icon: Users,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Customers",
      value: summary.totalCustomers,
      icon: Users,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "In Progress Tasks",
      value: summary.inProgressTasks,
      icon: Clock3,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Pending Tasks",
      value: summary.pendingTasks,
      icon: ListChecks,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1
          className={`text-2xl font-bold ${darkMode ? "text-white" : "text-black"}`}
        >
          Admin Reports
        </h1>
        <p className="text-sm text-gray-500">
          Full system analytics for users, projects, tasks, and productivity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportStats.map((item) => {
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
                  className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                >
                  {item.title}
                </p>
                <h2
                  className={`text-2xl font-bold mt-2 ${darkMode ? "text-white" : "text-black"}`}
                >
                  {item.value}
                </h2>
              </div>

              <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl ${item.iconBg}`}
              >
                <Icon size={22} className={item.iconColor} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div
          className={`lg:col-span-6 p-5 rounded-xl shadow-sm ${
            darkMode
              ? "bg-gray-700 border border-gray-600"
              : "bg-white border border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-black"}`}
          >
            Task Status Distribution
          </h2>

          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={report.taskStatusChart}
                  dataKey="value"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {report.taskStatusChart.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {report.taskStatusChart.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></span>
                <span
                  className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`lg:col-span-6 p-5 rounded-xl shadow-sm ${
            darkMode
              ? "bg-gray-700 border border-gray-600"
              : "bg-white border border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-black"}`}
          >
            Project Progress
          </h2>

          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report.productivityChart}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={darkMode ? "#4b5563" : "#e5e7eb"}
                />
                <XAxis
                  dataKey="name"
                  stroke={darkMode ? "#d1d5db" : "#6b7280"}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={darkMode ? "#d1d5db" : "#6b7280"}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip cursor={false} formatter={() => null} />
                <Bar
                  dataKey="value"
                  fill="#0f766e"
                  radius={[6, 6, 0, 0]}
                  barSize={30}
                  minPointSize={0}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div
        className={`p-5 rounded-xl shadow-sm ${
          darkMode
            ? "bg-gray-700 border border-gray-600"
            : "bg-white border border-gray-200"
        }`}
      >
        <h2
          className={`text-xl font-semibold mb-4 ${darkMode ? "text-white" : "text-black"}`}
        >
          Recent Activity
        </h2>

        <div className="space-y-3">
          {recentActivities.length === 0 ? (
            <p
              className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}
            >
              No recent activity found.
            </p>
          ) : (
            recentActivities.map((activity, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl ${darkMode ? "bg-gray-600" : "bg-gray-50"}`}
              >
                <h3
                  className={`font-medium ${darkMode ? "text-white" : "text-black"}`}
                >
                  {activity.title}
                </h3>
                <p
                  className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                >
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
