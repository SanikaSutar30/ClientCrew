import { Search, Plus, Download, Eye, Pencil, Trash2 } from "lucide-react";

// Mock customer data- in real app, this would come from an API
const customers = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    phone: "+91 9876543210",
    status: "Active",
    joined: "Jan 12, 2024",
  },
  {
    id: 2,
    name: "Amit Patil",
    email: "amit@gmail.com",
    phone: "+91 9123456789",
    status: "Active",
    joined: "Feb 03, 2024",
  },
  {
    id: 3,
    name: "Priya Singh",
    email: "priya@gmail.com",
    phone: "+91 9988776655",
    status: "Pending",
    joined: "Mar 18, 2024",
  },
  {
    id: 4,
    name: "John Doe",
    email: "john@gmail.com",
    phone: "+91 8877655443",
    status: "Inactive",
    joined: "Apr 02, 2024",
  },
  {
    id: 5,
    name: "Neha Verma",
    email: "neha@gmail.com",
    phone: "+91 9284711223",
    status: "Active",
    joined: "Apr 10, 2024",
  },
  {
    id: 6,
    name: "Suresh Reddy",
    email: "suresh@gmail.com",
    phone: "+91 9032144556",
    status: "Active",
    joined: "May 22, 2024",
  },
];

export default function Customers({ darkMode }) {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm text-gray-500">
            Manage your customers and their information
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
              darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            <Download size={16} />
            Export
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#0f766e] text-white hover:opacity-90">
            <Plus size={16} />
            Add Customer
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Customers", value: "256" },
          { title: "Active Customers", value: "231" },
          { title: "New This Month", value: "12" },
          { title: "Inactive", value: "25" },
        ].map((item, index) => (
          <div
            key={index}
            className={`p-5 rounded-xl shadow-sm ${
              darkMode ? "bg-gray-700 border border-gray-600" : "bg-white"
            }`}
          >
            <p className="text-sm text-gray-500">{item.title}</p>
            <h2 className="text-2xl font-bold mt-2">{item.value}</h2>
          </div>
        ))}
      </div>

      {/* MAIN TABLE CARD */}
      <div
        className={`rounded-xl shadow-sm overflow-hidden ${
          darkMode
            ? "bg-gray-700 border border-gray-600"
            : "bg-white border border-gray-200"
        }`}
      >
        {/* SEARCH + FILTER ROW */}
        <div
          className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border-b ${
            darkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
          {/* SEARCH */}
          <div
            className={`flex items-center px-3 py-2 rounded-lg w-full md:w-80 border ${
              darkMode
                ? "bg-gray-600 border-gray-500"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search customers..."
              className="bg-transparent outline-none ml-2 w-full text-sm"
            />
          </div>

          {/* FILTERS */}
          <div className="flex gap-3">
            <select
              className={`px-3 py-2 rounded-lg text-sm border  cursor-pointer ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-700"
              }`}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Inactive</option>
            </select>

            <select
              className={`px-3 py-2 rounded-lg text-sm border cursor-pointer ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-700"
              }`}
            >
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </div>
        </div>

        {/* TABLE HEADER */}
        <div className="px-4 pt-3">
          <div
            className={`grid grid-cols-7 px-4 py-3 text-sm font-semibold rounded-lg ${
              darkMode ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            <span>ID</span>
            <span>Customer Name</span>
            <span>Email</span>
            <span>Phone</span>
            <span>Status</span>
            <span>Joined</span>
            <span>Actions</span>
          </div>
        </div>

        <div className="px-4 pb-4">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className={`grid grid-cols-7 items-center px-4 py-4 border-b last:border-b-0 ${
                darkMode ? "border-gray-600" : "border-gray-100"
              }`}
            >
              {/* ID */}
              <span>{customer.id}</span>

              {/* Name */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <span className="font-medium">{customer.name}</span>
              </div>

              {/* Email */}
              <span className={darkMode ? "text-gray-300" : "text-gray-500"}>
                {customer.email}
              </span>

              {/* Phone */}
              <span className={darkMode ? "text-gray-300" : "text-gray-500"}>
                {customer.phone}
              </span>

              {/* Status */}
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full w-fit ${
                  customer.status === "Active"
                    ? "bg-green-100 text-green-600"
                    : customer.status === "Pending"
                      ? "bg-orange-100 text-orange-600"
                      : "bg-red-100 text-red-600"
                }`}
              >
                {customer.status}
              </span>

              {/* Joined */}
              <span className={darkMode ? "text-gray-300" : "text-gray-500"}>
                {customer.joined}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100">
                  <Pencil size={16} />
                </button>
                <button className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100">
                  <Trash2 size={16} />
                </button>
                <button className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
                  <Eye size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
