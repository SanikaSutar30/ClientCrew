import { Search, Plus, Download } from "lucide-react";

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

        {/* EMPTY STATE */}
        <div className="p-6 text-center text-gray-500 text-sm">
          No customers found
        </div>
      </div>
    </div>
  );
}
