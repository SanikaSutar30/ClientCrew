import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { X } from "lucide-react";

export default function EditEmployee({
  darkMode,
  employee,
  setShowEditModal,
  onUpdateEmployee,
}) {

  const { userRole } = useOutletContext();
  const [formData, setFormData] = useState({
    id: employee.id,
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    role: employee.role,
    department: employee.department,
    status: employee.status,
    joinedDate: employee.joinedDate,
    location: employee.location,
    projects: employee.projects,
    image: employee.image,
  });

  const [errors, setErrors] = useState({});

  // Handle text/select/date changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];

      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Only PNG, JPG and JPEG images are allowed",
        }));
        return;
      }

      const imageUrl = URL.createObjectURL(file);

      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));

      setErrors((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Employee name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.joinedDate) {
      newErrors.joinedDate = "Joined date is required";
    }

    if (formData.projects === "" || Number(formData.projects) < 0) {
      newErrors.projects = "Projects must be 0 or more";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit updated employee data
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onUpdateEmployee({
      ...formData,
      projects: Number(formData.projects),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div
        className={`w-full max-w-3xl rounded-2xl shadow-xl p-6 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Edit Employee</h2>
          <button
            onClick={() => setShowEditModal(false)}
            className="p-2 rounded-lg text-gray-500 hover:text-red-500 text-xl cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Name */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 rounded-xl border outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 rounded-xl border outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 rounded-xl border outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 rounded-xl border outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            >
              {/* ADMIN → full control */}
              {userRole === "Admin" && (
                <>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                </>
              )}

              {/* MANAGER → restricted */}
              {userRole === "Manager" && (
                <>
                  {/* Editing Manager */}
                  {employee.role === "Manager" && (
                    <>
                      <option value="Manager">Manager</option>
                      <option value="Employee">Employee</option>
                    </>
                  )}

                  {/* Editing Employee */}
                  {employee.role === "Employee" && (
                    <>
                      <option value="Employee">Employee</option>
                    </>
                  )}
                </>
              )}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="text-sm font-medium">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 rounded-xl border outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />
            {errors.department && (
              <p className="text-red-500 text-xs mt-1">{errors.department}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 rounded-xl border outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Joined Date */}
          <div>
            <label className="text-sm font-medium">Joined Date</label>
            <input
              type="date"
              name="joinedDate"
              value={formData.joinedDate}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 rounded-xl border outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />
            {errors.joinedDate && (
              <p className="text-red-500 text-xs mt-1">{errors.joinedDate}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 rounded-xl border outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location}</p>
            )}
          </div>

          {/* Projects */}
          <div>
            <label className="text-sm font-medium">Projects</label>
            <input
              type="number"
              name="projects"
              value={formData.projects}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 rounded-xl border outline-none ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />
            {errors.projects && (
              <p className="text-red-500 text-xs mt-1">{errors.projects}</p>
            )}
          </div>

          {/* Profile Image */}
          <div>
            <label className="text-sm font-medium">Profile Image</label>
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              onChange={handleImageChange}
              className={`w-full mt-1 px-4 py-2 rounded-xl border outline-none cursor-pointer file:mr-4 file:rounded-lg file:border-0 file:px-3 file:py-2 file:text-sm ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white"
                  : "bg-white border-gray-300 text-black file:bg-gray-200 file:text-black"
              }`}
            />
            {errors.image && (
              <p className="text-red-500 text-xs mt-1">{errors.image}</p>
            )}
          </div>

          {/* Preview */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium block mb-2">
              Current Preview
            </label>
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-300">
              <img
                src={formData.image}
                alt={formData.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 rounded-xl border border-gray-300 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0f766e] text-white cursor-pointer"
            >
              Update Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
