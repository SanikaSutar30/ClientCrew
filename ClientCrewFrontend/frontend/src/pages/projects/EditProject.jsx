import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function EditProject({
  darkMode,
  project,
  setShowEdit,
  onUpdateProject,
  userRole,
}) {
  const [formData, setFormData] = useState({
    id: project.id,
    projectName: project.projectName || "",
    clientName: project.clientName || "",
    startDate: project.startDate || "",
    dueDate: project.dueDate || "",
    status: project.status || "Planning",
    progress: project.progress || 0,
    customerId: project.customerEmail || "",
    employeeEmail: project.employeeEmail || "",
    customerEmail: project.customerEmail || "",
    icon: project.icon || "P",
    iconColor: project.iconColor || "bg-teal-500",
    assignedEmployees: project.assignedEmployees || [],
  });

  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const [employeeOptions, setEmployeeOptions] = useState([]);

  const [customerOptions, setCustomerOptions] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        // const usersUrl =
        //   userRole === "Admin"
        //     ? "http://localhost:8080/api/users"
        //     : "http://localhost:8080/api/users/employees";

        const usersUrl = "http://localhost:8080/api/users";

        const [usersRes, customersRes] = await Promise.all([
          fetch(usersUrl, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8080/api/users/customers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!usersRes.ok || !customersRes.ok) {
          throw new Error("Failed to fetch users");
        }

        const users = await usersRes.json();
        const customers = await customersRes.json();

        setEmployeeOptions(users);
        setCustomerOptions(customers);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [userRole]);
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmployeeSelect = (employee) => {
    const role = employee.userRole?.toUpperCase();

    if (userRole === "Manager" && role === "MANAGER") {
      return;
    }

    const alreadySelected = formData.assignedEmployees.some(
      (member) => member.userId === employee.userId,
    );

    if (alreadySelected) {
      setFormData((prev) => ({
        ...prev,
        assignedEmployees: prev.assignedEmployees.filter(
          (member) => member.userId !== employee.userId,
        ),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        assignedEmployees: [...prev.assignedEmployees, employee],
      }));
    }

    setErrors((prev) => ({
      ...prev,
      assignedEmployees: "",
    }));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = "Project name is required";
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }
    // if (!formData.icon.trim()) {
    //   newErrors.icon = "Project icon is required";
    // }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    if (
      formData.startDate &&
      formData.dueDate &&
      new Date(formData.dueDate) < new Date(formData.startDate)
    ) {
      newErrors.dueDate = "Due date cannot be before start date";
    }

    if (
      formData.progress < 0 ||
      formData.progress > 100 ||
      formData.progress === ""
    ) {
      newErrors.progress = "Progress must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit update
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    onUpdateProject({
      id: formData.id,
      projectName: formData.projectName,
      clientName: formData.clientName,
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      status: formData.status,
      progress: Number(formData.progress),
      customerEmail: formData.customerEmail,
      employeeIds: formData.assignedEmployees.map((emp) => emp.userId),
    });
  };

  const filteredCustomers = customerOptions.filter((customer) =>
    customer.userFullName?.toLowerCase().includes(customerSearch.toLowerCase()),
  );

  const filteredEmployees = employeeOptions.filter((employee) => {
    const role = employee.userRole?.toUpperCase();

    const isAlreadySelected = formData.assignedEmployees.some(
      (member) => member.userId === employee.userId,
    );

    const isAllowedRole =
      userRole === "Admin"
        ? role === "MANAGER" || role === "EMPLOYEE"
        : role === "EMPLOYEE" || (role === "MANAGER" && isAlreadySelected);

    const matchesSearch = employee.userFullName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    return isAllowedRole && matchesSearch;
  });

  const loggedInEmail = localStorage.getItem("userEmail");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 py-6">
      <div
        className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-6 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Edit Project</h2>

          <button
            onClick={() => setShowEdit(false)}
            className="p-2 text-gray-500 hover:text-red-500 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Project Name */}
          <div>
            <label className="text-sm font-medium">Project Name</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 rounded-xl border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />
            {errors.projectName && (
              <p className="text-red-500 text-xs mt-1">{errors.projectName}</p>
            )}
          </div>

          {/* Preview */}
          <div>
            <label className="text-sm font-medium block mb-2">
              Project Preview
            </label>

            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl ${formData.iconColor} text-white flex items-center justify-center font-bold`}
              >
                {formData.icon}
              </div>

              <div>
                <p className="font-semibold">{formData.projectName}</p>
                <p className="text-sm text-gray-500">{formData.clientName}</p>
              </div>
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label className="text-sm font-medium">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 rounded-xl border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />
            {errors.startDate && (
              <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="text-sm font-medium">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 rounded-xl border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 rounded-xl border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            >
              <option>Planning</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>On Hold</option>
            </select>
          </div>

          {/* Progress */}
          <div>
            <label className="text-sm font-medium">Progress (%)</label>
            <input
              type="number"
              name="progress"
              value={formData.progress}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 rounded-xl border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />
            {errors.progress && (
              <p className="text-red-500 text-xs mt-1">{errors.progress}</p>
            )}
          </div>

          {/*  Select Customer */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-2">Select Customer</label>

            {/* Search */}
            <input
              type="text"
              placeholder="Search customers..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className={`w-full mb-4 px-4 py-2 rounded-xl border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />

            {/* Customer Cards */}
            <div
              className={`rounded-2xl border p-4 flex flex-wrap gap-4 ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              {filteredCustomers.map((customer) => {
                const isSelected =
                  formData.customerEmail === customer.userEmail;

                return (
                  <button
                    type="button"
                    key={customer.userId}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        customerEmail: customer.userEmail,
                        clientName: customer.userFullName,
                      }))
                    }
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? "border-[#0f766e] bg-[#0f766e]/10"
                        : darkMode
                          ? "border-gray-600 bg-gray-800 hover:bg-gray-600"
                          : "border-gray-200 bg-white hover:bg-gray-100"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-semibold">
                      {customer.userFullName?.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="text-left">
                      <p className="text-sm font-medium">
                        {customer.userFullName}
                      </p>

                      <p className="text-xs text-gray-500">
                        {customer.userEmail}
                      </p>

                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">
                        CUSTOMER
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {errors.clientName && (
              <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>
            )}
          </div>

          {/* Assigned Employees */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium block mb-2">
              Assigned Members ({formData.assignedEmployees.length})
            </label>

            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full mb-3 px-4 py-2 rounded-xl border text-sm ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-black placeholder-gray-400"
              }`}
            />

            <div
              className={`rounded-2xl border p-4 flex flex-wrap gap-4 max-h-[170px] overflow-y-auto ${
                darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              {filteredEmployees.map((employee) => {
                const isSelected = formData.assignedEmployees.some(
                  (member) => member.userId === employee.userId,
                );
                const isLockedManager =
                  userRole === "Manager" && employee.userRole === "MANAGER";

                return (
                  <button
                    type="button"
                    key={employee.userId}
                    disabled={isLockedManager}
                    onClick={() => handleEmployeeSelect(employee)}
                    className={`flex items-center gap-3 px-4 py-3 w-[220px] rounded-2xl border transition ${
                      isLockedManager
                        ? "opacity-60 cursor-not-allowed"
                        : "cursor-pointer"
                    } ${
                      isSelected
                        ? "border-[#0f766e] bg-[#0f766e]/20 shadow-sm"
                        : darkMode
                          ? "border-gray-600 bg-gray-800 hover:bg-gray-600"
                          : "border-gray-200 bg-white hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full overflow-hidden text-white flex items-center justify-center font-semibold ${
                        employee.userRole === "MANAGER"
                          ? "bg-blue-600"
                          : "bg-[#0f766e]"
                      }`}
                    >
                      {employee.userImage ? (
                        <img
                          src={employee.userImage}
                          alt={employee.userFullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        employee.userFullName?.charAt(0).toUpperCase()
                      )}
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-medium">
                        {employee.userEmail === loggedInEmail
                          ? "You"
                          : employee.userFullName}
                      </p>

                      <p
                        className={`text-xs ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                      >
                        {employee.userRole}
                      </p>
                      <p className="text-xs text-gray-500">
                        {employee.userEmail}
                      </p>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          employee.userRole === "MANAGER"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {employee.userRole}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {errors.assignedEmployees && (
              <p className="text-red-500 text-xs mt-1">
                {errors.assignedEmployees}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-end gap-4  mt-4">
            <button
              type="button"
              onClick={() => setShowEdit(false)}
              className="px-4 py-2 rounded-xl border cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0f766e] text-white cursor-pointer"
            >
              Update Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
