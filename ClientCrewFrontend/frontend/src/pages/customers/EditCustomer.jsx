import { useState } from "react";
import { X } from "lucide-react";

export default function EditCustomer({
  darkMode,
  customer,
  setShowEditModal,
  onUpdateCustomer,
}) {
  const [formData, setFormData] = useState({
    userId: customer.userId,
    userFullName: customer.userFullName || "",
    userEmail: customer.userEmail || "",
    userPhone: customer.userPhone || "",
    status: customer.status || "Active",
    joinedDate: customer.joinedDate || "",
    userImage: customer.userImage || "",
  });

  const [errors, setErrors] = useState({});

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
        image: "Only PNG, JPG and JPEG images are allowed",
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
        image: "",
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

    if (!formData.userImage) {
      newErrors.image = "Profile image is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onUpdateCustomer(formData);
  };

  const inputClass = `w-full mt-1 px-4 py-2 rounded-xl border outline-none ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-white border-gray-300 text-black"
  }`;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-xl p-6 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Edit Customer</h2>
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="p-2 rounded-lg text-gray-500 hover:text-red-500 text-xl cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              name="userFullName"
              value={formData.userFullName || ""}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.userFullName && (
              <p className="text-red-500 text-xs mt-1">{errors.userFullName}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="userEmail"
              value={formData.userEmail || ""}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.userEmail && (
              <p className="text-red-500 text-xs mt-1">{errors.userEmail}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Phone</label>
            <input
              type="text"
              name="userPhone"
              value={formData.userPhone || ""}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.userPhone && (
              <p className="text-red-500 text-xs mt-1">{errors.userPhone}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status || "Active"}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Joined Date</label>
            <input
              type="date"
              name="joinedDate"
              value={formData.joinedDate || ""}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.joinedDate && (
              <p className="text-red-500 text-xs mt-1">{errors.joinedDate}</p>
            )}
          </div>

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

          <div className="md:col-span-2">
            <label className="text-sm font-medium block mb-2">
              Current Preview
            </label>
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
              {formData.userImage ? (
                <img
                  src={formData.userImage}
                  alt={formData.userFullName || "Customer"}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <span className="text-xl font-semibold text-gray-700">
                  {formData.userFullName?.charAt(0).toUpperCase() || "C"}
                </span>
              )}
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className={`px-4 py-2 rounded-xl border cursor-pointer ${
                darkMode
                  ? "border-gray-600 text-white hover:bg-gray-700"
                  : "border-gray-300 text-black hover:bg-gray-100"
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0f766e] text-white cursor-pointer hover:opacity-90"
            >
              Update Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
