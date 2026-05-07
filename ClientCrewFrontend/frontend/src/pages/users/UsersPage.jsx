import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

import {
  Plus,
  Edit,
  Search,
  Eye,
  Trash2,
  Users as UsersIcon,
  Shield,
  Briefcase,
  UserCheck,
  UserRound,
} from "lucide-react";

import AddUser from "./AddUser";
import EditUser from "./EditUser";
import ViewUser from "./ViewUser";

import {
  getAllUsers,
  deleteUser,
  addUser,
  updateUser,
} from "../../services/userService";
import ConfirmationModal from "../../components/layout/ConfirmationModal";

export default function UsersPage() {
  const context = useOutletContext() || {};
  const darkMode = context.darkMode ?? false;

  const [users, setUsers] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const itemsPerPage = 5;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [deleteUserName, setDeleteUserName] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const canAddUsers = true;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users. Please check backend or admin token.");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    if (searchTerm.trim()) {
      filtered = filtered.filter((user) =>
        `${user.userFullName || ""} ${user.userEmail || ""} ${
          user.userPhone || ""
        }`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      );
    }

    if (roleFilter !== "All Roles") {
      filtered = filtered.filter((user) => user.userRole === roleFilter);
    }

    if (statusFilter !== "All Status") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.joinedDate || 0);
      const dateB = new Date(b.joinedDate || 0);

      return sortOrder === "Newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [users, searchTerm, roleFilter, statusFilter, sortOrder]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);

  const paginatedUsers = filteredUsers.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage,
  );

  const totalUsers = users.length;

  const totalAdmins = users.filter((user) => user.userRole === "ADMIN").length;

  const totalManagers = users.filter(
    (user) => user.userRole === "MANAGER",
  ).length;

  const totalEmployees = users.filter(
    (user) => user.userRole === "EMPLOYEE",
  ).length;

  const totalCustomers = users.filter(
    (user) => user.userRole === "CUSTOMER",
  ).length;
  const getStatusClasses = (status) => {
    switch (status) {
      case "Active":
        return darkMode
          ? "bg-green-900/30 text-green-400"
          : "bg-green-100 text-green-700";
      case "Inactive":
        return darkMode
          ? "bg-red-900/30 text-red-400"
          : "bg-red-100 text-red-700";
      case "Pending":
        return darkMode
          ? "bg-yellow-900/30 text-yellow-400"
          : "bg-yellow-100 text-yellow-700";
      default:
        return darkMode
          ? "bg-gray-700 text-gray-300"
          : "bg-gray-100 text-gray-700";
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: UsersIcon,
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Admins",
      value: totalAdmins,
      icon: Shield,
      bg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Managers",
      value: totalManagers,
      icon: Briefcase,
      bg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Employees",
      value: totalEmployees,
      icon: UserCheck,
      bg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Customers",
      value: totalCustomers,
      icon: UserRound,
      bg: "bg-pink-100",
      iconColor: "text-pink-600",
    },
  ];

  const handleViewClick = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };
  const handleDeleteClick = (user) => {
    if (user.userRole === "ADMIN" || user.userRole === "Admin") return;

    setDeleteUserId(user.userId);
    setDeleteUserName(user.userFullName);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = async () => {
    try {
      await deleteUser(deleteUserId);
      setUsers((prev) => prev.filter((user) => user.userId !== deleteUserId));
      setShowDeleteConfirm(false);
      setDeleteUserId(null);
      setDeleteUserName("");
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="space-y-6">
      {showAddModal && (
        <AddUser
          darkMode={darkMode}
          setShowAddModal={setShowAddModal}
          onAddUser={async (newUser) => {
            const savedUser = await addUser(newUser);
            setUsers((prev) => [savedUser, ...prev]);
            setShowAddModal(false);
            setCurrentPage(1);
          }}
        />
      )}
      {showViewModal && selectedUser && (
        <ViewUser
          darkMode={darkMode}
          user={selectedUser}
          setShowViewModal={setShowViewModal}
        />
      )}

      {showEditModal && selectedUser && (
        <EditUser
          darkMode={darkMode}
          user={selectedUser}
          setShowEditModal={setShowEditModal}
          onUpdateUser={async (updatedUser) => {
            const savedUser = await updateUser(updatedUser.userId, updatedUser);

            setUsers((prev) =>
              prev.map((user) =>
                user.userId === savedUser.userId ? savedUser : user,
              ),
            );

            setShowEditModal(false);
          }}
        />
      )}
      <ConfirmationModal
        darkMode={darkMode}
        isOpen={showDeleteConfirm}
        type="error"
        title="Delete User"
        message={`Are you sure you want to delete ${deleteUserName}?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteUser}
        onCancel={() => setShowDeleteConfirm(false)}
      />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Users
          </h1>
          <p
            className={`text-sm mt-1 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            View all admins, managers, employees, and customers.
          </p>
        </div>

        {canAddUsers && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#0f766e] text-white hover:opacity-90 cursor-pointer"
          >
            <Plus size={18} />
            Add User
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
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
                  {card.title}
                </p>

                <h2
                  className={`text-2xl font-bold mt-2 ${
                    darkMode ? "text-white" : "text-black"
                  }`}
                >
                  {card.value}
                </h2>
              </div>

              <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl ${card.bg}`}
              >
                <Icon size={22} className={card.iconColor} />
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={`rounded-2xl shadow-sm border overflow-hidden ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="p-4 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div className="flex flex-col md:flex-row flex-wrap gap-3 w-full">
            <div
              className={`flex items-center px-3 py-2 rounded-xl border w-full md:w-72 ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className={`ml-2 w-full bg-transparent outline-none text-sm ${
                  darkMode ? "text-white placeholder-gray-400" : "text-gray-800"
                }`}
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl border text-sm outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-800"
              }`}
            >
              <option value="All Roles">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="CUSTOMER">Customer</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl border text-sm outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-800"
              }`}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Pending</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl border text-sm outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-200 text-gray-800"
              }`}
            >
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="px-6 py-10 text-center text-sm text-gray-500">
            Loading users...
          </div>
        )}

        {error && !loading && (
          <div className="px-6 py-10 text-center text-sm text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <div className="min-w-[950px] lg:min-w-0">
              <div
                className={`grid grid-cols-[2.2fr_1.2fr_1.3fr_1.4fr_1fr_1fr] px-6 py-4 text-sm font-semibold border-y ${
                  darkMode
                    ? "bg-gray-900/40 border-gray-700 text-gray-300"
                    : "bg-gray-50 border-gray-200 text-gray-600"
                }`}
              >
                <div>User</div>
                <div>Role</div>
                <div>Phone</div>
                <div>Joined Date</div>
                <div>Status</div>
                <div className="text-center">Actions</div>
              </div>

              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <div
                    key={user.userId}
                    className={`grid grid-cols-[2.2fr_1.2fr_1.3fr_1.4fr_1fr_1fr] items-center px-6 py-4 text-sm border-b ${
                      darkMode
                        ? "border-gray-700 text-gray-200"
                        : "border-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={user.userImage || "/default-user.png"}
                        alt={user.userFullName}
                        className="w-11 h-11 rounded-full object-cover"
                      />

                      <div>
                        <h3
                          className={`font-semibold truncate ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {user.userFullName}
                        </h3>

                        <p
                          className={`text-xs truncate ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {user.userEmail}
                        </p>
                      </div>
                    </div>

                    <div>{user.userRole}</div>
                    <div>{user.userPhone || "-"}</div>
                    <div>
                      {user.joinedDate
                        ? new Date(user.joinedDate).toLocaleDateString()
                        : "-"}
                    </div>

                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses(
                          user.status,
                        )}`}
                      >
                        {user.status || "Active"}
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      {/* View */}
                      <button
                        onClick={() => handleViewClick(user)}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Edit */}
                      {user.userRole !== "ADMIN" &&
                        user.userRole !== "Admin" && (
                          <button
                            onClick={() => handleEditClick(user)}
                            className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 cursor-pointer"
                          >
                            <Edit size={16} />
                          </button>
                        )}

                      {/* Delete */}
                      {user.userRole !== "ADMIN" && (
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className={`px-6 py-12 text-center text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No users found.
                </div>
              )}
            </div>
          </div>
        )}

        <div
          className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          <p className="text-sm">
            Showing{" "}
            <span className="font-semibold">
              {filteredUsers.length === 0
                ? 0
                : (safeCurrentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold">
              {Math.min(safeCurrentPage * itemsPerPage, filteredUsers.length)}
            </span>{" "}
            of <span className="font-semibold">{filteredUsers.length}</span>{" "}
            users
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={safeCurrentPage === 1}
              className={`px-4 py-2 rounded-lg text-sm border ${
                safeCurrentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              } ${
                darkMode
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-200 bg-white text-gray-700"
              }`}
            >
              Previous
            </button>

            <span className="text-sm font-medium">
              Page {safeCurrentPage} of {totalPages || 1}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))
              }
              disabled={safeCurrentPage === totalPages || totalPages === 0}
              className={`px-4 py-2 rounded-lg text-sm border ${
                safeCurrentPage === totalPages || totalPages === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              } ${
                darkMode
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-200 bg-white text-gray-700"
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
