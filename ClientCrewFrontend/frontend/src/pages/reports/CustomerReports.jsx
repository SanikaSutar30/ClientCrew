import { useState } from "react";
import {
  FolderKanban,
  CircleDollarSign,
  CheckCircle2,
  Clock3,
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
  BarChart,
  Bar,
} from "recharts";

export default function CustomerReports({ darkMode }) {
  const [progressFilter, setProgressFilter] = useState("Monthly");

  const monthlyProgressData = [
    { name: "Jan", progress: 20 },
    { name: "Feb", progress: 35 },
    { name: "Mar", progress: 48 },
    { name: "Apr", progress: 60 },
    { name: "May", progress: 76 },
    { name: "Jun", progress: 90 },
  ];

  const weeklyProgressData = [
    { name: "W1", progress: 55 },
    { name: "W2", progress: 65 },
    { name: "W3", progress: 75 },
    { name: "W4", progress: 90 },
  ];

  const progressData =
    progressFilter === "Monthly" ? monthlyProgressData : weeklyProgressData;

  const milestoneData = [
    { name: "Completed", value: 55, color: "#22c55e" },
    { name: "In Progress", value: 30, color: "#3b82f6" },
    { name: "Pending", value: 15, color: "#f59e0b" },
  ];

  const invoiceData = [
    { name: "Jan", amount: 18000 },
    { name: "Feb", amount: 25000 },
    { name: "Mar", amount: 22000 },
    { name: "Apr", amount: 30000 },
  ];

  const recentUpdates = [
    {
      id: 1,
      title: "UI dashboard module completed",
      date: "16 Apr 2026",
      status: "Completed",
    },
    {
      id: 2,
      title: "Reports module under development",
      date: "15 Apr 2026",
      status: "In Progress",
    },
    {
      id: 3,
      title: "Backend API integration planned",
      date: "13 Apr 2026",
      status: "Pending",
    },
    {
      id: 4,
      title: "Client review meeting scheduled",
      date: "12 Apr 2026",
      status: "Upcoming",
    },
  ];

  const customerStats = [
    {
      title: "My Projects",
      value: "3",
      icon: FolderKanban,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      changeClass: "text-green-600 bg-green-100",
    },
    {
      title: "Completed Milestones",
      value: "14",
      icon: CheckCircle2,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      changeClass: "text-green-600 bg-green-100",
    },
    {
      title: "Pending Milestones",
      value: "5",
      icon: Clock3,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      changeClass: "text-red-600 bg-red-100",
    },
    {
      title: "Total Billing",
      value: "₹95,000",
      icon: CircleDollarSign,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      changeClass: "text-green-600 bg-green-100",
    },
  ];

  const getStatusClasses = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-600";
      case "In Progress":
        return "bg-blue-100 text-blue-600";
      case "Pending":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-purple-100 text-purple-600";
    }
  };

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
          View your project progress, milestones, billing, and recent updates
        </p>
      </div>

      {/* cards */}
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
              {/* LEFT */}
              <div>
                <p
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {item.title}
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <h2
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {item.value}
                  </h2>

                </div>
              </div>

              {/* RIGHT ICON */}
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl ${item.iconBg}`}
              >
                <Icon size={22} className={item.iconColor} />
              </div>
            </div>
          );
        })}
      </div>
      

      <div
        className={`p-5 rounded-xl shadow-sm min-w-0 ${
          darkMode
            ? "bg-gray-700 border border-gray-600"
            : "bg-white border border-gray-200"
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

          <div
            className={`flex items-center rounded-full p-1 ${
              darkMode ? "bg-gray-600" : "bg-gray-100"
            }`}
          >
            <button
              onClick={() => setProgressFilter("Monthly")}
              className={`px-4 py-1.5 cursor-pointer rounded-full text-sm font-medium transition ${
                progressFilter === "Monthly"
                  ? darkMode
                    ? "bg-gray-500 text-white"
                    : "bg-white text-gray-700 shadow-sm"
                  : darkMode
                    ? "text-gray-300"
                    : "text-gray-500"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setProgressFilter("Weekly")}
              className={`px-4 py-1.5 cursor-pointer rounded-full text-sm font-medium transition ${
                progressFilter === "Weekly"
                  ? darkMode
                    ? "bg-gray-500 text-white"
                    : "bg-white text-gray-700 shadow-sm"
                  : darkMode
                    ? "text-gray-300"
                    : "text-gray-500"
              }`}
            >
              Weekly
            </button>
          </div>
        </div>

        <div className="w-full h-[300px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData}>
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
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? "#374151" : "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  color: darkMode ? "#ffffff" : "#111827",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                }}
              />
              <Line
                type="monotone"
                dataKey="progress"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
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
            Milestones
          </h2>

          <div className="flex items-center justify-between gap-4 min-w-0">
            <div className="w-[170px] h-[170px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={milestoneData}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {milestoneData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4 min-w-0">
              {milestoneData.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  <div>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {item.name}
                    </p>
                    <p
                      className={`font-semibold ${
                        darkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {item.value}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
            Billing Summary
          </h2>

          <div className="w-full h-[250px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={invoiceData}>
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
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? "#374151" : "#ffffff",
                    border: "none",
                    borderRadius: "12px",
                    color: darkMode ? "#ffffff" : "#111827",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                  }}
                />
                <Bar dataKey="amount" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
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
            {recentUpdates.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl ${
                  darkMode ? "bg-gray-600" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {item.date}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusClasses(
                      item.status,
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
