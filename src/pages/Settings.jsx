import { useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Camera, Upload } from "lucide-react";
import SettingsMessageModal from "./SettingsMessageModal.jsx";

const ToggleSwitch = ({ checked, onClick, darkMode }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-14 h-8 flex items-center rounded-full p-1 transition cursor-pointer ${
      checked ? "bg-[#0f766e]" : darkMode ? "bg-gray-500" : "bg-gray-300"
    }`}
  >
    <span
      className={`w-6 h-6 bg-white rounded-full shadow-md transform transition ${
        checked ? "translate-x-6" : "translate-x-0"
      }`}
    ></span>
  </button>
);

export default function Settings() {
  const { darkMode, setDarkMode } = useOutletContext();
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john@example.com",
    profileImage: "../assets/Profile.jpg",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [securitySettings, setSecuritySettings] = useState({
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newCustomerAlerts: true,
  });

  const [systemPreferences, setSystemPreferences] = useState({
    theme: darkMode ? "dark" : "light",
    language: "English",
    timezone: "Asia/Kolkata",
  });

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    message: "",
    type: "success",
  });

  const cardClass = darkMode
    ? "bg-gray-700 border border-gray-600 shadow-sm rounded-2xl"
    : "bg-white border border-gray-200 shadow-sm rounded-2xl";

  const headingClass = darkMode ? "text-white" : "text-black";
  const subTextClass = darkMode ? "text-gray-300" : "text-gray-500";
  const dividerClass = darkMode ? "border-gray-600" : "border-gray-200";
  const inputClass = darkMode
    ? "w-full px-4 py-3 rounded-xl border bg-gray-600 border-gray-500 text-white outline-none"
    : "w-full px-4 py-3 rounded-xl border bg-gray-50 border-gray-200 text-gray-700 outline-none";

  const selectClass = darkMode
    ? "w-full px-4 py-3 rounded-xl border bg-gray-600 border-gray-500 text-white outline-none cursor-pointer"
    : "w-full px-4 py-3 rounded-xl border bg-gray-50 border-gray-200 text-gray-700 outline-none cursor-pointer";

  const showModal = (title, message, type = "success") => {
    setModalData({ title, message, type });
    setShowMessageModal(true);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSecurityToggle = (field) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleNotificationToggle = (field) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSystemPreferenceChange = (e) => {
    const { name, value } = e.target;
    setSystemPreferences((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileUpdate = () => {
    if (!profileData.name.trim()) {
      showModal("Profile Update Failed", "Name cannot be empty.", "error");
      return;
    }

    if (!profileData.email.trim()) {
      showModal("Profile Update Failed", "Email cannot be empty.", "error");
      return;
    }

    if (!profileData.email.includes("@")) {
      showModal(
        "Profile Update Failed",
        "Please enter a valid email.",
        "error",
      );
      return;
    }

    showModal("Profile Updated", "Your profile has been updated successfully.");
  };

  const handlePasswordUpdate = () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      showModal(
        "Password Update Failed",
        "Please fill all password fields.",
        "error",
      );
      return;
    }

    if (newPassword.length < 6) {
      showModal(
        "Password Update Failed",
        "New password must be at least 6 characters long.",
        "error",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      showModal(
        "Password Update Failed",
        "New password and confirm password do not match.",
        "error",
      );
      return;
    }

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    showModal(
      "Password Updated",
      "Your password has been changed successfully.",
    );
  };

  const handleSavePreferences = () => {
    if (setDarkMode) {
      setDarkMode(systemPreferences.theme === "dark");
    }

    showModal(
      "Preferences Saved",
      "Your system preferences have been saved successfully.",
    );
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setProfileData((prev) => ({
      ...prev,
      profileImage: imageUrl,
    }));

    showModal("Image Uploaded", "Profile image updated successfully.");
  };

  return (
    <div className="space-y-6">
      {showMessageModal && (
        <SettingsMessageModal
          darkMode={darkMode}
          title={modalData.title}
          message={modalData.message}
          type={modalData.type}
          onClose={() => setShowMessageModal(false)}
        />
      )}

      {/* Page header */}
      <div>
        <h1 className={`text-2xl font-bold ${headingClass}`}>Settings</h1>
        <p className={`text-sm mt-1 ${subTextClass}`}>
          Manage your profile, password, notifications, and system preferences
        </p>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className={cardClass}>
            <div className={`px-6 py-4 border-b ${dividerClass}`}>
              <h2 className={`text-xl font-semibold ${headingClass}`}>
                Profile Settings
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8 items-start">
                <div className="flex flex-col items-center md:items-start">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-300">
                      <img
                        src={profileData.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleUploadClick}
                      className={`absolute bottom-2 right-1 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                        darkMode
                          ? "bg-gray-600 text-white"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      <Camera size={18} />
                    </button>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className={`mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium shadow-sm ${
                      darkMode
                        ? "bg-gray-600 text-white hover:bg-gray-500"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    } transition cursor-pointer`}
                  >
                    <Upload size={16} />
                    Upload New
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className={inputClass}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleProfileUpdate}
                    className="w-full py-3 rounded-xl bg-[#0f766e] text-white text-base font-medium hover:opacity-90 transition cursor-pointer"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Security Preferences */}
          <div className={cardClass}>
            <div className={`px-6 py-4 border-b ${dividerClass}`}>
              <h2 className={`text-xl font-semibold ${headingClass}`}>
                Security Preferences
              </h2>
            </div>

            <div className="px-6 py-2">
              <div
                className={`flex items-center justify-between py-4 border-b ${dividerClass}`}
              >
                <span
                  className={`text-base font-medium ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Show Current Password
                </span>
                <ToggleSwitch
                  checked={securitySettings.showCurrentPassword}
                  onClick={() => handleSecurityToggle("showCurrentPassword")}
                  darkMode={darkMode}
                />
              </div>

              <div
                className={`flex items-center justify-between py-4 border-b ${dividerClass}`}
              >
                <span
                  className={`text-base font-medium ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Show New Password
                </span>
                <ToggleSwitch
                  checked={securitySettings.showNewPassword}
                  onClick={() => handleSecurityToggle("showNewPassword")}
                  darkMode={darkMode}
                />
              </div>

              <div className="flex items-center justify-between py-4">
                <span
                  className={`text-base font-medium ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Show Confirm Password
                </span>
                <ToggleSwitch
                  checked={securitySettings.showConfirmPassword}
                  onClick={() => handleSecurityToggle("showConfirmPassword")}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className={cardClass}>
            <div className={`px-6 py-4 border-b ${dividerClass}`}>
              <h2 className={`text-xl font-semibold ${headingClass}`}>
                Notification Settings
              </h2>
            </div>

            <div className="px-6 py-2">
              <div
                className={`flex items-center justify-between py-4 border-b ${dividerClass}`}
              >
                <span
                  className={`text-base font-medium ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Email Notifications
                </span>
                <ToggleSwitch
                  checked={notificationSettings.emailNotifications}
                  onClick={() => handleNotificationToggle("emailNotifications")}
                  darkMode={darkMode}
                />
              </div>

              <div className="flex items-center justify-between py-4">
                <span
                  className={`text-base font-medium ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  New Customer Alerts
                </span>
                <ToggleSwitch
                  checked={notificationSettings.newCustomerAlerts}
                  onClick={() => handleNotificationToggle("newCustomerAlerts")}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="xl:col-span-1 space-y-6">
          {/* Change Password */}
          <div className={cardClass}>
            <div className={`px-6 py-4 border-b ${dividerClass}`}>
              <h2 className={`text-xl font-semibold ${headingClass}`}>
                Change Password
              </h2>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Current Password
                </label>
                <input
                  type={
                    securitySettings.showCurrentPassword ? "text" : "password"
                  }
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="********"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  New Password
                </label>
                <input
                  type={securitySettings.showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="********"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Confirm New Password
                </label>
                <input
                  type={
                    securitySettings.showConfirmPassword ? "text" : "password"
                  }
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="********"
                  className={inputClass}
                />
              </div>

              <button
                type="button"
                onClick={handlePasswordUpdate}
                className="w-full py-3 rounded-xl bg-[#0f766e] text-white text-base font-medium hover:opacity-90 transition cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </div>

          {/* System Preferences */}
          <div className={cardClass}>
            <div className={`px-6 py-4 border-b ${dividerClass}`}>
              <h2 className={`text-xl font-semibold ${headingClass}`}>
                System Preferences
              </h2>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Theme
                </label>

                <div
                  className={`grid grid-cols-2 gap-3 p-1 rounded-xl ${
                    darkMode ? "bg-gray-600" : "bg-gray-100"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setSystemPreferences((prev) => ({
                        ...prev,
                        theme: "light",
                      }))
                    }
                    className={`py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                      systemPreferences.theme === "light"
                        ? darkMode
                          ? "bg-gray-500 text-white"
                          : "bg-white text-gray-800 shadow-sm"
                        : darkMode
                          ? "text-gray-300"
                          : "text-gray-500"
                    }`}
                  >
                    Light
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSystemPreferences((prev) => ({
                        ...prev,
                        theme: "dark",
                      }))
                    }
                    className={`py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                      systemPreferences.theme === "dark"
                        ? darkMode
                          ? "bg-gray-500 text-white"
                          : "bg-white text-gray-800 shadow-sm"
                        : darkMode
                          ? "text-gray-300"
                          : "text-gray-500"
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Language
                </label>
                <select
                  name="language"
                  value={systemPreferences.language}
                  onChange={handleSystemPreferenceChange}
                  className={selectClass}
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Marathi</option>
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Timezone
                </label>
                <select
                  name="timezone"
                  value={systemPreferences.timezone}
                  onChange={handleSystemPreferenceChange}
                  className={selectClass}
                >
                  <option>Asia/Kolkata</option>
                  <option>UTC</option>
                  <option>America/New_York</option>
                  <option>Europe/London</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleSavePreferences}
                className="w-full py-3 rounded-xl bg-[#0f766e] text-white text-base font-medium hover:opacity-90 transition cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
