// This is a React component for managing customers in a frontend application. It includes features such as searching, filtering, sorting, pagination, and adding new customers through a modal form. The component uses state to manage the list of customers and the UI interactions.
// The AddCustomer component is a child component that renders a modal form for adding a new customer. It receives props from the Customers component to control its visibility and to pass the new customer data back up when the form is submitted.
// The Customers component also includes action buttons for exporting customer data and navigating to the add customer form, as well as stats cards that display summary information about the customers. The main table displays the list of customers with options to edit, delete, or view details for each customer.
// The component is styled using Tailwind CSS classes and includes support for dark mode based on the `darkMode` prop.
// Note: The actual data management (e.g., fetching from an API, updating, deleting) is not implemented in this code and would need to be added for a fully functional application.
// The code is structured to allow for easy integration with a backend API in the future, where the customer data would be fetched and manipulated through API calls rather than being stored in local state.
// The component also includes pagination logic to handle large lists of customers, allowing users to navigate through pages of customer data. The search and filter functionality allows users to quickly find specific customers based on their name, email, or status.
// Overall, this component provides a comprehensive UI for managing customers in a frontend application, with a focus on usability and functionality.
// The Customers component is the main component for displaying and managing customers. It includes a header with action buttons, stats cards, a search and filter row, a table of customers, and pagination controls. The AddCustomer component is used as a modal form for adding new customers to the list. The component uses state to manage the list of customers, the search term, filters, sort order, pagination, and the visibility of the add customer modal.
// The component is designed to be responsive and supports dark mode styling based on the `darkMode` prop. The customer data is currently stored in local state for demonstration purposes, but it can be easily integrated with a backend API for real data management. The component includes features such as searching, filtering, sorting, and pagination to enhance the user experience when managing a large list of customers.
import { Search, Plus, Download, Eye, Pencil, Trash2 } from "lucide-react";
// 
import { useState } from "react";
import AddCustomer from "./AddCustomer";


// This component is the main page for managing customers. It includes a header with action buttons, stats cards, a search and filter row, a table of customers, and pagination controls. It also manages the state for the list of customers, search term, filters, sort order, pagination, and the visibility of the add customer modal. The AddCustomer component is used as a modal form for adding new customers to the list.
export default function Customers({ darkMode }) {
  // Sample customer data stored in state. In a real application, this would likely come from an API call.
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone: "+91 9876543210",
      status: "Active",
      joinedDate: "2024-01-12",
    },
    {
      id: 2,
      name: "Amit Patil",
      email: "amit@gmail.com",
      phone: "+91 9123456789",
      status: "Active",
      joinedDate: "2024-02-03",
    },
    {
      id: 3,
      name: "Priya Singh",
      email: "priya@gmail.com",
      phone: "+91 9988776655",
      status: "Pending",
      joinedDate: "2024-03-18",
    },
    {
      id: 4,
      name: "John Doe",
      email: "john@gmail.com",
      phone: "+91 8877655443",
      status: "Inactive",
      joinedDate: "2024-04-02",
    },
    {
      id: 5,
      name: "Neha Verma",
      email: "neha@gmail.com",
      phone: "+91 9284711223",
      status: "Active",
      joinedDate: "2024-04-10",
    },
    {
      id: 6,
      name: "Suresh Reddy",
      email: "suresh@gmail.com",
      phone: "+91 9032144556",
      status: "Active",
      joinedDate: "2024-05-22",
    },
  ]);
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
      const dateA = new Date(a.joinedDate);
      const dateB = new Date(b.joinedDate);

      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });
  
// 
  const handleAddCustomer = (newCustomer) => {
    setCustomers((prev) => [
      {
        id: prev.length + 1, // temporary (backend will handle later)
        ...newCustomer,
      },
      ...prev, // add on top
    ]);
  };
  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  //  In a real app, itemsPerPage might be a user setting or come from API response
  const itemsPerPage = 5;

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Ensure currentPage is within valid range after filtering
  const safeCurrentPage =
    totalPages === 0 ? 1 : Math.min(currentPage, totalPages);

  // Calculate the customers to display on the current page
  const paginatedCustomers = filteredCustomers.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage,
  );

  // State to control visibility of the Add Customer modal
  const [showAddModal, setShowAddModal] = useState(false);
  return (
    <div className="space-y-6">
      {showAddModal && (
        <AddCustomer darkMode={darkMode} setShowAddModal={setShowAddModal}
          onAddCustomer={handleAddCustomer} />
      )}
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

          <button
            // navigate to a customer creation form
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#0f766e] text-white hover:opacity-90 cursor-pointer"
          >
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
                  {/*  */}
                  {new Date(customer.joinedDate).toLocaleDateString()}
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
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition cursor-pointer ${
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
