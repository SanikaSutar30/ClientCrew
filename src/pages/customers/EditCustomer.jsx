import { useState } from "react";
import { X } from "lucide-react";

export default function EditCustomer({
  darkMode,
  customer,
  setShowEditModal,
  onUpdateCustomer,
}) {
  const [formData, setFormData] = useState({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    status: customer.status,
    joinedDate: customer.joinedDate,
    image: customer.image,
  });

  const [errors, setErrors] = useState({});

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle new image selection
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

  // Submit updated customer data
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateCustomer(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      {/* Modal container */}
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-xl p-6 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Edit Customer</h2>
          <button
            onClick={() => setShowEditModal(false)}
            className="p-2 rounded-lg text-gray-500 hover:text-red-500 text-xl cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Edit form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Name field */}
          <div>
            <label className="text-sm font-medium">Name</label>
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
          </div>

          {/* Email field */}
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
          </div>

          {/* Phone field */}
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
          </div>

          {/* Status field */}
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
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Joined date field */}
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
          </div>

          {/* Profile image field */}
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

          {/* Preview selected image */}
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

          {/* Action buttons */}
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
              Update Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
