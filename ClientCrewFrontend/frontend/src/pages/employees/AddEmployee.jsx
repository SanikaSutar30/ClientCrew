import { useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function AddEmployee({
  darkMode,
  setShowAddModal,
  onAddEmployee,
}) {
  const { userRole } = useOutletContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: userRole === "Admin" ? "Employee" : "Employee",
    status: "Active",
    joinedDate: "",
    image: "",
    password: "123456",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "Only PNG, JPG and JPEG images are allowed",
      }));
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: reader.result,
      }));

      setErrors((prev) => ({
        ...prev,
        image: "",
      }));
    };

    reader.readAsDataURL(file);
  };

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

    if (!formData.joinedDate) {
      newErrors.joinedDate = "Joined date is required";
    }

    if (!formData.image) {
      newErrors.image = "Profile image is required";
    }

    if (userRole === "Manager" && formData.role !== "Employee") {
      newErrors.role = "Manager can add only employees";
    }

    if (formData.role === "Admin") {
      newErrors.role = "Admin cannot be created from Employee page";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onAddEmployee(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] px-4">
      <div
        className={`w-full max-w-3xl rounded-2xl p-8 shadow-xl ${
          darkMode
            ? "bg-gray-800 border border-gray-600 text-white"
            : "bg-white border border-gray-200 text-black"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Add Employee</h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter employee details to create a new team member
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(false)}
            className="text-gray-500 hover:text-red-500 text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter employee name"
                className={`w-full px-4 py-3 rounded-xl border outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    : "bg-gray-50 border-gray-200 text-black placeholder:text-gray-400"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className={`w-full px-4 py-3 rounded-xl border outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    : "bg-gray-50 border-gray-200 text-black placeholder:text-gray-400"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={`w-full px-4 py-3 rounded-xl border outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    : "bg-gray-50 border-gray-200 text-black placeholder:text-gray-400"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border outline-none cursor-pointer ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200 text-black"
                }`}
              >
                {userRole === "Admin" && (
                  <>
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                  </>
                )}

                {userRole === "Manager" && (
                  <option value="Employee">Employee</option>
                )}
              </select>

              {errors.role && (
                <p className="text-red-500 text-xs mt-1">{errors.role}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border outline-none cursor-pointer ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200 text-black"
                }`}
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Joined Date
              </label>
              <input
                type="date"
                name="joinedDate"
                value={formData.joinedDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-200 text-black"
                }`}
              />
              {errors.joinedDate && (
                <p className="text-red-500 text-xs mt-1">{errors.joinedDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Default Password
              </label>
              <input
                type="text"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Default password"
                className={`w-full px-4 py-3 rounded-xl border outline-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    : "bg-gray-50 border-gray-200 text-black placeholder:text-gray-400"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Profile Image
              </label>
              <input
                type="file"
                accept=".png, .jpg, .jpeg"
                onChange={handleImageChange}
                className={`w-full px-4 py-3 rounded-xl border outline-none cursor-pointer file:mr-4 file:rounded-lg file:border-0 file:px-3 file:py-2 file:text-sm ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white"
                    : "bg-gray-50 border-gray-200 text-black file:bg-gray-200 file:text-black"
                }`}
              />
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className={`px-5 py-2.5 rounded-xl cursor-pointer ${
                darkMode
                  ? "bg-gray-600 text-white hover:bg-gray-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-white bg-[#0f766e] hover:opacity-90 cursor-pointer"
            >
              Save Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
