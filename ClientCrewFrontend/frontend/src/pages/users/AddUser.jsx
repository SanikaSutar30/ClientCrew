import { useState } from "react";

export default function AddUser({ darkMode, setShowAddModal, onAddUser }) {
  const [formData, setFormData] = useState({
    userFullName: "",
    userEmail: "",
    userPhone: "",
    userRole: "EMPLOYEE",
    status: "Active",
    joinedDate: "",
    userImage: "",
  });

  const [errors, setErrors] = useState({});

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
      : "bg-gray-50 border-gray-200 text-black placeholder:text-gray-400"
  }`;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        userImage: "Only PNG, JPG and JPEG images are allowed",
      }));
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        userImage: reader.result,
      }));

      setErrors((prev) => ({
        ...prev,
        userImage: "",
      }));
    };

    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userFullName.trim()) {
      newErrors.userFullName = "Name is required";
    }

    if (!formData.userEmail.trim()) {
      newErrors.userEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.userEmail)) {
      newErrors.userEmail = "Invalid email format";
    }

    if (!formData.userPhone.trim()) {
      newErrors.userPhone = "Phone number is required";
    }

    if (!formData.joinedDate) {
      newErrors.joinedDate = "Joined date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onAddUser(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] px-4">
      <div
        className={`w-full max-w-4xl rounded-2xl p-8 shadow-xl ${
          darkMode
            ? "bg-gray-800 border border-gray-600 text-white"
            : "bg-white border border-gray-200 text-black"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Add User</h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter user details to create a new record
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
                name="userFullName"
                value={formData.userFullName}
                onChange={handleChange}
                placeholder="Enter full name"
                className={inputClass}
              />
              {errors.userFullName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.userFullName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
                placeholder="Enter email address"
                className={inputClass}
              />
              {errors.userEmail && (
                <p className="text-red-500 text-xs mt-1">{errors.userEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="userPhone"
                value={formData.userPhone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={inputClass}
              />
              {errors.userPhone && (
                <p className="text-red-500 text-xs mt-1">{errors.userPhone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                name="userRole"
                value={formData.userRole}
                onChange={handleChange}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="MANAGER">Manager</option>
                <option value="EMPLOYEE">Employee</option>
                <option value="CUSTOMER">Customer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
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
                className={inputClass}
              />
              {errors.joinedDate && (
                <p className="text-red-500 text-xs mt-1">{errors.joinedDate}</p>
              )}
            </div>

            <div className="md:col-span-2">
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
              {errors.userImage && (
                <p className="text-red-500 text-xs mt-1">{errors.userImage}</p>
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
              Save User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
