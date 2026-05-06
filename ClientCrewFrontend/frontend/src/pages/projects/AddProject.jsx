import { useState, useEffect } from "react";
import { Folder, Search } from "lucide-react";
import AddCustomer from "../customers/AddCustomer";
import AddEmployee from "../employees/AddEmployee";

export default function AddProject({
  darkMode,
  setShowAdd,
  onAddProject,
  userRole,
}) {
  // const navigate = useNavigate();

  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);

  const canManageEmployees = ["Admin", "Manager"].includes(userRole);

  const [formData, setFormData] = useState({
    projectName: "",
    customerId: "",
    startDate: "",
    dueDate: "",
    status: "Planning",
    progress: "",
    assignedEmployees: [],
    icon: "",
    iconColor: "bg-teal-500",
  });

  const [errors, setErrors] = useState({});

  const validateStatusProgress = (status, progress) => {
    const progressValue = Number(progress);

    if (status === "Planning" && progressValue !== 0) {
      return "Planning project progress must be 0";
    }

    if (status === "In Progress" && (progressValue < 1 || progressValue > 99)) {
      return "In Progress project progress must be between 1 and 99";
    }

    if (status === "Completed" && progressValue !== 100) {
      return "Completed project progress must be 100";
    }

    if (status === "On Hold" && (progressValue < 1 || progressValue > 99)) {
      return "On Hold project progress must be between 1 and 99";
    }

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "status") {
      setFormData((prev) => ({
        ...prev,
        status: value,
        progress:
          value === "Planning"
            ? 0
            : value === "Completed"
              ? 100
              : value === "In Progress"
                ? 1
                : prev.progress,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectName.trim())
      newErrors.projectName = "Project name is required";

    if (!formData.customerId) {
      newErrors.customerId = "Select a customer";
    }

    if (!formData.startDate) newErrors.startDate = "Start date is required";

    if (!formData.dueDate) newErrors.dueDate = "Due date is required";

    // Correct date validation (only once)
    if (
      formData.startDate &&
      formData.dueDate &&
      new Date(formData.dueDate) < new Date(formData.startDate)
    ) {
      newErrors.dueDate = "Due date cannot be before start date";
    }

    if (formData.progress === "") newErrors.progress = "Progress is required";
    else if (formData.progress < 0 || formData.progress > 100)
      newErrors.progress = "Progress must be between 0 and 100";

    const progressStatusError = validateStatusProgress(
      formData.status,
      formData.progress,
    );

    if (progressStatusError) {
      newErrors.progress = progressStatusError;
    }

    if (!formData.icon.trim()) newErrors.icon = "Project icon is required";
    else if (formData.icon.length > 1) newErrors.icon = "Use only one letter";

    if (formData.assignedEmployees.length === 0) {
      newErrors.assignedEmployees = "Select at least one team member";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      projectName: "",
      customerId: "",
      startDate: "",
      dueDate: "",
      status: "Planning",
      progress: "",
      assignedEmployees: [],
      icon: "",
      iconColor: "bg-teal-500",
    });
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onAddProject({
      projectName: formData.projectName,
      clientName: selectedCustomer?.userFullName || "",
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      status: formData.status,
      progress: Number(formData.progress),
      employeeIds: formData.assignedEmployees.map((emp) => emp.userId),
      customerEmail: selectedCustomer?.userEmail || "",
    });
    resetForm();
    // setShowAdd(false);
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
      : "bg-gray-50 border-gray-200 text-black placeholder:text-gray-400"
  }`;

  const labelClass = "block text-sm font-medium mb-2";

  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);

  const selectedCustomer = customerOptions.find(
    (customer) => customer.userId === formData.customerId,
  );

  const handleEmployeeSelect = (employee) => {
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

  const handleCustomerSelect = (customer) => {
    setFormData((prev) => ({
      ...prev,
      customerId: customer.userId,
    }));

    setErrors((prev) => ({
      ...prev,
      customerId: "",
    }));
  };

  const handleAddCustomer = (newCustomer) => {
    const newCustomerWithId = {
      userId: `c${Date.now()}`, // temporary (until DB save)
      userFullName: newCustomer.userFullName,
      userEmail: newCustomer.userEmail,
      userImage: newCustomer.userImage || "",
      userRole: "CUSTOMER",
    };

    setCustomerOptions((prev) => [...prev, newCustomerWithId]);

    setFormData((prev) => ({
      ...prev,
      customerId: newCustomerWithId.userId,
    }));

    setShowAddCustomerModal(false);
  };

  const handleAddEmployee = (newEmployee) => {
    const newEmployeeWithId = {
      userId: `emp${Date.now()}`, // temporary (until DB response)
      userFullName: newEmployee.userFullName,
      userEmail: newEmployee.userEmail,
      userRole: newEmployee.userRole || "EMPLOYEE",
      userImage: newEmployee.userImage || "",
    };

    setEmployeeOptions((prev) => [...prev, newEmployeeWithId]);

    setFormData((prev) => ({
      ...prev,
      assignedEmployees: [...prev.assignedEmployees, newEmployeeWithId],
    }));

    setShowAddEmployeeModal(false);
  };

  const [employeeSearch, setEmployeeSearch] = useState("");

  const [customerSearch, setCustomerSearch] = useState("");

  const filteredCustomers = customerOptions.filter((customer) =>
    customer.userFullName
      ?.toLowerCase()
      .includes(customerSearch.trim().toLowerCase()),
  );

  const filteredEmployees = employeeOptions.filter((employee) => {
    const role = employee.userRole?.toUpperCase();

    const isAllowedRole =
      userRole === "Admin"
        ? role === "EMPLOYEE" || role === "MANAGER"
        : role === "EMPLOYEE";

    const matchesSearch = employee.userFullName
      ?.toLowerCase()
      .includes(employeeSearch.toLowerCase());

    return isAllowedRole && matchesSearch;
  });
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const usersUrl = "http://localhost:8080/api/users";

        const [employeesRes, customersRes] = await Promise.all([
          fetch(usersUrl, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8080/api/users/customers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // 👇 ADD HERE
        if (!employeesRes.ok || !customersRes.ok) {
          throw new Error("Failed to fetch users");
        }

        // 👇 KEEP THIS SAME
        const employees = await employeesRes.json();
        const customers = await customersRes.json();

        setEmployeeOptions(employees);
        setCustomerOptions(customers);
      } catch (error) {
        console.error("Fetch users error:", error);
      }
    };

    fetchUsers();
  }, [userRole]);
  const getColor = (name) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    // Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur px-4">
      {/* add customer */}
      {showAddCustomerModal && (
        <AddCustomer
          darkMode={darkMode}
          setShowAddModal={setShowAddCustomerModal}
          onAddCustomer={handleAddCustomer}
        />
      )}

      {/* // add employee */}
      {showAddEmployeeModal && (
        <AddEmployee
          darkMode={darkMode}
          setShowAddModal={setShowAddEmployeeModal}
          onAddCustomer={handleAddEmployee}
        />
      )}

      {/* // Modal content */}
      <div
        className={`w-full max-w-5xl rounded-2xl p-8 shadow-xl max-h-[90vh] overflow-y-auto ${
          darkMode
            ? "bg-gray-800 border border-gray-600 text-white"
            : "bg-white border border-gray-200 text-black"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Add Project</h2>
            <p className="text-sm text-gray-500">
              Enter project details to create a new record
            </p>
          </div>

          <button
            onClick={() => setShowAdd(false)}
            className="text-gray-500 hover:text-red-500 text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-5">
            {/* Project Name */}
            <div>
              <label className={labelClass}>Project Name</label>
              <div className="flex gap-2">
                <Folder size={18} />
                <input
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              {errors.projectName && (
                <p className="text-red-500 text-xs">{errors.projectName}</p>
              )}
            </div>

            {/* Client */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Select Customer</label>

                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(true)}
                  className="text-sm font-medium text-[#0f766e] hover:underline cursor-pointer"
                >
                  + Add Customer
                </button>
              </div>
              {/* Search */}
              <div
                className={`flex items-center px-4 py-3 rounded-xl w-full lg:w-96 border mb-4 ${
                  darkMode
                    ? "bg-gray-600 border-gray-500"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <Search size={16} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className={`bg-transparent outline-none ml-2 w-full text-sm ${
                    darkMode
                      ? "text-white placeholder:text-gray-300"
                      : "text-gray-700 placeholder:text-gray-400"
                  }`}
                />
              </div>

              <div
                className={`rounded-2xl border p-4 flex flex-wrap gap-4 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => {
                    const isSelected = formData.customerId === customer.userId;

                    return (
                      <button
                        type="button"
                        key={customer.userId}
                        onClick={() => handleCustomerSelect(customer)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition cursor-pointer ${
                          isSelected
                            ? "border-[#0f766e] bg-[#0f766e]/10"
                            : darkMode
                              ? "border-gray-600 bg-gray-800 hover:bg-gray-600"
                              : "border-gray-200 bg-white hover:bg-gray-100"
                        }`}
                      >
                        {customer.userImage ? (
                          <img
                            src={customer.userImage}
                            alt={customer.userFullName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className={`w-10 h-10 rounded-full ${getColor(customer.userFullName)} text-white flex items-center justify-center font-semibold`}
                          >
                            {customer.userFullName?.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="text-left">
                          <p
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-black"
                            }`}
                          >
                            {customer.userFullName}
                          </p>
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-300" : "text-gray-500"
                            }`}
                          >
                            Customer
                          </p>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <p
                    className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                  >
                    No customers found
                  </p>
                )}
              </div>

              {errors.customerId && (
                <p className="text-red-500 text-xs mt-1">{errors.customerId}</p>
              )}
            </div>

            {/* Dates */}
            <div>
              <label className={labelClass}>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`${inputClass} cursor-pointer hover:ring-2 hover:ring-[#0f766e] focus:ring-2 focus:ring-[#0f766e] transition`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Due Date</label>
              <input
                type="date"
                name="dueDate"
                min={formData.startDate}
                value={formData.dueDate}
                onChange={handleChange}
                className={`${inputClass} cursor-pointer hover:ring-2 hover:ring-[#0f766e] focus:ring-2 focus:ring-[#0f766e] transition`}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-xs">{errors.dueDate}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className={labelClass}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option>Planning</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>On Hold</option>
              </select>
            </div>

            {/* Progress */}
            <div>
              <label className={labelClass}>Progress</label>
              <input
                type="number"
                name="progress"
                value={formData.progress}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.progress && (
                <p className="text-red-500 text-xs">{errors.progress}</p>
              )}
            </div>

            {/* Icon */}
            <div>
              <label className={labelClass}>Icon</label>
              <input
                name="icon"
                maxLength={1}
                value={formData.icon}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.icon && (
                <p className="text-red-500 text-xs">{errors.icon}</p>
              )}
            </div>

            {/* Team Members */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">
                  Assign Team Members ({formData.assignedEmployees.length}{" "}
                  person
                  {formData.assignedEmployees.length !== 1 ? "s" : ""})
                </label>

                {canManageEmployees && (
                  <button
                    type="button"
                    onClick={() => setShowAddEmployeeModal(true)}
                    className="text-sm font-medium text-[#0f766e] hover:underline cursor-pointer"
                  >
                    + Add Team Member
                  </button>
                )}
              </div>

              {/* Search */}
              <div
                className={`flex items-center px-4 py-3 rounded-xl w-full lg:w-96 border mb-4 ${
                  darkMode
                    ? "bg-gray-600 border-gray-500"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <Search size={16} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  className={`bg-transparent outline-none ml-2 w-full text-sm ${
                    darkMode
                      ? "text-white placeholder:text-gray-300"
                      : "text-gray-700 placeholder:text-gray-400"
                  }`}
                />
              </div>

              <div
                className={`rounded-2xl border p-4 flex flex-wrap gap-4 max-h-[220px] overflow-y-auto ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => {
                    const isSelected = formData.assignedEmployees.some(
                      (member) => member.userId === employee.userId,
                    );

                    return (
                      <button
                        type="button"
                        key={employee.userId}
                        onClick={() => handleEmployeeSelect(employee)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition cursor-pointer ${
                          isSelected
                            ? "border-[#0f766e] bg-[#0f766e]/10"
                            : darkMode
                              ? "border-gray-600 bg-gray-800 hover:bg-gray-600"
                              : "border-gray-200 bg-white hover:bg-gray-100"
                        }`}
                      >
                        {employee.userImage ? (
                          <img
                            src={employee.userImage}
                            alt={employee.userFullName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className={`w-10 h-10 rounded-full ${getColor(employee.userFullName)} text-white flex items-center justify-center font-semibold`}
                          >
                            {employee.userFullName?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="text-left">
                          <p
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-black"
                            }`}
                          >
                            {employee.userFullName}
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
                  })
                ) : (
                  <p
                    className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                  >
                    No employees found
                  </p>
                )}
              </div>

              {errors.assignedEmployees && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.assignedEmployees}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 bg-gray-300 cursor-pointer rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-[#0f766e] cursor-pointer text-white rounded-xl"
            >
              Save Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
