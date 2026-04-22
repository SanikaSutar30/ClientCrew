import { useState } from "react";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { useOutletContext } from "react-router-dom";

import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";
import ViewCustomer from "./ViewCustomer";

import { ConfirmationModal } from "../../components/layout";

import {
  getAllCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../services/customerService";

export default function Customers() {
  const { darkMode, userRole } = useOutletContext();

  const canManageCustomers = ["Admin", "Manager"].includes(userRole);
  const canViewCustomers = ["Admin", "Manager", "Employee"].includes(userRole);

  // Temporary logged-in employee id for frontend role testing
  const loggedInEmployeeId = "emp1";

  const [customers, setCustomers] = useState(getAllCustomers());

  // Temporary project data for role-based filtering
  const projects = [
    {
      id: "p1",
      projectName: "CRM Dashboard",
      customerId: 1,
      assignedEmployees: ["emp1", "emp2"],
    },
    {
      id: "p2",
      projectName: "Billing System",
      customerId: 3,
      assignedEmployees: ["emp1"],
    },
    {
      id: "p3",
      projectName: "Mobile App",
      customerId: 5,
      assignedEmployees: ["emp1", "emp3"],
    },
    {
      id: "p4",
      projectName: "Support Portal",
      customerId: 2,
      assignedEmployees: ["emp2"],
    },
    {
      id: "p5",
      projectName: "HR Management",
      customerId: 4,
      assignedEmployees: ["emp3"],
    },
  ];

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [showAddConfirmModal, setShowAddConfirmModal] = useState(false);
  const [pendingCustomer, setPendingCustomer] = useState(null);

  const [showViewConfirm, setShowViewConfirm] = useState(false);
  const [pendingViewCustomer, setPendingViewCustomer] = useState(null);

  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [pendingEditCustomer, setPendingEditCustomer] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const handleAddCustomer = (newCustomer) => {
    if (!canManageCustomers) return;

    setPendingCustomer({
      id: Math.max(...customers.map((c) => c.id), 0) + 1,
      ...newCustomer,
    });
    setShowAddConfirmModal(true);
  };

  const confirmAddCustomer = () => {
    if (!pendingCustomer || !canManageCustomers) return;

    addCustomer(pendingCustomer);
    setCustomers(getAllCustomers());
    setCurrentPage(1);
    setShowAddConfirmModal(false);
    setShowAddModal(false);
    setPendingCustomer(null);
  };

  const cancelAddCustomer = () => {
    setShowAddConfirmModal(false);
    setPendingCustomer(null);
  };

  const handleEditClick = (customer) => {
    if (!canManageCustomers) return;
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };

  const handleDeleteClick = (customer) => {
    if (!canManageCustomers) return;

    setSelectedCustomer(customer);
    setDeleteTitle("Delete Customer");
    setDeleteMessage(
      `Are you sure you want to delete ${customer.name || "this customer"}?`,
    );
    setShowDeleteConfirm(true);
  };

  const handleViewClick = (customer) => {
    if (!canViewCustomers) return;

    setPendingViewCustomer(customer);
    setShowViewConfirm(true);
  };

  const confirmViewCustomer = () => {
    if (!pendingViewCustomer || !canViewCustomers) return;

    setSelectedCustomer(pendingViewCustomer);
    setShowViewModal(true);
    setShowViewConfirm(false);
    setPendingViewCustomer(null);
  };

  const cancelViewCustomer = () => {
    setShowViewConfirm(false);
    setPendingViewCustomer(null);
  };

  const handleUpdateCustomer = (updatedCustomer) => {
    if (!canManageCustomers) return;

    setPendingEditCustomer(updatedCustomer);
    setShowEditConfirm(true);
  };

  const confirmUpdateCustomer = () => {
    if (!pendingEditCustomer || !canManageCustomers) return;

    updateCustomer(pendingEditCustomer);
    setCustomers(getAllCustomers());

    setShowEditConfirm(false);
    setShowEditModal(false);
    setSelectedCustomer(null);
    setPendingEditCustomer(null);
  };

  const cancelUpdateCustomer = () => {
    setShowEditConfirm(false);
    setPendingEditCustomer(null);
  };

  const handleDeleteCustomer = (customerId) => {
    if (!canManageCustomers) return;

    deleteCustomer(customerId);
    setCustomers(getAllCustomers());
    setShowDeleteConfirm(false);
    setSelectedCustomer(null);
  };

  // Employee should only see customers related to assigned projects
  const employeeProjects =
    userRole === "Employee"
      ? projects.filter((project) =>
          project.assignedEmployees.includes(loggedInEmployeeId),
        )
      : projects;

  const employeeCustomerIds = employeeProjects.map(
    (project) => project.customerId,
  );

  const visibleCustomers =
    userRole === "Employee"
      ? customers.filter((customer) =>
          employeeCustomerIds.includes(customer.id),
        )
      : customers;

  const filteredCustomers = visibleCustomers
    .filter((customer) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        customer.id.toString().includes(searchTerm) ||
        customer.name?.toLowerCase().includes(search) ||
        customer.email?.toLowerCase().includes(search) ||
        customer.phone?.includes(searchTerm);

      const matchesStatus =
        statusFilter === "All" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.joinedDate);
      const dateB = new Date(b.joinedDate);

      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const safeCurrentPage =
    totalPages === 0 ? 1 : Math.min(currentPage, totalPages);

  const paginatedCustomers = filteredCustomers.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage,
  );

  const totalCustomersCount = visibleCustomers.length;
  const activeCustomersCount = visibleCustomers.filter(
    (customer) => customer.status === "Active",
  ).length;
  const pendingCustomersCount = visibleCustomers.filter(
    (customer) => customer.status === "Pending",
  ).length;
  const inactiveCustomersCount = visibleCustomers.filter(
    (customer) => customer.status === "Inactive",
  ).length;

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

  if (!canViewCustomers) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            You do not have access to view customers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showAddModal && canManageCustomers && (
        <AddCustomer
          darkMode={darkMode}
          setShowAddModal={setShowAddModal}
          onAddCustomer={handleAddCustomer}
          userRole={userRole}
        />
      )}

      {showEditModal && selectedCustomer && canManageCustomers && (
        <EditCustomer
          darkMode={darkMode}
          customer={selectedCustomer}
          setShowEditModal={setShowEditModal}
          onUpdateCustomer={handleUpdateCustomer}
        />
      )}

      {showViewModal && selectedCustomer && canViewCustomers && (
        <ViewCustomer
          darkMode={darkMode}
          customer={selectedCustomer}
          setShowViewModal={setShowViewModal}
        />
      )}
      <ConfirmationModal
        darkMode={darkMode}
        isOpen={showAddConfirmModal}
        type="success"
        title="Add Customer"
        message={`Are you sure you want to add ${pendingCustomer?.name || "this customer"}?`}
        confirmText="Add"
        cancelText="Cancel"
        onConfirm={confirmAddCustomer}
        onCancel={cancelAddCustomer}
      />

      <ConfirmationModal
        darkMode={darkMode}
        isOpen={showViewConfirm}
        type="success"
        title="Open Customer"
        message={`Do you want to view ${pendingViewCustomer?.name || "this customer"}?`}
        confirmText="Yes, Open"
        cancelText="Cancel"
        onConfirm={confirmViewCustomer}
        onCancel={cancelViewCustomer}
      />

      <ConfirmationModal
        darkMode={darkMode}
        isOpen={showEditConfirm}
        type="success"
        title="Update Customer"
        message={`Are you sure you want to update ${pendingEditCustomer?.name || "this customer"}?`}
        confirmText="Update"
        cancelText="Cancel"
        onConfirm={confirmUpdateCustomer}
        onCancel={cancelUpdateCustomer}
      />

      <ConfirmationModal
        darkMode={darkMode}
        isOpen={showDeleteConfirm}
        type="error"
        title={deleteTitle}
        message={deleteMessage}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() =>
          selectedCustomer && handleDeleteCustomer(selectedCustomer.id)
        }
        onCancel={() => {
          setShowDeleteConfirm(false);
          setSelectedCustomer(null);
        }}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            {canManageCustomers
              ? "Manage your customers and their information"
              : "View customers related to your assigned projects"}{" "}
          </p>
        </div>

        <div>
          {canManageCustomers && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#0f766e] text-white hover:opacity-90 cursor-pointer"
            >
              <Plus size={16} />
              Add Customer
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Customers", value: totalCustomersCount },
          { title: "Active Customers", value: activeCustomersCount },
          { title: "Pending Customers", value: pendingCustomersCount },
          { title: "Inactive", value: inactiveCustomersCount },
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

      <div
        className={`rounded-xl shadow-sm overflow-hidden ${
          darkMode
            ? "bg-gray-700 border border-gray-600 text-white"
            : "bg-white border border-gray-200 text-black"
        }`}
      >
        <div
          className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border-b ${
            darkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
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

          <div className="flex gap-3">
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

        <div className="px-4 pt-3">
          <div
            className={`grid grid-cols-[60px_2.2fr_2fr_1.6fr_1fr_1.4fr_1.2fr] px-4 py-3 text-sm font-semibold rounded-lg ${
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
                className={`grid grid-cols-[60px_2.2fr_2fr_1.6fr_1fr_1.4fr_1.2fr] items-center px-3 py-2 border-b last:border-b-0 hover:bg-gray-100 rounded-xl transition ${
                  darkMode
                    ? "border-gray-600 hover:bg-gray-500"
                    : "border-gray-100"
                }`}
              >
                <span className={darkMode ? "text-white" : "text-black"}>
                  {customer.id}
                </span>

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
                  className={`text-xs font-semibold px-3 py-1 rounded-full w-fit ${getStatusClasses(
                    customer.status,
                  )}`}
                >
                  {customer.status}
                </span>

                <span className={darkMode ? "text-gray-300" : "text-gray-500"}>
                  {new Date(customer.joinedDate).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2 justify-start">
                  {canManageCustomers && (
                    <>
                      <button
                        onClick={() => handleEditClick(customer)}
                        className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 cursor-pointer"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(customer)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}

                  {canViewCustomers && (
                    <button
                      onClick={() => handleViewClick(customer)}
                      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer"
                    >
                      <Eye size={16} />
                    </button>
                  )}
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

          <div className="flex items-center gap-2">
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
