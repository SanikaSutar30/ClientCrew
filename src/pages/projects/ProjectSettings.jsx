import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronRight, FolderKanban } from "lucide-react";
import SettingsMessageModal from "../SettingsMessageModal.jsx";

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

export default function ProjectSettings() {
  const { darkMode } = useOutletContext();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const [projectPreferences, setProjectPreferences] = useState({
    defaultStatus: "Planning",
    defaultPriority: "Medium",
    autoAssignTasks: false,
    allowClientAccess: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    deadlineAlerts: true,
    projectUpdates: true,
    taskAssignments: true,
  });

  const [visibilitySettings, setVisibilitySettings] = useState({
    showProgressToClients: true,
    allowTeamComments: true,
    enableProjectReports: true,
  });

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    message: "",
    type: "success",
  });

  const showModal = (title, message, type = "success") => {
    setModalData({ title, message, type });
    setShowMessageModal(true);
  };

  const cardClass = darkMode
    ? "bg-gray-700 border border-gray-600 shadow-sm rounded-2xl"
    : "bg-white border border-gray-200 shadow-sm rounded-2xl";

  const headingClass = darkMode ? "text-white" : "text-black";
  const subTextClass = darkMode ? "text-gray-300" : "text-gray-500";
  const dividerClass = darkMode ? "border-gray-600" : "border-gray-200";

  const selectClass = darkMode
    ? "w-full px-4 py-3 rounded-xl border bg-gray-600 border-gray-500 text-white outline-none cursor-pointer"
    : "w-full px-4 py-3 rounded-xl border bg-gray-50 border-gray-200 text-gray-700 outline-none cursor-pointer";

  const handleProjectPreferenceChange = (e) => {
    const { name, value } = e.target;
    setProjectPreferences((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProjectToggle = (field) => {
    setProjectPreferences((prev) => ({
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

  const handleVisibilityToggle = (field) => {
    setVisibilitySettings((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };
const handleSaveProjectSettings = () => {
  setIsSaving(true);

  setTimeout(() => {
    setIsSaving(false);
    showModal(
      "Project Settings Saved",
      "Your project settings have been updated successfully.",
      "success",
    );
  }, 1200);
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

      {/* Header */}
      <div className="space-y-2">
        {/* Title */}
        <div>
          <h1 className={`text-2xl font-bold ${headingClass}`}>
            Project Settings
          </h1>
          <p className={`text-sm mt-1 ${subTextClass}`}>
            Manage project preferences, task defaults, notifications, and access
            controls
          </p>
        </div>

        {/* Breadcrumb */}
        <div
          className={`flex w-fit items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            darkMode
              ? "bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600"
              : "bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200"
          }`}
        >
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className={`inline-flex items-center gap-2 cursor-pointer transition hover:underline ${
              darkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <FolderKanban size={14} />
            <span>Projects</span>
          </button>

          <ChevronRight size={14} />

          <span
            className={
              darkMode ? "text-white font-semibold" : "text-black font-semibold"
            }
          >
            Project Settings
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left side */}
        <div className="xl:col-span-2 space-y-6">
          {/* Project Preferences */}
          <div className={cardClass}>
            <div className={`px-6 py-4 border-b ${dividerClass}`}>
              <h2 className={`text-xl font-semibold ${headingClass}`}>
                Project Preferences
              </h2>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Default Project Status
                </label>
                <select
                  name="defaultStatus"
                  value={projectPreferences.defaultStatus}
                  onChange={handleProjectPreferenceChange}
                  className={selectClass}
                >
                  <option>Planning</option>
                  <option>In Progress</option>
                  <option>On Hold</option>
                  <option>Completed</option>
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Default Task Priority
                </label>
                <select
                  name="defaultPriority"
                  value={projectPreferences.defaultPriority}
                  onChange={handleProjectPreferenceChange}
                  className={selectClass}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div
                className={`flex items-center justify-between py-4 border-t ${dividerClass}`}
              >
                <div>
                  <h3
                    className={`text-base font-medium ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Auto Assign Tasks
                  </h3>
                  <p className={`text-sm mt-1 ${subTextClass}`}>
                    Automatically assign newly created tasks to default team
                    members
                  </p>
                </div>
                <ToggleSwitch
                  checked={projectPreferences.autoAssignTasks}
                  onClick={() => handleProjectToggle("autoAssignTasks")}
                  darkMode={darkMode}
                />
              </div>

              <div
                className={`flex items-center justify-between py-4 border-t ${dividerClass}`}
              >
                <div>
                  <h3
                    className={`text-base font-medium ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Allow Client Access
                  </h3>
                  <p className={`text-sm mt-1 ${subTextClass}`}>
                    Allow clients to view project progress and updates
                  </p>
                </div>
                <ToggleSwitch
                  checked={projectPreferences.allowClientAccess}
                  onClick={() => handleProjectToggle("allowClientAccess")}
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
                  Deadline Alerts
                </span>
                <ToggleSwitch
                  checked={notificationSettings.deadlineAlerts}
                  onClick={() => handleNotificationToggle("deadlineAlerts")}
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
                  Project Updates
                </span>
                <ToggleSwitch
                  checked={notificationSettings.projectUpdates}
                  onClick={() => handleNotificationToggle("projectUpdates")}
                  darkMode={darkMode}
                />
              </div>

              <div className="flex items-center justify-between py-4">
                <span
                  className={`text-base font-medium ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Task Assignment Alerts
                </span>
                <ToggleSwitch
                  checked={notificationSettings.taskAssignments}
                  onClick={() => handleNotificationToggle("taskAssignments")}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="xl:col-span-1 space-y-6">
          {/* Visibility & Access */}
          <div className={cardClass}>
            <div className={`px-6 py-4 border-b ${dividerClass}`}>
              <h2 className={`text-xl font-semibold ${headingClass}`}>
                Visibility & Access
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
                  Show Progress to Clients
                </span>
                <ToggleSwitch
                  checked={visibilitySettings.showProgressToClients}
                  onClick={() =>
                    handleVisibilityToggle("showProgressToClients")
                  }
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
                  Allow Team Comments
                </span>
                <ToggleSwitch
                  checked={visibilitySettings.allowTeamComments}
                  onClick={() => handleVisibilityToggle("allowTeamComments")}
                  darkMode={darkMode}
                />
              </div>

              <div className="flex items-center justify-between py-4">
                <span
                  className={`text-base font-medium ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Enable Project Reports
                </span>
                <ToggleSwitch
                  checked={visibilitySettings.enableProjectReports}
                  onClick={() => handleVisibilityToggle("enableProjectReports")}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>

          {/* Save Card */}
          <div className={cardClass}>
            <div className={`px-6 py-4 border-b ${dividerClass}`}>
              <h2 className={`text-xl font-semibold ${headingClass}`}>
                Save Changes
              </h2>
            </div>

            <div className="p-6">
              <p className={`text-sm mb-5 ${subTextClass}`}>
                Save all project-related settings and preferences for your
                workspace.
              </p>

              <button
                type="button"
                onClick={handleSaveProjectSettings}
                disabled={isSaving}
                className={`w-full py-3 rounded-xl text-white text-base font-medium transition ${
                  isSaving
                    ? "bg-[#0f766e]/70 cursor-not-allowed"
                    : "bg-[#0f766e] hover:opacity-90 cursor-pointer"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  {isSaving && (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  )}
                  {isSaving ? "Saving..." : "Save Project Settings"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
