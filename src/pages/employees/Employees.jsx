import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Search,
  Users,
  UserCheck,
  ShieldCheck,
  Briefcase,
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Plus,
} from "lucide-react";
import AddEmployee from "./AddEmployee";
import ViewEmployee from "./ViewEmployee";
import EditEmployee from "./EditEmployee";
import { ConfirmationModal } from "../../components/layout";
export default function Employees() {
  const { darkMode, userRole } = useOutletContext();

  const savedUser = JSON.parse(localStorage.getItem("user")) || {};

  const currentUserTeamId = savedUser.teamId ?? 101;
  
  const isAdmin = userRole === "Admin";
  const isManager = userRole === "Manager";
  const isEmployee = userRole === "Employee";

  const canViewEmployees = isAdmin || isManager || isEmployee;
  const canAddEmployees = isAdmin || isManager;
  const canEditEmployees = isAdmin || isManager;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddConfirmModal, setShowAddConfirmModal] = useState(false);
  const [pendingEmployee, setPendingEmployee] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [showViewConfirm, setShowViewConfirm] = useState(false);
  const [pendingViewEmployee, setPendingViewEmployee] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [pendingEditEmployee, setPendingEditEmployee] = useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Aarav Patil",
      role: "Admin",
      department: "Management",
      email: "aarav@clientcrew.com",
      phone: "+91 9876543210",
      location: "Nashik",
      status: "Active",
      projects: 8,
      joinedDate: "2024-01-12",
      image: "../assets/Profile.jpg",
      teamId: 100,
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Manager",
      department: "Project Management",
      email: "priya@clientcrew.com",
      phone: "+91 9823456712",
      location: "Pune",
      status: "Active",
      projects: 6,
      joinedDate: "2024-02-08",
      image: "../assets/Profile2.jpg",
      teamId: 101,
    },
    {
      id: 3,
      name: "Rohan Deshmukh",
      role: "Employee",
      department: "Development",
      email: "rohan@clientcrew.com",
      phone: "+91 9988776655",
      location: "Mumbai",
      status: "On Leave",
      projects: 4,
      joinedDate: "2024-03-15",
      image: "../assets/Profile3.jpg",
      teamId: 101,
    },
    {
      id: 4,
      name: "Sneha Kulkarni",
      role: "Employee",
      department: "UI/UX Design",
      email: "sneha@clientcrew.com",
      phone: "+91 9765432189",
      location: "Nashik",
      status: "Active",
      projects: 5,
      joinedDate: "2024-04-22",
      image: "../assets/Profile4.jpg",
      teamId: 101,
    },
    {
      id: 5,
      name: "Aditya Joshi",
      role: "Manager",
      department: "Sales",
      email: "aditya@clientcrew.com",
      phone: "+91 9898989898",
      location: "Aurangabad",
      status: "Inactive",
      projects: 2,
      joinedDate: "2024-05-10",
      image: "../assets/Profile5.jpg",
      teamId: 102,
    },
    {
      id: 6,
      name: "Neha Jadhav",
      role: "Employee",
      department: "Testing",
      email: "neha@clientcrew.com",
      phone: "+91 9012345678",
      location: "Nagpur",
      status: "Active",
      projects: 3,
      joinedDate: "2024-06-05",
      image: "../assets/Profile6.jpg",
      teamId: 102,
    },
  ]);

  const canEditEmployee = (employee) => {
    if (userRole === "Admin") {
      return employee.role !== "Admin";
    }

    if (userRole === "Manager") {
      return employee.role === "Employee";
    }

    return false;
  };

  const canDeleteEmployee = (employee) => {
    if (userRole === "Admin") {
      return employee.role !== "Admin";
    }

    if (userRole === "Manager") {
      return employee.role === "Employee";
    }

    return false;
  };

  const handleAddEmployee = (newEmployee) => {
    if (!canAddEmployees) return;
    setPendingEmployee(newEmployee);
    setShowAddConfirmModal(true);
  };

  const confirmAddEmployee = () => {
    if (!pendingEmployee || !canAddEmployees) return;

    setEmployees((prev) => [pendingEmployee, ...prev]);
    setShowAddConfirmModal(false);
    setShowAddModal(false);
    setPendingEmployee(null);
  };

  const cancelAddEmployee = () => {
    setShowAddConfirmModal(false);
    setPendingEmployee(null);
  };

  const handleViewClick = (employee) => {
    if (!canViewEmployees) return;

    if (userRole === "Manager" && employee.role === "Admin") return;

    if (userRole === "Employee" && employee.teamId !== currentUserTeamId)
      return;

    setPendingViewEmployee(employee);
    setShowViewConfirm(true);
  };

  const confirmViewEmployee = () => {
    if (!pendingViewEmployee || !canViewEmployees) return;

    setSelectedEmployee(pendingViewEmployee);
    setShowViewModal(true);
    setShowViewConfirm(false);
    setPendingViewEmployee(null);
  };

  const cancelViewEmployee = () => {
    setShowViewConfirm(false);
    setPendingViewEmployee(null);
  };

  const handleEditClick = (employee) => {
    if (!canEditEmployees) return;
    if (!canEditEmployee(employee)) return;

    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleUpdateEmployee = (updatedEmployee) => {
    if (!canEditEmployees) return;
    setPendingEditEmployee(updatedEmployee);
    setShowEditConfirm(true);
  };

  const confirmUpdateEmployee = () => {
    if (!pendingEditEmployee) return;

    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === pendingEditEmployee.id ? pendingEditEmployee : employee,
      ),
    );

    setShowEditConfirm(false);
    setShowEditModal(false);
    setSelectedEmployee(null);
    setPendingEditEmployee(null);
  };

  const cancelUpdateEmployee = () => {
    setShowEditConfirm(false);
    setPendingEditEmployee(null);
  };

  const handleDeleteClick = (employee) => {
    if (!canDeleteEmployee(employee)) return;

    setSelectedEmployee(employee);
    setDeleteTitle("Delete Employee");
    setDeleteMessage(
      `Are you sure you want to delete ${employee.name || "this employee"}?`,
    );
    setShowDeleteConfirm(true);
  };

  const handleDeleteEmployee = (employeeId) => {
    if (!selectedEmployee) return;
    if (!canDeleteEmployee(selectedEmployee)) return;

    setEmployees((prev) =>
      prev.filter((employee) => employee.id !== employeeId),
    );
    setShowDeleteConfirm(false);
    setSelectedEmployee(null);
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      if (userRole === "Manager" && employee.role === "Admin") {
        return false;
      }

      if (userRole === "Employee") {
        if (employee.teamId !== currentUserTeamId) {
          return false;
        }
      }

      const matchesSearch =
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole =
        selectedRole === "All Roles" || employee.role === selectedRole;

      const matchesStatus =
        selectedStatus === "All Status" || employee.status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [
    employees,
    searchTerm,
    selectedRole,
    selectedStatus,
    userRole,
    currentUserTeamId,
  ]);

  const totalEmployees = filteredEmployees.length;
  const activeEmployees = filteredEmployees.filter(
    (emp) => emp.status === "Active",
  ).length;
  const managers = filteredEmployees.filter(
    (emp) => emp.role === "Manager",
  ).length;
  const admins = filteredEmployees.filter((emp) => emp.role === "Admin").length;
 const teamEmployees = filteredEmployees.filter(
   (emp) => emp.role === "Employee",
 ).length;

  const getStatusClasses = (status) => {
    if (status === "Active") {
      return darkMode
        ? "bg-green-900/40 text-green-400 border border-green-700"
        : "bg-green-100 text-green-700 border border-green-200";
    }
    if (status === "On Leave") {
      return darkMode
        ? "bg-yellow-900/40 text-yellow-400 border border-yellow-700"
        : "bg-yellow-100 text-yellow-700 border border-yellow-200";
    }
    return darkMode
      ? "bg-red-900/40 text-red-400 border border-red-700"
      : "bg-red-100 text-red-700 border border-red-200";
  };

  const cardClass = darkMode
    ? "bg-gray-800 border border-gray-700 text-white"
    : "bg-white border border-gray-200 text-gray-900";

  const subTextClass = darkMode ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      {showAddModal && canAddEmployees && (
        <AddEmployee
          darkMode={darkMode}
          setShowAddModal={setShowAddModal}
          onAddEmployee={handleAddEmployee}
        />
      )}

      {showViewModal && selectedEmployee && canViewEmployees && (
        <ViewEmployee
          darkMode={darkMode}
          employee={selectedEmployee}
          setShowViewModal={setShowViewModal}
        />
      )}

      {showEditModal && selectedEmployee && canEditEmployees && (
        <EditEmployee
          darkMode={darkMode}
          employee={selectedEmployee}
          setShowEditModal={setShowEditModal}
          onUpdateEmployee={handleUpdateEmployee}
        />
      )}

      <ConfirmationModal
        darkMode={darkMode}
        isOpen={showAddConfirmModal}
        type="success"
        title="Add Employee"
        message={`Are you sure you want to add ${pendingEmployee?.name || "this employee"}?`}
        confirmText="Add"
        cancelText="Cancel"
        onConfirm={confirmAddEmployee}
        onCancel={cancelAddEmployee}
      />

      <ConfirmationModal
        darkMode={darkMode}
        isOpen={showViewConfirm}
        type="success"
        title="Open Employee"
        message={`Do you want to view ${pendingViewEmployee?.name || "this employee"}?`}
        confirmText="Yes, Open"
        cancelText="Cancel"
        onConfirm={confirmViewEmployee}
        onCancel={cancelViewEmployee}
      />

      <ConfirmationModal
        darkMode={darkMode}
        isOpen={showEditConfirm}
        type="success"
        title="Update Employee"
        message={`Are you sure you want to update ${pendingEditEmployee?.name || "this employee"}?`}
        confirmText="Update"
        cancelText="Cancel"
        onConfirm={confirmUpdateEmployee}
        onCancel={cancelUpdateEmployee}
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
          selectedEmployee && handleDeleteEmployee(selectedEmployee.id)
        }
        onCancel={() => {
          setShowDeleteConfirm(false);
          setSelectedEmployee(null);
        }}
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        
        <div>
          <h1
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {isEmployee ? "My Team" : "Employee Team"}
          </h1>
          <p className={`mt-1 text-sm ${subTextClass}`}>
            {isEmployee
              ? "View your manager and teammates in ClientCrew."
              : "Manage your ClientCrew team members, roles, and activity."}
          </p>
        </div>

        {canAddEmployees && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#0f766e] text-white hover:opacity-90 cursor-pointer"
          >
            <Plus size={18} />
            Add Employee
          </button>
        )}
      </div>

      
      {/* start cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

        <div className={`rounded-2xl p-4 shadow-sm ${cardClass}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${subTextClass}`}>Total Employees</p>
              <h2 className="text-2xl font-bold mt-2">{totalEmployees}</h2>
            </div>
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <Users size={22} />
            </div>
          </div>
        </div>

        <div className={`rounded-2xl p-5 shadow-sm ${cardClass}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${subTextClass}`}>Active Members</p>
              <h2 className="text-2xl font-bold mt-2">{activeEmployees}</h2>
            </div>
            <div className="p-3 rounded-xl bg-green-100 text-green-600">
              <UserCheck size={22} />
            </div>
          </div>
        </div>

        <div className={`rounded-2xl p-5 shadow-sm ${cardClass}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${subTextClass}`}>Managers</p>
              <h2 className="text-2xl font-bold mt-2">{managers}</h2>
            </div>
            <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
              <Briefcase size={22} />
            </div>
          </div>
        </div>

        <div className={`rounded-2xl p-5 shadow-sm ${cardClass}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${subTextClass}`}>
                {isEmployee ? "Teammates" : "Admins"}
              </p>
              <h2 className="text-2xl font-bold mt-2">
                {isEmployee ? teamEmployees : admins}
              </h2>
            </div>
            <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
              <ShieldCheck size={22} />
            </div>
          </div>
        </div>
      </div>

      
      {/* search  */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
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
            placeholder="Search employee, email, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`bg-transparent outline-none ml-2 w-full text-sm ${
              darkMode
                ? "text-white placeholder:text-gray-300"
                : "text-gray-700 placeholder:text-gray-400"
            }`}
          />
        </div>

        <div className="flex gap-3">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className={`px-3 py-2 rounded-lg text-sm border cursor-pointer ${
              darkMode
                ? "bg-gray-600 border-gray-500 text-white"
                : "bg-gray-50 border-gray-200 text-gray-700"
            }`}
          >
            <option>All Roles</option>
            <option>Admin</option>
            <option>Manager</option>
            <option>Employee</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`px-3 py-2 rounded-lg text-sm border cursor-pointer ${
              darkMode
                ? "bg-gray-600 border-gray-500 text-white"
                : "bg-gray-50 border-gray-200 text-gray-700"
            }`}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>On Leave</option>
            <option>Inactive</option>
          </select>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className={`rounded-2xl p-5 shadow-sm hover:shadow-md transition ${cardClass}`}
          >
            <div className="flex items-start justify-between gap-4">
              
              <div className="flex items-center gap-4">

                {/* employee image*/}
                <img
                  src={employee.image}
                  alt={employee.name}
                  className="w-14 h-14 rounded-full object-cover border border-gray-300"
                />

                {/* employee name, role and department */}
                <div>
                  <h3 className="text-lg font-semibold">{employee.name}</h3>
                  <p className={`text-sm ${subTextClass}`}>
                    {employee.role} • {employee.department}
                  </p>
                </div>
              </div>

              {/* employee status */}
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusClasses(
                  employee.status,
                )}`}
              >
                {employee.status}
              </span>
            </div>

            
            {/* employee mail */}
            <div className="mt-5 space-y-3">
              <div
                className={`flex items-center gap-3 text-sm ${subTextClass}`}
              >
                <Mail size={16} />
                <span>{employee.email}</span>
              </div>

              
              {/* employee phone */}
              <div
                className={`flex items-center gap-3 text-sm ${subTextClass}`}
              >
                <Phone size={16} />
                <span>{employee.phone}</span>
              </div>

              <div
                className={`flex items-center gap-3 text-sm ${subTextClass}`}
              >
                <MapPin size={16} />
                <span>{employee.location}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              {canViewEmployees && (
                <button
                  onClick={() => handleViewClick(employee)}
                  title="View Employee"
                  className={`p-2 rounded-lg transition cursor-pointer ${
                    darkMode
                      ? "bg-blue-900/40 hover:bg-blue-900/60 text-blue-400"
                      : "bg-blue-50 hover:bg-blue-100 text-blue-600"
                  }`}
                >
                  <Eye size={16} />
                </button>
              )}

              {canEditEmployees && canEditEmployee(employee) && (
                <button
                  onClick={() => handleEditClick(employee)}
                  title="Edit Employee"
                  className={`p-2 rounded-lg transition cursor-pointer ${
                    darkMode
                      ? "bg-green-900/40 hover:bg-green-900/60 text-green-400"
                      : "bg-green-50 hover:bg-green-100 text-green-600"
                  }`}
                >
                  <Pencil size={16} />
                </button>
              )}

              {canDeleteEmployee(employee) && (
                <button
                  onClick={() => handleDeleteClick(employee)}
                  title="Delete Employee"
                  className={`p-2 rounded-lg transition cursor-pointer ${
                    darkMode
                      ? "bg-red-900/40 hover:bg-red-900/60 text-red-400"
                      : "bg-red-50 hover:bg-red-100 text-red-600"
                  }`}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div
          className={`mt-6 rounded-2xl p-10 text-center shadow-sm ${cardClass}`}
        >
          <h3 className="text-lg font-semibold">No employees found</h3>
          <p className={`mt-2 text-sm ${subTextClass}`}>
            Try changing search or filter options.
          </p>
        </div>
      )}
    </div>
  );
}
