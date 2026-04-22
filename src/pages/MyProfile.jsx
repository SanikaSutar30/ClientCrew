import { useState } from "react";
import {
  Mail,
  Phone,
  CalendarDays,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import SettingsMessageModal from "./SettingsMessageModal";

export default function MyProfile() {
  const { darkMode, userRole } = useOutletContext();

  const savedUser = JSON.parse(localStorage.getItem("user")) || {};

  const roleLabelMap = {
    Admin: "Administrator",
    Manager: "Manager",
    Employee: "Employee",
    Customer: "Customer",
  };

  const profileIdMap = {
    Admin: "ADM-001",
    Manager: "MNG-001",
    Employee: "EMP-001",
    Customer: "CUS-001",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [profileData, setProfileData] = useState({
    id: profileIdMap[userRole] || "USR-001",
    name:
      savedUser.fullName || savedUser.email?.split("@")[0] || "ClientCrew User",
    email: savedUser.email || "user@clientcrew.com",
    phone: savedUser.phone || "+91 9876543210",
    role: roleLabelMap[userRole] || userRole || "User",
    status: savedUser.status || "Active",
    joinedDate: savedUser.joinedDate || "2024-01-10",
    image: savedUser.image || "../assets/Profile.jpg",
  });

  const [editData, setEditData] = useState(profileData);
  const [errors, setErrors] = useState({});

  const getStatusClasses = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-600";
      case "Pending":
        return "bg-orange-100 text-orange-600";
      case "Inactive":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const inputClass = darkMode
    ? "w-full mt-1 px-4 py-2 rounded-xl border outline-none bg-gray-700 border-gray-600 text-white"
    : "w-full mt-1 px-4 py-2 rounded-xl border outline-none bg-white border-gray-300 text-black";

  const handleEditStart = () => {
    setEditData(profileData);
    setErrors({});
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

      setEditData((prev) => ({
        ...prev,
        image: imageUrl,
      }));

      setErrors((prev) => ({
        ...prev,
        image: "",
      }));
    }
  };

  const handleUpdateProfile = () => {
    if (!editData.name.trim()) {
      setErrors((prev) => ({
        ...prev,
        name: "Name is required",
      }));
      return;
    }

    if (!editData.email.trim()) {
      setErrors((prev) => ({
        ...prev,
        email: "Email is required",
      }));
      return;
    }

    if (!editData.email.includes("@")) {
      setErrors((prev) => ({
        ...prev,
        email: "Enter a valid email address",
      }));
      return;
    }

    setProfileData(editData);

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...savedUser,
        fullName: editData.name,
        email: editData.email,
        phone: editData.phone,
        role: userRole,
        status: editData.status,
        joinedDate: editData.joinedDate,
        image: editData.image,
      }),
    );

    setErrors({});
    setIsEditing(false);
    setShowSuccessModal(true);
  };

  const handleCancelEdit = () => {
    setEditData(profileData);
    setErrors({});
    setIsEditing(false);
  };

  return (
    <>
      {showSuccessModal && (
        <SettingsMessageModal
          darkMode={darkMode}
          title="Profile Updated"
          message="Your profile has been updated successfully."
          type="success"
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      <div className="space-y-6">
        <div>
          <h1
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            My Profile
          </h1>
          <p
            className={`text-sm mt-1 ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            View your profile details and account information
          </p>
        </div>

        <div
          className={`w-full max-w-4xl rounded-2xl shadow-xl p-6 ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <div
            className={`rounded-2xl p-6 border ${
              darkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-300 shrink-0 border border-gray-400">
                <img
                  src={isEditing ? editData.image : profileData.image}
                  alt={isEditing ? editData.name : profileData.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="flex-1 space-y-4 w-full">
                <div className="text-center md:text-left">
                  {isEditing ? (
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editData.name}
                        onChange={handleChange}
                        className={inputClass}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold">{profileData.name}</h3>
                      <p className="text-sm text-gray-500">
                        Profile ID: {profileData.id}
                      </p>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`p-4 rounded-xl ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Mail size={16} className="text-blue-500" />
                      <span className="text-sm font-medium">Email</span>
                    </div>

                    {isEditing ? (
                      <>
                        <input
                          type="email"
                          name="email"
                          value={editData.email}
                          onChange={handleChange}
                          className={inputClass}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.email}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm">{profileData.email}</p>
                    )}
                  </div>

                  <div
                    className={`p-4 rounded-xl ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Phone size={16} className="text-green-500" />
                      <span className="text-sm font-medium">Phone</span>
                    </div>

                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={editData.phone}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    ) : (
                      <p className="text-sm">{profileData.phone}</p>
                    )}
                  </div>

                  <div
                    className={`p-4 rounded-xl ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldCheck size={16} className="text-orange-500" />
                      <span className="text-sm font-medium">Role</span>
                    </div>

                    <p className="text-sm">{profileData.role}</p>
                  </div>

                  <div
                    className={`p-4 rounded-xl ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <BadgeCheck size={16} className="text-purple-500" />
                      <span className="text-sm font-medium">Status</span>
                    </div>

                    {isEditing ? (
                      <select
                        name="status"
                        value={editData.status}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    ) : (
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusClasses(
                          profileData.status,
                        )}`}
                      >
                        {profileData.status}
                      </span>
                    )}
                  </div>

                  <div
                    className={`p-4 rounded-xl ${
                      darkMode ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarDays size={16} className="text-pink-500" />
                      <span className="text-sm font-medium">Joined Date</span>
                    </div>

                    {isEditing ? (
                      <input
                        type="date"
                        name="joinedDate"
                        value={editData.joinedDate}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    ) : (
                      <p className="text-sm">
                        {new Date(profileData.joinedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {isEditing && (
                    <div
                      className={`p-4 rounded-xl ${
                        darkMode ? "bg-gray-800" : "bg-white"
                      }`}
                    >
                      <div className="mb-1">
                        <span className="text-sm font-medium">
                          Profile Image
                        </span>
                      </div>

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
                        <p className="text-red-500 text-xs mt-1">
                          {errors.image}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className={`px-4 py-2 rounded-xl border cursor-pointer ${
                          darkMode
                            ? "border-gray-600 text-white"
                            : "border-gray-300 text-black"
                        }`}
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleUpdateProfile}
                        className="px-4 py-2 rounded-xl bg-[#0f766e] text-white cursor-pointer hover:opacity-90"
                      >
                        Update Profile
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleEditStart}
                      className="px-4 py-2 rounded-xl bg-[#0f766e] text-white cursor-pointer hover:opacity-90"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
