import { useEffect, useState } from "react";
import { FolderKanban, CheckCircle2, Clock3, BarChart3 } from "lucide-react";
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

export default function CustomerReports({ darkMode }) {
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
      console.error("Failed to load customer reports:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <p className={darkMode ? "text-white" : "text-gray-700"}>
        Loading customer reports...
      </p>
    );
  }

  if (!report) {
    return <p className="text-red-500">Failed to load customer reports.</p>;
  }

  const summary = report.summary;
  const recentActivities = report.recentActivities || [];

  const customerStats = [
    {
      title: "My Projects",
      value: summary.totalProjects,
      icon: FolderKanban,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Completed Work",
      value: summary.completedTasks,
      icon: CheckCircle2,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Pending Work",
      value: summary.pendingTasks,
      icon: Clock3,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Total Tasks",
      value: summary.totalTasks,
      icon: BarChart3,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Customer Reports
        </h1>
        <p className="text-sm text-gray-500">
          View your project progress, completed work, pending work, and updates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {customerStats.map((item) => {
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
                className={`w-12 h-12 flex items-center justify-center rounded-xl ${item.iconBg}`}
              >
                <Icon size={22} className={item.iconColor} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
        <div
          className={`lg:col-span-4 p-5 rounded-xl shadow-sm min-w-0 ${
            darkMode
              ? "bg-gray-700 border border-gray-600"
              : "bg-white border border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-4 ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            Work Status
          </h2>

          <div className="w-full h-[230px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={report.taskStatusChart}
                  dataKey="value"
                  innerRadius={55}
                  outerRadius={85}
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

          <div className="space-y-3 mt-4">
            {report.taskStatusChart.map((item, index) => (
              <div key={item.name} className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></span>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {item.name}:{" "}
                  <span className="font-semibold">{item.value}</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`lg:col-span-4 p-5 rounded-xl shadow-sm min-w-0 ${
            darkMode
              ? "bg-gray-700 border border-gray-600"
              : "bg-white border border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-4 ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            Project Progress
          </h2>

          <div className="w-full h-[280px] min-w-0">
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

        <div
          className={`lg:col-span-4 p-5 rounded-xl shadow-sm min-w-0 ${
            darkMode
              ? "bg-gray-700 border border-gray-600"
              : "bg-white border border-gray-200"
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-4 ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            Recent Updates
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
                  className={`p-3 rounded-xl ${
                    darkMode ? "bg-gray-600" : "bg-gray-50"
                  }`}
                >
                  <h3
                    className={`font-medium ${
                      darkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {activity.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
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
    </div>
  );
}
