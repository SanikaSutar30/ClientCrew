import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Camera, Upload } from "lucide-react";

// ToggleSwitch component defined outside the main component
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
  const { darkMode } = useOutletContext();

  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john@example.com",
    profileImage: "../assets/Profile.jpg",
  });

  // Separate state for password fields
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State for toggling password visibility
  const [securitySettings, setSecuritySettings] = useState({
    showCurrentPassword: true,
    showNewPassword: true,
    showConfirmPassword: true,
  });

  // State for notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newCustomerAlerts: true,
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

  // Handlers for form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for password field changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handlers for toggling password visibility and notification settings
  const handleSecurityToggle = (field) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handler for toggling notification settings
  const handleNotificationToggle = (field) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="space-y-6">
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
                {/* Left image section */}
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
                      className={`absolute bottom-2 right-1 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                        darkMode
                          ? "bg-gray-600 text-white"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      <Camera size={18} />
                    </button>
                  </div>

                  <button
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

                {/* Right form section */}
                <div className="space-y-5">
                  {/* // Form fields for name and email  */}
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

                  <button className="w-full py-3 rounded-xl bg-[#0f766e] text-white text-base font-medium hover:opacity-90 transition cursor-pointer">
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
                  type="password"
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
                  type="password"
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
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="********"
                  className={inputClass}
                />
              </div>

              <button className="w-full py-3 rounded-xl bg-[#0f766e] text-white text-base font-medium hover:opacity-90 transition cursor-pointer">
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
            <div className="p-6 min-h-[250px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
