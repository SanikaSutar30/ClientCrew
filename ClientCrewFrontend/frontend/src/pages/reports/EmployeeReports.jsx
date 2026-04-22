import { useState } from "react";
import { CheckCircle2, Clock3, FolderKanban, CalendarDays } from "lucide-react";
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

export default function EmployeeReports({ darkMode }) {
  const [performanceFilter, setPerformanceFilter] = useState("Monthly");

  const monthlyTaskData = [
    { name: "Jan", completed: 8, pending: 4 },
    { name: "Feb", completed: 10, pending: 5 },
    { name: "Mar", completed: 14, pending: 4 },
    { name: "Apr", completed: 16, pending: 3 },
    { name: "May", completed: 18, pending: 3 },
    { name: "Jun", completed: 20, pending: 2 },
  ];

  const weeklyTaskData = [
    { name: "W1", completed: 3, pending: 2 },
    { name: "W2", completed: 4, pending: 1 },
    { name: "W3", completed: 5, pending: 1 },
    { name: "W4", completed: 6, pending: 1 },
  ];

  const performanceData =
    performanceFilter === "Monthly" ? monthlyTaskData : weeklyTaskData;

  const taskStatusData = [
    { name: "Completed", value: 55, color: "#22c55e" },
    { name: "In Progress", value: 25, color: "#3b82f6" },
    { name: "Pending", value: 12, color: "#f59e0b" },
    { name: "Overdue", value: 8, color: "#ef4444" },
  ];

  const contributionData = [
    { name: "CRM", tasks: 10 },
    { name: "UI", tasks: 7 },
    { name: "API", tasks: 5 },
    { name: "Testing", tasks: 4 },
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      task: "Update dashboard cards",
      date: "18 Apr 2026",
      status: "High",
    },
    {
      id: 2,
      task: "Finish reports module",
      date: "19 Apr 2026",
      status: "Medium",
    },
    {
      id: 3,
      task: "Connect project form UI",
      date: "21 Apr 2026",
      status: "Low",
    },
    {
      id: 4,
      task: "Review employee page",
      date: "22 Apr 2026",
      status: "Medium",
    },
  ];

  const employeeStats = [
    {
      title: "Completed Tasks",
      value: "48",
      icon: CheckCircle2,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      changeClass: "text-green-600 bg-green-100",
    },
    {
      title: "Pending Tasks",
      value: "11",
      icon: Clock3,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      changeClass: "text-red-600 bg-red-100",
    },
    {
      title: "My Projects",
      value: "6",
      icon: FolderKanban,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      changeClass: "text-green-600 bg-green-100",
    },
    {
      title: "Upcoming Deadlines",
      value: "4",
      icon: CalendarDays,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      changeClass: "text-green-600 bg-green-100",
    },
  ];

  const getPriorityClasses = (status) => {
    switch (status) {
      case "High":
        return "bg-red-100 text-red-600";
      case "Medium":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-green-100 text-green-600";
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
          Employee Reports
        </h1>
        <p className="text-sm text-gray-500">
          Track your tasks, project contribution, and upcoming deadlines
        </p>
      </div>

      {/* cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {employeeStats.map((item) => {
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

                <h2
                  className={`text-2xl font-bold mt-2 ${
                    darkMode ? "text-white" : "text-black"
                  }`}
                >
                  {item.value}
                </h2>
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
            My Task Performance
          </h2>

          <div
            className={`flex items-center rounded-full p-1 ${
              darkMode ? "bg-gray-600" : "bg-gray-100"
            }`}
          >
            <button
              onClick={() => setPerformanceFilter("Monthly")}
              className={`px-4 py-1.5 cursor-pointer rounded-full text-sm font-medium transition ${
                performanceFilter === "Monthly"
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
              onClick={() => setPerformanceFilter("Weekly")}
              className={`px-4 py-1.5 cursor-pointer rounded-full text-sm font-medium transition ${
                performanceFilter === "Weekly"
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
            <LineChart data={performanceData}>
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
                dataKey="completed"
                stroke="#22c55e"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="pending"
                stroke="#f59e0b"
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
            Task Status
          </h2>

          <div className="flex items-center justify-between gap-4 min-w-0">
            <div className="w-[170px] h-[170px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4 min-w-0">
              {taskStatusData.map((item, index) => (
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
            Project Contribution
          </h2>

          <div className="w-full h-[250px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contributionData}>
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
                <Bar dataKey="tasks" fill="#3b82f6" radius={[6, 6, 0, 0]} />
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
            Upcoming Deadlines
          </h2>

          <div className="space-y-3">
            {upcomingDeadlines.map((item) => (
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
                      {item.task}
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
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${getPriorityClasses(
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
