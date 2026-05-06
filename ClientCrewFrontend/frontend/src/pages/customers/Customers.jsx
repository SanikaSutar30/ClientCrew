import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Users,
  UserCheck,
  Clock,
  UserX,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";

import AddCustomer from "./AddCustomer";
import EditCustomer from "./EditCustomer";
import ViewCustomer from "./ViewCustomer";
import api from "../../services/api";

import { ConfirmationModal } from "../../components/layout";

import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "../../services/customerService";

export default function Customers() {
  const { darkMode, userRole } = useOutletContext();

  const canAddCustomer = ["Admin", "Manager"].includes(userRole);

  const canEditCustomer = ["Admin", "Manager"].includes(userRole);

  const canDeleteCustomer = userRole === "Admin";
  const canViewCustomers = ["Admin", "Manager", "Employee"].includes(userRole);

  const [customers, setCustomers] = useState([]);

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

  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/api/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    const loadCustomers = async () => {
      await fetchCustomers();
      await fetchProjects();
    };

    loadCustomers();
  }, []);

  const handleAddCustomer = (newCustomer) => {
    if (!canAddCustomer) return;

    setPendingCustomer({
      userFullName: newCustomer.userFullName || newCustomer.name,
      userEmail: newCustomer.userEmail || newCustomer.email,
      userPhone: newCustomer.phone,
      status: newCustomer.status,
      joinedDate: newCustomer.joinedDate,
      userImage: newCustomer.image || "",
    });

    setShowAddConfirmModal(true);
  };

  const confirmAddCustomer = async () => {
    if (!pendingCustomer || !canAddCustomer) return;

    try {
      console.log("Customer payload:", pendingCustomer);

      await addCustomer(pendingCustomer);

      await fetchCustomers();

      setCurrentPage(1);
      setShowAddConfirmModal(false);
      setShowAddModal(false);
      setPendingCustomer(null);
    } catch (error) {
      console.error("Add customer error:", error);
      alert("Customer not added. Please check backend logs.");
    }
  };

  const cancelAddCustomer = () => {
    setShowAddConfirmModal(false);
    setPendingCustomer(null);
  };

  const handleEditClick = (customer) => {
    if (!canEditCustomer) return;
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };

  const handleDeleteClick = (customer) => {
    if (!canDeleteCustomer) return;

    setSelectedCustomer(customer);
    setDeleteTitle("Delete Customer");
    setDeleteMessage(
      `Are you sure you want to delete ${customer.userFullName || "this customer"}?`,
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
    if (!canEditCustomer) return;

    setPendingEditCustomer(updatedCustomer);
    setShowEditConfirm(true);
  };

  const confirmUpdateCustomer = async () => {
    if (!pendingEditCustomer || !canEditCustomer) return;

    await updateCustomer(pendingEditCustomer.userId, pendingEditCustomer);
    await fetchCustomers();

    setShowEditConfirm(false);
    setShowEditModal(false);
    setSelectedCustomer(null);
    setPendingEditCustomer(null);
  };

  const cancelUpdateCustomer = () => {
    setShowEditConfirm(false);
    setPendingEditCustomer(null);
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!canDeleteCustomer) return;

    await deleteCustomer(customerId);
    await fetchCustomers();

    setShowDeleteConfirm(false);
    setSelectedCustomer(null);
  };

  const filteredCustomers = customers
    .filter((customer) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        customer.userId.toString().includes(searchTerm) ||
        customer.userFullName?.toLowerCase().includes(search) ||
        customer.userEmail?.toLowerCase().includes(search) ||
        customer.userPhone?.includes(searchTerm);

      const customerStatus = customer.status || "Active";

      const matchesStatus =
        statusFilter === "All" || customerStatus === statusFilter;

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

  const totalCustomersCount = customers.length;

  const activeCustomersCount = customers.length;

  const pendingCustomersCount = 0;
  const inactiveCustomersCount = 0;

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
      {showAddModal && canAddCustomer && (
        <AddCustomer
          darkMode={darkMode}
          setShowAddModal={setShowAddModal}
          onAddCustomer={handleAddCustomer}
          projects={projects}
        />
      )}

      {showEditModal && selectedCustomer && canEditCustomer && (
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
        message={`Are you sure you want to add ${pendingCustomer?.userFullName || "this customer"}?`}
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
        message={`Do you want to view ${pendingViewCustomer?.userFullName || "this customer"}?`}
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
        message={`Are you sure you want to update ${pendingEditCustomer?.userFullName || "this customer"}?`}
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
          selectedCustomer && handleDeleteCustomer(selectedCustomer.userId)
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
            {canAddCustomer
              ? "Manage your customers and their information"
              : "View customers related to your assigned projects"}{" "}
          </p>
        </div>

        <div>
          {canAddCustomer && (
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

      {/* cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Customers",
            value: totalCustomersCount,
            icon: Users,
            bg: "bg-purple-100",
            color: "text-purple-600",
          },
          {
            title: "Active Customers",
            value: activeCustomersCount,
            icon: UserCheck,
            bg: "bg-green-100",
            color: "text-green-600",
          },
          {
            title: "Pending Customers",
            value: pendingCustomersCount,
            icon: Clock,
            bg: "bg-orange-100",
            color: "text-orange-600",
          },
          {
            title: "Inactive",
            value: inactiveCustomersCount,
            icon: UserX,
            bg: "bg-red-100",
            color: "text-red-600",
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

              {/* RIGHT ICON (centered like project cards) */}
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl ${item.bg}`}
              >
                <Icon size={22} className={item.color} />
              </div>
            </div>
          );
        })}
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
                key={customer.userId}
                className={`grid grid-cols-[60px_2.2fr_2fr_1.6fr_1fr_1.4fr_1.2fr] items-center px-3 py-2 border-b last:border-b-0 hover:bg-gray-100 rounded-xl transition ${
                  darkMode
                    ? "border-gray-600 hover:bg-gray-500"
                    : "border-gray-100"
                }`}
              >
                <span className={darkMode ? "text-white" : "text-black"}>
                  {customer.userId}
                </span>

                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 shrink-0 flex items-center justify-center">
                    {customer.userImage ? (
                      <img
                        src={customer.userImage}
                        alt={customer.userFullName}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-gray-700">
                        {customer.userFullName?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span
                    className={`font-medium truncate ${
                      darkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {customer.userFullName}
                  </span>
                </div>

                <span
                  className={`truncate ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {customer.userEmail}
                </span>

                <span className={darkMode ? "text-gray-300" : "text-gray-500"}>
                  {customer.userPhone || "N/A"}
                </span>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full w-fit ${getStatusClasses(
                    customer.status,
                  )}`}
                >
                  {customer.status || "Active"}
                </span>

                <span className={darkMode ? "text-gray-300" : "text-gray-500"}>
                  {customer.joinedDate
                    ? new Date(customer.joinedDate).toLocaleDateString()
                    : "N/A"}
                </span>

                <div className="flex items-center gap-2 justify-start">
                  {canEditCustomer && (
                    <button
                      onClick={() => handleEditClick(customer)}
                      className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 cursor-pointer"
                    >
                      <Pencil size={16} />
                    </button>
                  )}

                  {canDeleteCustomer && (
                    <button
                      onClick={() => handleDeleteClick(customer)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
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
