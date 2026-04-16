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




export default function Employees() {
  const { darkMode } = useOutletContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const [showAddModal, setShowAddModal] = useState(false);

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
  },
]);

  const handleAddEmployee = (newEmployee) => {
    setEmployees((prev) => [newEmployee, ...prev]);
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
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
  }, [employees, searchTerm, selectedRole, selectedStatus]);

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(
    (emp) => emp.status === "Active",
  ).length;
  const managers = employees.filter((emp) => emp.role === "Manager").length;
  const admins = employees.filter((emp) => emp.role === "Admin").length;

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

  const inputClass = darkMode
    ? "bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
    : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400";

  return (
    <div
      className={`min-h-screen  ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}
    >
      {showAddModal && (
        <AddEmployee
          darkMode={darkMode}
          setShowAddModal={setShowAddModal}
          onAddEmployee={handleAddEmployee}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Employee Team
          </h1>
          <p className={`mt-1 text-sm ${subTextClass}`}>
            Manage your ClientCrew team members, roles, and activity.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#0f766e] text-white hover:opacity-90 cursor-pointer"
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <div className={`rounded-2xl p-5 shadow-sm ${cardClass}`}>
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
              <p className={`text-sm ${subTextClass}`}>Admins</p>
              <h2 className="text-2xl font-bold mt-2">{admins}</h2>
            </div>
            <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
              <ShieldCheck size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`rounded-2xl p-4 mb-6 shadow-sm ${cardClass}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl ${inputClass}`}
          >
            <Search
              size={18}
              className={darkMode ? "text-gray-400" : "text-gray-500"}
            />
            <input
              type="text"
              placeholder="Search employee, email, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full outline-none bg-transparent text-sm ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            />
          </div>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className={`px-4 py-3 rounded-xl outline-none ${inputClass}`}
          >
            <option>All Roles</option>
            <option>Admin</option>
            <option>Manager</option>
            <option>Employee</option>
            <option>Customer</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={`px-4 py-3 rounded-xl outline-none ${inputClass}`}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>On Leave</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className={`rounded-2xl p-5 shadow-sm hover:shadow-md transition ${cardClass}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={employee.image}
                  alt={employee.name}
                  className="w-14 h-14 rounded-full object-cover border border-gray-300"
                />
                <div>
                  <h3 className="text-lg font-semibold">{employee.name}</h3>
                  <p className={`text-sm ${subTextClass}`}>
                    {employee.role} • {employee.department}
                  </p>
                </div>
              </div>

              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusClasses(
                  employee.status,
                )}`}
              >
                {employee.status}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <div
                className={`flex items-center gap-3 text-sm ${subTextClass}`}
              >
                <Mail size={16} />
                <span>{employee.email}</span>
              </div>

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

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div
                className={`rounded-xl p-3 ${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <p className={`text-xs ${subTextClass}`}>Projects</p>
                <h4 className="text-lg font-bold mt-1">{employee.projects}</h4>
              </div>

              <div
                className={`rounded-xl p-3 ${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <p className={`text-xs ${subTextClass}`}>Joined</p>
                <h4 className="text-sm font-semibold mt-1">
                  {employee.joinedDate}
                </h4>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <button
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <Eye size={16} />
                View
              </button>

              <button
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition ${
                  darkMode
                    ? "bg-blue-900/40 hover:bg-blue-900/60 text-blue-400"
                    : "bg-blue-100 hover:bg-blue-200 text-blue-700"
                }`}
              >
                <Pencil size={16} />
                Edit
              </button>

              <button
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition ${
                  darkMode
                    ? "bg-red-900/40 hover:bg-red-900/60 text-red-400"
                    : "bg-red-100 hover:bg-red-200 text-red-700"
                }`}
              >
                <Trash2 size={16} />
                Delete
              </button>
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
