import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Search,
  Plus,
  Download,
  Eye,
  Pencil,
  Trash2,
  Users as UsersIcon,
  Shield,
  Briefcase,
  UserCheck,
  UserRound,
} from "lucide-react";
import AddUser from "./AddUser";
import ViewUser from "./ViewUser";
import EditUser from "./EditUser";
import ConfirmationModal from "../../components/layout/ConfirmationModal";
import {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../../services/userService";

export default function UsersPage() {
  const context = useOutletContext() || {};
  const darkMode = context.darkMode ?? false;

  // const [users, setUsers] = useState([
  //   {
  //     id: 1,
  //     name: "Rahul Sharma",
  //     email: "rahul@gmail.com",
  //     phone: "+91 9876543210",
  //     role: "Admin",
  //     status: "Active",
  //     joinedDate: "2026-01-12",
  //     image: "../assets/Profile.jpg",
  //   },
  //   {
  //     id: 2,
  //     name: "Priya Singh",
  //     email: "priya@gmail.com",
  //     phone: "+91 9123456780",
  //     role: "Manager",
  //     status: "Active",
  //     joinedDate: "2026-02-04",
  //     image: "../assets/Profile2.jpg",
  //   },
  //   {
  //     id: 3,
  //     name: "Amit Patil",
  //     email: "amit@gmail.com",
  //     phone: "+91 9988776655",
  //     role: "Employee",
  //     status: "Active",
  //     joinedDate: "2026-02-20",
  //     image: "../assets/Profile3.jpg",
  //   },
  //   {
  //     id: 4,
  //     name: "Neha Verma",
  //     email: "neha@gmail.com",
  //     phone: "+91 9090909090",
  //     role: "Customer",
  //     status: "Inactive",
  //     joinedDate: "2026-03-01",
  //     image: "../assets/Profile4.jpg",
  //   },
  //   {
  //     id: 5,
  //     name: "John Doe",
  //     email: "john@gmail.com",
  //     phone: "+91 9876501234",
  //     role: "Employee",
  //     status: "Active",
  //     joinedDate: "2026-03-12",
  //     image: "../assets/Profile5.jpg",
  //   },
  //   {
  //     id: 6,
  //     name: "Sneha Kulkarni",
  //     email: "sneha@gmail.com",
  //     phone: "+91 9012345678",
  //     role: "Manager",
  //     status: "Pending",
  //     joinedDate: "2026-03-18",
  //     image: "../assets/Profile6.jpg",
  //   },
  // ]);
const [users, setUsers] = useState(getAllUsers());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [deleteTitle, setDeleteTitle] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [showAddConfirmModal, setShowAddConfirmModal] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);

  const [showViewConfirm, setShowViewConfirm] = useState(false);
  const [pendingViewUser, setPendingViewUser] = useState(null);

  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [pendingEditUser, setPendingEditUser] = useState(null);
  

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (roleFilter !== "All Roles") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (statusFilter !== "All Status") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    filtered.sort((a, b) => {
      if (sortOrder === "Newest") {
        return new Date(b.joinedDate) - new Date(a.joinedDate);
      }
      return new Date(a.joinedDate) - new Date(b.joinedDate);
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
  const totalAdmins = users.filter((user) => user.role === "Admin").length;
  const totalManagers = users.filter((user) => user.role === "Manager").length;
  const totalEmployees = users.filter(
    (user) => user.role === "Employee",
  ).length;
  const totalCustomers = users.filter(
    (user) => user.role === "Customer",
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
      bg: darkMode ? "bg-blue-900/20" : "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Admins",
      value: totalAdmins,
      icon: Shield,
      bg: darkMode ? "bg-purple-900/20" : "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Managers",
      value: totalManagers,
      icon: Briefcase,
      bg: darkMode ? "bg-orange-900/20" : "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Employees",
      value: totalEmployees,
      icon: UserCheck,
      bg: darkMode ? "bg-green-900/20" : "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Customers",
      value: totalCustomers,
      icon: UserRound,
      bg: darkMode ? "bg-pink-900/20" : "bg-pink-50",
      iconColor: "text-pink-600",
    },
  ];


  const handleAddUser = (newUser) => {
   setPendingUser({
     ...newUser,
     id: users.length ? Math.max(...users.map((user) => user.id)) + 1 : 1,
   });
    setShowAddConfirmModal(true);
  };

  const confirmAddUser = () => {
    if (!pendingUser) return;

addUser(pendingUser);
setUsers(getAllUsers());    setCurrentPage(1);
    setShowAddConfirmModal(false);
    setShowAddModal(false);
    setPendingUser(null);
  };

  const cancelAddUser = () => {
    setShowAddConfirmModal(false);
    setPendingUser(null);
  };

  const handleViewClick = (user) => {
    setPendingViewUser(user);
    setShowViewConfirm(true);
  };

  const confirmViewUser = () => {
    if (!pendingViewUser) return;

    setSelectedUser(pendingViewUser);
    setShowViewModal(true);
    setShowViewConfirm(false);
    setPendingViewUser(null);
  };

  const cancelViewUser = () => {
    setShowViewConfirm(false);
    setPendingViewUser(null);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleUpdateUser = (updatedUser) => {
    setPendingEditUser(updatedUser);
    setShowEditConfirm(true);
  };

  const confirmUpdateUser = () => {
    if (!pendingEditUser) return;

updateUser(pendingEditUser);
setUsers(getAllUsers());

    setShowEditConfirm(false);
    setShowEditModal(false);
    setSelectedUser(null);
    setPendingEditUser(null);
  };

  const cancelUpdateUser = () => {
    setShowEditConfirm(false);
    setPendingEditUser(null);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteTitle("Delete User");
    setDeleteMessage(
      `Are you sure you want to delete ${user.name || "this user"}?`,
    );
    setShowDeleteConfirm(true);
  };

const handleDeleteUser = (userId) => {
  deleteUser(userId);
  setUsers(getAllUsers());
  setCurrentPage(1);
  setShowDeleteConfirm(false);
  setSelectedUser(null);
};

  return (
    <div className="space-y-6">
      {showAddModal && (
        <AddUser
          darkMode={darkMode}
          setShowAddModal={setShowAddModal}
          onAddUser={handleAddUser}
        />
      )}

      {showEditModal && selectedUser && (
        <EditUser
          darkMode={darkMode}
          user={selectedUser}
          setShowEditModal={setShowEditModal}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {showViewModal && selectedUser && (
        <ViewUser
          darkMode={darkMode}
          user={selectedUser}
          setShowViewModal={setShowViewModal}
        />
      )}
      <ConfirmationModal
        darkMode={darkMode}
        isOpen={showAddConfirmModal}
        type="success"
        title="Add User"
        message={`Are you sure you want to add ${pendingUser?.name || "this user"}?`}
        confirmText="Add"
        cancelText="Cancel"
        onConfirm={confirmAddUser}
        onCancel={cancelAddUser}
      />

      <ConfirmationModal
        darkMode={darkMode}
        isOpen={showViewConfirm}
        type="success"
        title="Open User"
        message={`Do you want to view ${pendingViewUser?.name || "this user"}?`}
        confirmText="Yes, Open"
        cancelText="Cancel"
        onConfirm={confirmViewUser}
        onCancel={cancelViewUser}
      />

      <ConfirmationModal
        darkMode={darkMode}
        isOpen={showEditConfirm}
        type="success"
        title="Update User"
        message={`Are you sure you want to update ${pendingEditUser?.name || "this user"}?`}
        confirmText="Update"
        cancelText="Cancel"
        onConfirm={confirmUpdateUser}
        onCancel={cancelUpdateUser}
      />

      <ConfirmationModal
        darkMode={darkMode}
        isOpen={showDeleteConfirm}
        type="error"
        title={deleteTitle}
        message={deleteMessage}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => selectedUser && handleDeleteUser(selectedUser.id)}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setSelectedUser(null);
        }}
      />
      <div>
        <h1
          className={`text-2xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Users Management
        </h1>
        <p
          className={`text-sm mt-1 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Manage admins, managers, employees, and customers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`rounded-2xl p-4 shadow-sm border ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {card.title}
                  </p>
                  <h2
                    className={`text-2xl font-bold mt-2 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {card.value}
                  </h2>
                </div>
                <div className={`p-3 rounded-xl ${card.bg}`}>
                  <Icon className={card.iconColor} size={22} />
                </div>
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
          <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
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
              <option>All Roles</option>
              <option>Admin</option>
              <option>Manager</option>
              <option>Employee</option>
              <option>Customer</option>
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

          <div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white bg-[#0f766e] hover:opacity-90 cursor-pointer"
            >
              <Plus size={16} />
              Add User
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[1100px]">
            <div
              className={`grid grid-cols-12 px-6 py-4 text-sm font-semibold border-y ${
                darkMode
                  ? "bg-gray-900/40 border-gray-700 text-gray-300"
                  : "bg-gray-50 border-gray-200 text-gray-600"
              }`}
            >
              <div className="col-span-3">User</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2">Phone</div>
              <div className="col-span-2">Joined Date</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2 text-center">Actions</div>
            </div>

            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <div
                  key={user.id}
                  className={`grid grid-cols-12 items-center px-6 py-4 text-sm border-b ${
                    darkMode
                      ? "border-gray-700 text-gray-200"
                      : "border-gray-100 text-gray-700"
                  }`}
                >
                  <div className="col-span-3 flex items-center gap-3">
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                    <div>
                      <h3
                        className={`font-semibold ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {user.name}
                      </h3>
                      <p
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-2">{user.role}</div>
                  <div className="col-span-2">{user.phone}</div>
                  <div className="col-span-2">
                    {new Date(user.joinedDate).toLocaleDateString()}
                  </div>

                  <div className="col-span-1">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses(
                        user.status,
                      )}`}
                    >
                      {user.status}
                    </span>
                  </div>

                  <div className="col-span-2 flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        handleViewClick(user);
                      }}
                      className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 cursor-pointer"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => {
                        handleEditClick(user);
                      }}
                      className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 cursor-pointer"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user)}
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
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
