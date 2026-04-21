import { useState } from "react";
import { Folder, Search } from "lucide-react";
// import { useNavigate } from "react-router-dom";
import AddCustomer from "../customers/AddCustomer";
import AddEmployee from "../employees/AddEmployee";

export default function AddProject({ darkMode, setShowAdd, onAddProject , userRole}) {
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

  const handleChange = (e) => {
    const { name, value } = e.target;

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
      ...formData,
      clientName: selectedCustomer?.name || "",
      progress: Number(formData.progress),
      icon: formData.icon.toUpperCase(),
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

const [employeeOptions, setEmployeeOptions] = useState([
  {
    id: "emp1",
    name: "Priya Singh",
    role: "Manager",
    image: "../assets/Profile.jpg",
  },
  {
    id: "emp2",
    name: "Rahul Sharma",
    role: "Employee",
    image: "../assets/Profile2.jpg",
  },
  {
    id: "emp3",
    name: "John Doe",
    role: "Employee",
    image: "../assets/Profile3.jpg",
  },
  {
    id: "emp4",
    name: "Jennifer Brown",
    role: "Employee",
    image: "../assets/Profile4.jpg",
  },
  {
    id: "emp5",
    name: "Amit Patil",
    role: "Employee",
    image: "../assets/Profile5.jpg",
  },
]);
  const [customerOptions, setCustomerOptions] = useState([
    { id: "c1", name: "ABC Tech Solutions", image: "../assets/Profile.jpg" },
    { id: "c2", name: "XYZ Innovations", image: "../assets/Profile2.jpg" },
    { id: "c3", name: "Acme Corp", image: "../assets/Profile3.jpg" },
    { id: "c4", name: "Global Ventures", image: "../assets/Profile4.jpg" },
    { id: "c5", name: "MediCare Inc", image: "../assets/Profile5.jpg" },
  ]);

  const selectedCustomer = customerOptions.find(
    (customer) => customer.id === formData.customerId,
  );

  const handleEmployeeSelect = (employee) => {
    const alreadySelected = formData.assignedEmployees.some(
      (member) => member.id === employee.id,
    );

    if (alreadySelected) {
      setFormData((prev) => ({
        ...prev,
        assignedEmployees: prev.assignedEmployees.filter(
          (member) => member.id !== employee.id,
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
      customerId: customer.id,
    }));

    setErrors((prev) => ({
      ...prev,
      customerId: "",
    }));
  };

  const handleAddCustomer = (newCustomer) => {
    const newCustomerWithId = {
      id: `c${Date.now()}`,
      name: newCustomer.name,
      image: newCustomer.image || "",
    };

    setCustomerOptions((prev) => [...prev, newCustomerWithId]);

    setFormData((prev) => ({
      ...prev,
      customerId: newCustomerWithId.id,
    }));

    setShowAddCustomerModal(false);
  };


  const handleAddEmployee = (newEmployee) => {
    const newEmployeeWithId = {
      id: `emp${Date.now()}`,
      name: newEmployee.name,
      role: newEmployee.role || "Employee",
      image: newEmployee.image || "../assets/Profile.jpg",
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
  customer.name.toLowerCase().includes(customerSearch.trim().toLowerCase()),
);
  
  const filteredEmployees = employeeOptions.filter(
    (employee) =>
      employee.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      employee.role.toLowerCase().includes(employeeSearch.toLowerCase()),
  );
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur px-4">
      {showAddCustomerModal && (
        <AddCustomer
          darkMode={darkMode}
          setShowAddModal={setShowAddCustomerModal}
          onAddCustomer={handleAddCustomer}
        />
      )}
      {showAddEmployeeModal && (
        <AddEmployee
          darkMode={darkMode}
          setShowAddModal={setShowAddEmployeeModal}
          onAddCustomer={handleAddEmployee}
        />
      )}
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
                    const isSelected = formData.customerId === customer.id;

                    return (
                      <button
                        type="button"
                        key={customer.id}
                        onClick={() => handleCustomerSelect(customer)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition cursor-pointer ${
                          isSelected
                            ? "border-[#0f766e] bg-[#0f766e]/10"
                            : darkMode
                              ? "border-gray-600 bg-gray-800 hover:bg-gray-600"
                              : "border-gray-200 bg-white hover:bg-gray-100"
                        }`}
                      >
                        {customer.image ? (
                          <img
                            src={customer.image}
                            alt={customer.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white flex items-center justify-center font-semibold">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="text-left">
                          <p
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-black"
                            }`}
                          >
                            {customer.name}
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
                  Assign To ({formData.assignedEmployees.length} person
                  {formData.assignedEmployees.length !== 1 ? "s" : ""})
                </label>

                {canManageEmployees && (
                  <button
                    type="button"
                    onClick={() => setShowAddEmployeeModal(true)}
                    className="text-sm font-medium text-[#0f766e] hover:underline cursor-pointer"
                  >
                    + Add Employee
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
                      (member) => member.id === employee.id,
                    );

                    return (
                      <button
                        type="button"
                        key={employee.id}
                        onClick={() => handleEmployeeSelect(employee)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition cursor-pointer ${
                          isSelected
                            ? "border-[#0f766e] bg-[#0f766e]/10"
                            : darkMode
                              ? "border-gray-600 bg-gray-800 hover:bg-gray-600"
                              : "border-gray-200 bg-white hover:bg-gray-100"
                        }`}
                      >
                        <img
                          src={employee.image}
                          alt={employee.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />

                        <div className="text-left">
                          <p
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-black"
                            }`}
                          >
                            {employee.name}
                          </p>
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-300" : "text-gray-500"
                            }`}
                          >
                            {employee.role}
                          </p>
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
