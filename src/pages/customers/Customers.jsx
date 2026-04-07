import { Search, Plus, Download, Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
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
  // State for search term, status filter, and sort order
  const [searchTerm, setSearchTerm] = useState("");
  // Status filter can be "All", "Active", "Pending", or "Inactive"
  const [statusFilter, setStatusFilter] = useState("All");
  // Sort order can be "Newest" or "Oldest"
  const [sortOrder, setSortOrder] = useState("Newest");

  // Filter and sort customers based on search term, status filter, and sort order
  const filteredCustomers = customers
    .filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.id.toString().includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.joined);
      const dateB = new Date(b.joined);

      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  //  In a real app, itemsPerPage might be a user setting or come from API response
  const itemsPerPage = 5;


const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

const safeCurrentPage =
  totalPages === 0 ? 1 : Math.min(currentPage, totalPages);

const paginatedCustomers = filteredCustomers.slice(
  (safeCurrentPage - 1) * itemsPerPage,
  safeCurrentPage * itemsPerPage,
);
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white cursor-pointer hover:opacity-80 ${
              darkMode
                ? "bg-gray-700 text-white"
                : "bg-gray-100 text-gray-700 text-black   "
            }`}
          >
            <Download size={16} />
            Export
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#0f766e] text-white hover:opacity-90 cursor-pointer">
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
              darkMode
                ? "bg-gray-700 border border-gray-600"
                : "bg-white text-black border border-gray-200 "
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
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on new search 
              }}
              className="bg-transparent outline-none ml-2 w-full text-sm"
            />
          </div>

          {/* FILTERS */}
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
              className={`px-3 py-2 rounded-lg text-sm border  bg-transparent cursor-pointer ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-700"
              }`}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1); // Reset to first page on sort change
              }}
              className={`px-3 py-2 rounded-lg text-sm border cursor-pointer ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-700"
              }`}
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* TABLE HEADER */}
        {/* TABLE HEADER */}
        <div className="px-4 pt-3">
          <div
            className={`grid grid-cols-[60px_2.2fr_2fr_1.6fr_1fr_1.4fr_1fr] px-4 py-3 text-sm font-semibold rounded-lg ${
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
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-6 text-gray-500 text-sm">
              No customers found
            </div>
          ) : (
            paginatedCustomers.map((customer) => (
              <div
                key={customer.id}
                className={`grid grid-cols-[60px_2.2fr_2fr_1.6fr_1fr_1.4fr_1fr] items-center px-4 py-4 border-b last:border-b-0 ${
                  darkMode ? "border-gray-600" : "border-gray-100"
                }`}
              >
                <span>{customer.id}</span>

                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-gray-300 rounded-full shrink-0"></div>
                  <span className="font-medium truncate">{customer.name}</span>
                </div>

                <span
                  className={`truncate ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {customer.email}
                </span>

                <span className={darkMode ? "text-gray-300" : "text-gray-500"}>
                  {customer.phone}
                </span>

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

                <span className={darkMode ? "text-gray-300" : "text-gray-500"}>
                  {customer.joined}
                </span>

                <div className="flex items-center gap-2 justify-start">
                  <button className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 cursor-pointer">
                    <Pencil size={16} />
                  </button>
                  <button className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer">
                    <Trash2 size={16} />
                  </button>
                  <button className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div
          className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 py-4 border-t ${
            darkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
          <p
            className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}
          >
            Showing{" "}
            <span className="font-medium">
              {filteredCustomers.length === 0
                ? 0
                : (currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredCustomers.length)}
            </span>{" "}
            of <span className="font-medium">{filteredCustomers.length}</span>{" "}
            customers
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-lg text-sm border transition ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:bg-gray-50"
              } ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white hover:bg-gray-500"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-[#0f766e] text-white"
                      : darkMode
                        ? "bg-gray-600 text-white hover:bg-gray-500"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-2 rounded-lg text-sm border transition ${
                currentPage === totalPages || totalPages === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:bg-gray-50"
              } ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white hover:bg-gray-500"
                  : "bg-white border-gray-200 text-gray-700"
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
