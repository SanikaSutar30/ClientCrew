import { useOutletContext } from "react-router-dom";

export default function Settings() {
  const { darkMode } = useOutletContext();

  const cardClass = darkMode
    ? "bg-gray-700 border border-gray-600 shadow-sm rounded-2xl"
    : "bg-white border border-gray-200 shadow-sm rounded-2xl";

  const headingClass = darkMode ? "text-white" : "text-black";
  const subTextClass = darkMode ? "text-gray-300" : "text-gray-500";
  const dividerClass = darkMode ? "border-gray-600" : "border-gray-200";

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
            <div className="p-6 min-h-[220px]"></div>
          </div>

          {/* Password Visibility / Security Block */}
          <div className={cardClass}>
            <div className={`px-6 py-4 border-b ${dividerClass}`}>
              <h2 className={`text-xl font-semibold ${headingClass}`}>
                Security Preferences
              </h2>
            </div>
            <div className="p-6 min-h-[180px]"></div>
          </div>

          {/* Notification Settings */}
          <div className={cardClass}>
            <div className={`px-6 py-4 border-b ${dividerClass}`}>
              <h2 className={`text-xl font-semibold ${headingClass}`}>
                Notification Settings
              </h2>
            </div>
            <div className="p-6 min-h-[150px]"></div>
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
            <div className="p-6 min-h-[320px]"></div>
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
