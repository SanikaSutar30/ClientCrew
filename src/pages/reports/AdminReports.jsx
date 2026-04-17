import { useState } from "react";
import { Users, Folder, IndianRupee, FileText, MapPin } from "lucide-react";
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

export default function AdminReports({ darkMode }) {
  const [chartFilter, setChartFilter] = useState("Monthly");

  const monthlyGrowthData = [
    { month: "Jan", customers: 40 },
    { month: "Feb", customers: 80 },
    { month: "Mar", customers: 95 },
    { month: "Apr", customers: 110 },
    { month: "May", customers: 160 },
    { month: "Jun", customers: 205 },
  ];

  const weeklyGrowthData = [
    { month: "Week 1", customers: 18 },
    { month: "Week 2", customers: 42 },
    { month: "Week 3", customers: 65 },
    { month: "Week 4", customers: 88 },
  ];

  const growthData =
    chartFilter === "Monthly" ? monthlyGrowthData : weeklyGrowthData;

  const sourceData = [
    { name: "Direct", value: 45, color: "#0f766e" },
    { name: "Referral", value: 25, color: "#3b82f6" },
    { name: "Organic", value: 20, color: "#f59e0b" },
    { name: "Others", value: 10, color: "#6366f1" },
  ];

  const topCustomers = [
    {
      id: 1,
      name: "Rahul Sharma",
      orders: 32,
      total: "₹5,800",
      image: "../assets/Profile.jpg",
    },
    {
      id: 2,
      name: "Priya Singh",
      orders: 24,
      total: "₹4,900",
      image: "../assets/Profile2.jpg",
    },
    {
      id: 3,
      name: "Amit Patil",
      orders: 24,
      total: "₹3,700",
      image: "../assets/Profile3.jpg",
    },
    {
      id: 4,
      name: "John Doe",
      orders: 20,
      total: "₹3,200",
      image: "../assets/Profile4.jpg",
    },
    {
      id: 5,
      name: "Anjali Kapoor",
      orders: 18,
      total: "₹2,900",
      image: "../assets/Profile5.jpg",
    },
  ];

  const reportStats = [
    {
      title: "Total Customers",
      value: "2,450",
      change: "+12%",
      icon: Users,
      iconBg: "bg-[#0f766e]/10",
      iconColor: "text-[#0f766e]",
      changeClass: "text-green-600 bg-green-100",
    },
    {
      title: "Total Projects",
      value: "186",
      change: "+8%",
      icon: Folder,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      changeClass: "text-green-600 bg-green-100",
    },
    {
      title: "Revenue",
      value: "₹8,45,000",
      change: "+15%",
      icon: IndianRupee,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      changeClass: "text-green-600 bg-green-100",
    },
    {
      title: "Reports Generated",
      value: "128",
      change: "-2%",
      icon: FileText,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      changeClass: "text-red-600 bg-red-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div>
        <h1
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Reports
        </h1>
        <p className="text-sm text-gray-500">
          Analyze your customer data with detailed reports and insights
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportStats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`p-5 rounded-xl shadow-sm flex items-center justify-between transition hover:scale-[1.02] ${
                darkMode
                  ? "bg-gray-700 border border-gray-600"
                  : "bg-white border border-gray-200"
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

                <div className="flex items-end gap-3 mt-4">
                  <h2
                    className={`text-2xl font-bold ${
                      darkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {item.value}
                  </h2>

                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-md ${item.changeClass}`}
                  >
                    {item.change}
                  </span>
                </div>
              </div>

              <div className={`p-2 rounded-lg ${item.iconBg}`}>
                <Icon size={18} className={item.iconColor} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Growth Chart */}
      <div
        className={`p-5 rounded-xl shadow-sm ${
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
            Customer Growth
          </h2>

          <div
            className={`flex items-center rounded-full p-1 ${
              darkMode ? "bg-gray-600" : "bg-gray-100"
            }`}
          >
            <button
              onClick={() => setChartFilter("Monthly")}
              className={`px-4 py-1.5 cursor-pointer rounded-full text-sm font-medium transition ${
                chartFilter === "Monthly"
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
              onClick={() => setChartFilter("Weekly")}
              className={`px-4 py-1.5 cursor-pointer rounded-full text-sm font-medium transition ${
                chartFilter === "Weekly"
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

        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
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
                dataKey="customers"
                stroke="#0f766e"
                strokeWidth={3}
                dot={{
                  r: 5,
                  fill: "#ffffff",
                  stroke: "#0f766e",
                  strokeWidth: 3,
                }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Customers by Source */}
        <div
          className={`lg:col-span-4 p-5 rounded-xl shadow-sm ${
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
            Customers by Source
          </h2>

          <div className="flex items-center justify-between gap-4">
            <div className="w-[170px] h-[170px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              {sourceData.map((item, index) => (
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

        {/* Top Customers */}
        <div
          className={`lg:col-span-4 p-5 rounded-xl shadow-sm ${
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
            Top Customers
          </h2>

          <div
            className={`grid grid-cols-[2fr_1fr_1fr] px-3 py-2 rounded-xl text-sm font-semibold ${
              darkMode ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            <span>Name</span>
            <span className="text-center">Orders</span>
            <span className="text-right">Total</span>
          </div>

          <div className="space-y-2 mt-3">
            {topCustomers.map((customer) => (
              <div
                key={customer.id}
                className={`grid grid-cols-[2fr_1fr_1fr] items-center px-3 py-3 rounded-xl transition ${
                  darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 shrink-0">
                    <img
                      src={customer.image}
                      alt={customer.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <span
                    className={`font-medium truncate ${
                      darkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {customer.name}
                  </span>
                </div>

                <span
                  className={`text-center ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {customer.orders}
                </span>

                <span
                  className={`text-right font-medium ${
                    darkMode ? "text-white" : "text-black"
                  }`}
                >
                  {customer.total}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Locations */}
        <div
          className={`lg:col-span-4 p-5 rounded-xl shadow-sm ${
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
            Customer Locations
          </h2>

          <div
            className={`relative h-[280px] rounded-xl overflow-hidden ${
              darkMode ? "bg-gray-600" : "bg-gray-100"
            }`}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
              alt="World Map"
              className="w-full h-full object-cover opacity-70"
            />

            <div className="absolute top-[28%] left-[22%]">
              <MapPin size={24} className="text-[#0f766e] fill-[#0f766e]" />
            </div>
            <div className="absolute top-[58%] left-[42%]">
              <MapPin size={24} className="text-[#0f766e] fill-[#0f766e]" />
            </div>
            <div className="absolute top-[28%] left-[58%]">
              <MapPin size={24} className="text-[#0f766e] fill-[#0f766e]" />
            </div>
            <div className="absolute top-[30%] left-[82%]">
              <MapPin size={24} className="text-[#0f766e] fill-[#0f766e]" />
            </div>
            <div className="absolute top-[70%] left-[90%]">
              <MapPin size={24} className="text-[#0f766e] fill-[#0f766e]" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition  cursor-pointer ${
                darkMode
                  ? "bg-gray-600 text-white hover:bg-gray-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              <button
                className={`w-9 h-9 rounded-lg text-sm font-medium cursor-pointer ${
                  darkMode
                    ? "bg-gray-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                1
              </button>
              <button
                className={`w-9 h-9 rounded-lg text-sm font-medium transition cursor-pointer ${
                  darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-200"
                }`}
              >
                2
              </button>
              <button
                className={`w-9 h-9 rounded-lg text-sm font-medium transition cursor-pointer ${
                  darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-200"
                }`}
              >
                3
              </button>
              <button
                className={`w-9 h-9 rounded-lg text-sm font-medium cursor-pointer ${
                  darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-50 text-gray-500"
                }`}
              >
                ...
              </button>
            </div>

            <button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                darkMode
                  ? "bg-gray-600 text-white hover:bg-gray-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Next
            </button>
                  </div>
                  
        </div>
      </div>
    </div>
  );
}
