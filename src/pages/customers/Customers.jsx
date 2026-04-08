import { useState } from "react";
import { Search, Plus, Download, Eye, Pencil, Trash2 } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";
import DeleteCustomer from "./DeleteCustomer";
import ViewCustomer from "./ViewCustomer";

export default function Customers() {
  // Get dark mode from layout
  const { darkMode } = useOutletContext();

  // Store customer list
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone: "+91 9876543210",
      status: "Active",
      joinedDate: "2024-01-12",
      image: "../assets/Profile.jpg",
    },
    {
      id: 2,
      name: "Amit Patil",
      email: "amit@gmail.com",
      phone: "+91 9123456789",
      status: "Active",
      joinedDate: "2024-02-03",
      image: "../assets/Profile2.jpg",
    },
    {
      id: 3,
      name: "Priya Singh",
      email: "priya@gmail.com",
      phone: "+91 9988776655",
      status: "Pending",
      joinedDate: "2024-03-18",
      image: "../assets/Profile3.jpg",
    },
    {
      id: 4,
      name: "John Doe",
      email: "john@gmail.com",
      phone: "+91 8877655443",
      status: "Inactive",
      joinedDate: "2024-04-02",
      image: "../assets/Profile4.jpg",
    },
    {
      id: 5,
      name: "Neha Verma",
      email: "neha@gmail.com",
      phone: "+91 9284711223",
      status: "Active",
      joinedDate: "2024-04-10",
      image: "../assets/Profile5.jpg",
    },
    {
      id: 6,
      name: "Suresh Reddy",
      email: "suresh@gmail.com",
      phone: "+91 9032144556",
      status: "Active",
      joinedDate: "2024-05-22",
      image: "../assets/Profile6.jpg",
    },
  ]);

  // Control modal visibility
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Control table filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Set items per page
  const itemsPerPage = 5;

  // Add a new customer
  const handleAddCustomer = (newCustomer) => {
    setCustomers((prev) => [
      {
        id: prev.length + 1,
        ...newCustomer,
      },
      ...prev,
    ]);
    setCurrentPage(1);
    setShowAddModal(false);
  };

  // Open edit modal
  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };

  // Open delete modal
  const handleDeleteClick = (customer) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  };

  // Open view modal
  const handleViewClick = (customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };

  // Update selected customer
  const handleUpdateCustomer = (updatedCustomer) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer,
      ),
    );
    setShowEditModal(false);
    setSelectedCustomer(null);
  };

  // Delete selected customer
  const handleDeleteCustomer = (customerId) => {
    setCustomers((prev) =>
      prev.filter((customer) => customer.id !== customerId),
    );
    setShowDeleteModal(false);
    setSelectedCustomer(null);
  };

  // Filter and sort customers
  const filteredCustomers = customers
    .filter((customer) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        customer.id.toString().includes(searchTerm) ||
        customer.name.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search) ||
        customer.phone.includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.joinedDate);
      const dateB = new Date(b.joinedDate);

      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

  // Calculate pagination values
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const safeCurrentPage =
    totalPages === 0 ? 1 : Math.min(currentPage, totalPages);

  // Get current page customers
  const paginatedCustomers = filteredCustomers.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage,
  );

  // Return badge style based on status
  const getStatusClasses = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-600";
      case "Pending":
        return "bg-orange-100 text-orange-600";
      case "Inactive":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Add customer modal */}
      {showAddModal && (
        <AddCustomer
          darkMode={darkMode}
          setShowAddModal={setShowAddModal}
          onAddCustomer={handleAddCustomer}
        />
      )}

      {/* Edit customer modal */}
      {showEditModal && selectedCustomer && (
        <EditCustomer
          darkMode={darkMode}
          customer={selectedCustomer}
          setShowEditModal={setShowEditModal}
          onUpdateCustomer={handleUpdateCustomer}
        />
      )}

      {/* Delete customer modal */}
      {showDeleteModal && selectedCustomer && (
        <DeleteCustomer
          darkMode={darkMode}
          customer={selectedCustomer}
          setShowDeleteModal={setShowDeleteModal}
          onDeleteCustomer={handleDeleteCustomer}
        />
      )}

      {/* View customer modal */}
      {showViewModal && selectedCustomer && (
        <ViewCustomer
          darkMode={darkMode}
          customer={selectedCustomer}
          setShowViewModal={setShowViewModal}
        />
      )}

      {/* Page header */}
      <div className="flex items-center justify-between">
        {/* Title section */}
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            Manage your customers and their information
          </p>
        </div>

        {/* Header buttons */}
        <div className="flex gap-3">
          {/* Export button */}
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium shadow-sm border cursor-pointer transition ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Download size={16} />
            Export
          </button>

          {/* Add customer button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#0f766e] text-white hover:opacity-90 cursor-pointer"
          >
            <Plus size={16} />
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Customers", value: "256" },
          { title: "Active Customers", value: "231" },
          { title: "New This Month", value: "12" },
          { title: "Inactive", value: "25" },
        ].map((item) => (
          <div
            key={item.title}
            className={`p-5 rounded-xl shadow-sm ${
              darkMode
                ? "bg-gray-700 border border-gray-600"
                : "bg-white border border-gray-200 text-black"
            }`}
          >
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
        ))}
      </div>

      {/* Main table card */}
      <div
        className={`rounded-xl shadow-sm overflow-hidden ${
          darkMode
            ? "bg-gray-700 border border-gray-600 text-white"
            : "bg-white border border-gray-200 text-black"
        }`}
      >
        {/* Search and filters */}
        <div
          className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border-b ${
            darkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
          {/* Search input */}
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
                setCurrentPage(1);
              }}
              className={`bg-transparent outline-none ml-2 w-full text-sm ${
                darkMode
                  ? "text-white placeholder:text-gray-300"
                  : "text-gray-700 placeholder:text-gray-400"
              }`}
            />
          </div>

          {/* Filter dropdowns */}
          <div className="flex gap-3">
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className={`px-3 py-2 rounded-lg text-sm bg-transparent border cursor-pointer ${
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

            {/* Sort order */}
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
              className={`px-3 py-2 rounded-lg text-sm border cursor-pointer ${
                darkMode
                  ? "bg-gray-700 border-gray-500 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-700"
              }`}
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* Table header */}
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

        {/* Table body */}
        <div className="px-4 pb-4">
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-6 text-gray-500 text-sm">
              No customers found
            </div>
          ) : (
            paginatedCustomers.map((customer) => (
              <div
                key={customer.id}
                className={`grid grid-cols-[60px_2.2fr_2fr_1.6fr_1fr_1.4fr_1fr] items-center px-3 py-2 border-b last:border-b-0 hover:bg-gray-100 rounded-xl transition cursor-pointer ${
                  darkMode
                    ? "border-gray-600 hover:bg-gray-500"
                    : "border-gray-100"
                }`}
              >
                {/* Customer ID */}
                <span className={darkMode ? "text-white" : "text-black"}>
                  {customer.id}
                </span>

                {/* Customer name and image */}
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

                {/* Customer email */}
                <span
                  className={`truncate ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {customer.email}
                </span>

                {/* Customer phone */}
                <span className={darkMode ? "text-gray-300" : "text-gray-500"}>
                  {customer.phone}
                </span>

                {/* Customer status */}
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full w-fit ${getStatusClasses(
                    customer.status,
                  )}`}
                >
                  {customer.status}
                </span>

                {/* Customer joined date */}
                <span className={darkMode ? "text-gray-300" : "text-gray-500"}>
                  {new Date(customer.joinedDate).toLocaleDateString()}
                </span>

                {/* Action buttons */}
                <div className="flex items-center gap-2 justify-start">
                  {/* Edit button */}
                  <button
                    onClick={() => handleEditClick(customer)}
                    className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 cursor-pointer"
                  >
                    <Pencil size={16} />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDeleteClick(customer)}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>

                  {/* View button */}
                  <button
                    onClick={() => handleViewClick(customer)}
                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination section */}
        <div
          className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 py-4 border-t ${
            darkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
          {/* Pagination info */}
          <p
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            Showing{" "}
            <span className="font-medium">
              {filteredCustomers.length === 0
                ? 0
                : (safeCurrentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(
                safeCurrentPage * itemsPerPage,
                filteredCustomers.length,
              )}
            </span>{" "}
            of <span className="font-medium">{filteredCustomers.length}</span>{" "}
            customers
          </p>

          {/* Pagination buttons */}
          <div className="flex items-center gap-2">
            {/* Previous button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={safeCurrentPage === 1}
              className={`px-3 py-2 rounded-lg text-sm border transition ${
                safeCurrentPage === 1
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

            {/* Page number buttons */}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition cursor-pointer ${
                    safeCurrentPage === page
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

            {/* Next button */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))
              }
              disabled={safeCurrentPage === totalPages || totalPages === 0}
              className={`px-3 py-2 rounded-lg text-sm border transition ${
                safeCurrentPage === totalPages || totalPages === 0
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
