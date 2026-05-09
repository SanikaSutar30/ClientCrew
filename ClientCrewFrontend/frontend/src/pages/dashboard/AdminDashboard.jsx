import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Calendar,
  UserPlus,
  FileText,
  ShieldCheck,
  Settings,
  ChevronDown,
  Users,
  UserCheck,
  Folder,
  Activity,
} from "lucide-react";

import AddCustomer from "../customers/AddCustomer";
import { getDashboardData } from "../../services/dashboardService";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboard({ darkMode }) {
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("This Month");
  const [open, setOpen] = useState(false);
  const [chartFilter, setChartFilter] = useState("Monthly");

  const options = ["Today", "This Week", "This Month", "This Year"];

  const sourceData = [
    {
      label: "Projects",
      value: apiData?.stats?.totalProjects || 0,
      color: "#0f766e",
    },
    {
      label: "Tasks",
      value: apiData?.stats?.totalTasks || 0,
      color: "#3b82f6",
    },
    {
      label: "Employees",
      value: apiData?.stats?.totalEmployees || 0,
      color: "#f59e0b",
    },
    {
      label: "Customers",
      value: apiData?.stats?.totalCustomers || 0,
      color: "#6366f1",
    },
  ];

  const getBackendFilter = (filter) => {
    switch (filter) {
      case "Today":
        return "TODAY";
      case "This Week":
        return "THIS_WEEK";
      case "This Month":
        return "THIS_MONTH";
      case "This Year":
        return "THIS_YEAR";
      default:
        return "THIS_MONTH";
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboardData(getBackendFilter(selectedFilter));
        setApiData(data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };

    loadDashboard();
  }, [selectedFilter]);
  const handleAddCustomer = () => {
    setShowAddModal(false);
  };

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

  const customerGrowthData =
    apiData.customerGrowth?.length > 0
      ? apiData.customerGrowth
      : [
          { label: "Projects", value: apiData.stats?.totalProjects || 0 },
          { label: "Tasks", value: apiData.stats?.totalTasks || 0 },
          { label: "Employees", value: apiData.stats?.totalEmployees || 0 },
          { label: "Customers", value: apiData.stats?.totalCustomers || 0 },
        ];

  const monthlyChartData = customerGrowthData;

  const weeklyChartData = [
    { label: "Week 1", value: apiData.stats?.totalProjects || 0 },
    { label: "Week 2", value: apiData.stats?.totalTasks || 0 },
    { label: "Week 3", value: apiData.stats?.totalEmployees || 0 },
    { label: "Week 4", value: apiData.stats?.totalCustomers || 0 },
  ];

  const systemOverviewData =
    chartFilter === "Monthly" ? monthlyChartData : weeklyChartData;

  const recentCustomers = apiData.recentCustomers || [];

  return (
    <div className="space-y-6">
      {showAddModal && (
        <AddCustomer
          darkMode={darkMode}
          setShowAddModal={setShowAddModal}
          onAddCustomer={handleAddCustomer}
        />
      )}

      {/* //first row  header + filter */}
      <div className="flex items-center justify-between">
        {/* // header */}
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Monitor your business metrics and performance
          </p>
        </div>

        {/* // filter dropdown */}
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
          >
            <Calendar
              size={18}
              className={darkMode ? "text-gray-300" : "text-gray-500"}
            />
            <span
              className={`text-sm font-medium ${
                darkMode ? "text-white" : "text-gray-700"
              }`}
            >
              {selectedFilter}
            </span>
            <ChevronDown
              size={16}
              className={darkMode ? "text-gray-300" : "text-gray-500"}
            />
          </div>

          {open && (
            <div
              className={`absolute right-0 mt-2 w-40 rounded-xl shadow-md border z-50 ${
                darkMode ? "bg-gray-700 border-gray-600" : "bg-white"
              }`}
            >
              {options.map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    setSelectedFilter(item);
                    setOpen(false);
                  }}
                  className={`px-4 py-2 text-sm cursor-pointer rounded-lg ${
                    darkMode
                      ? "text-gray-200 hover:bg-gray-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* //second row - cards */}

      {/* cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Customers",
            value: apiData.stats?.totalCustomers || 0,
            icon: Users,
            bg: "bg-[#0f766e]/10",
            color: "text-[#0f766e]",
          },
          {
            title: "Total Employees",
            value: apiData.stats?.totalEmployees || 0,
            icon: UserCheck,
            bg: "bg-blue-100",
            color: "text-blue-600",
          },
          {
            title: "Total Projects",
            value: apiData.stats?.totalProjects || 0,
            icon: Folder,
            bg: "bg-purple-100",
            color: "text-purple-600",
          },
          {
            title: "Total Tasks",
            value: apiData.stats?.totalTasks || 0,
            icon: Activity,
            bg: "bg-orange-100",
            color: "text-orange-600",
          },
        ].map((item) => {
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

      {/* // third row - System Overview  charts + recent customers */}

      <div
        className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        } p-6 rounded-2xl border ${
          darkMode ? "border-gray-600" : "border-gray-200"
        }`}
      >
        {/* //System Overview */}
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
              System Overview
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
                  className={`px-4 py-1.5 cursor-pointer rounded-full text-sm font-medium transition ${
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
              <LineChart data={systemOverviewData}>
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
                  dataKey="value"
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

        {/* recent customers */}
        <div
          className={`p-6 rounded-2xl shadow-sm ${
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
              Recent Customers
            </h2>
            <button
              onClick={() => navigate("/customers")}
              className="text-sm cursor-pointer font-medium text-[#0f766e] hover:underline hover:text-[#115e59] transition"
            >
              View All
            </button>
          </div>

          <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
            {recentCustomers.length === 0 ? (
              <p className="text-sm text-gray-500">
                No recent customers found.
              </p>
            ) : (
              recentCustomers.map((customer) => (
                <div
                  key={customer.userId}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-300 shrink-0">
                      {customer.userImage ? (
                        <img
                          src={customer.userImage}
                          alt={customer.fullName}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <Users className="m-2 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <h3
                        className={`text-base font-semibold ${
                          darkMode ? "text-white" : "text-black"
                        }`}
                      >
                        {customer.fullName}
                      </h3>
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {customer.email}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-600">
                    {customer.status || "Active"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* // fourth row - system distribution + top employees + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Customer Source */}
        <div
          className={`lg:col-span-4 p-6 rounded-2xl shadow-sm ${
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
            System Distribution
          </h2>

          <div className="flex items-center justify-between gap-4">
            <div className="w-[150px] h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    dataKey="value"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
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
                      {item.label}
                    </p>
                    <p className="font-semibold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Employees */}
        <div
          className={`lg:col-span-4 p-3 rounded-2xl shadow-sm ${
            darkMode
              ? "bg-gray-700 border border-gray-600"
              : "bg-white border border-gray-100"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              Top Employees
            </h2>

            <button
              onClick={() => navigate("/employees")}
              className="text-sm cursor-pointer font-medium text-[#0f766e] hover:underline hover:text-[#115e59] transition"
            >
              View All
            </button>
          </div>
          <div
            className={`grid grid-cols-[2fr_2fr_auto] px-3 py-2 rounded-xl text-sm font-semibold ${
              darkMode ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            <span>Name</span>
            <span>Role</span>
            <span className="text-right">Status</span>
          </div>

          <div className="space-y-3">
            {(apiData?.teamMembers || []).length === 0 ? (
              <p className="text-sm text-gray-500 px-3 py-4">
                No employees found.
              </p>
            ) : (
              (apiData?.teamMembers || []).map((employee) => (
                <div
                  key={employee.userId}
                  className={`grid grid-cols-[2fr_2fr_auto] items-center px-3 py-2 rounded-xl transition cursor-pointer ${
                    darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center">
                      {employee.userImage ? (
                        <img
                          src={employee.userImage}
                          alt={employee.fullName}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <Users size={16} className="text-gray-500" />
                      )}
                    </div>
                    <span className="font-medium">{employee.fullName}</span>
                  </div>

                  <span
                    className={`truncate ${
                      darkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {employee.role}
                  </span>

                  <span className="text-xs font-semibold px-3 py-1 rounded-full w-fit ml-auto bg-blue-100 text-blue-600">
                    {employee.status || "Active"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className={`lg:col-span-4 p-3 rounded-2xl shadow-sm ${
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
              onClick={() => setShowAddModal(true)}
              className={`p-5 rounded-2xl border text-center transition hover:shadow-md cursor-pointer ${
                darkMode
                  ? "bg-gray-600 border-gray-500 hover:bg-gray-500"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-[#0f766e] text-white flex items-center justify-center">
                <UserPlus size={18} />
              </div>
              <p
                className={`font-medium ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                Add Customer
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
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-blue-500 text-white flex items-center justify-center">
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
              onClick={() => navigate("/users")}
              className={`p-5 rounded-2xl border text-center transition hover:shadow-md cursor-pointer ${
                darkMode
                  ? "bg-gray-600 border-gray-500 hover:bg-gray-500"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-yellow-500 text-white flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <p
                className={`font-medium ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                Manage Users
              </p>
            </button>

            <button
              onClick={() => navigate("/settings")}
              className={`p-5 rounded-2xl border text-center transition hover:shadow-md cursor-pointer ${
                darkMode
                  ? "bg-gray-600 border-gray-500 hover:bg-gray-500"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-red-500 text-white flex items-center justify-center">
                <Settings size={18} />
              </div>
              <p
                className={`font-medium ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                Settings
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
