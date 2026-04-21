import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronRight, FolderKanban } from "lucide-react";
import SettingsMessageModal from "../SettingsMessageModal.jsx";

const ToggleSwitch = ({ checked, onClick, darkMode, disabled = false }) => (
  <button
    type="button"
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={`w-14 h-8 flex items-center rounded-full p-1 transition ${
      disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
    } ${checked ? "bg-[#0f766e]" : darkMode ? "bg-gray-500" : "bg-gray-300"}`}
  >
    <span
      className={`w-6 h-6 bg-white rounded-full shadow-md transform transition ${
        checked ? "translate-x-6" : "translate-x-0"
      }`}
    ></span>
  </button>
);
export default function ProjectSettings() {
  const { darkMode, userRole } = useOutletContext();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
const canViewProjectSettings = ["Admin", "Manager", "Employee"].includes(
  userRole,
);
const canEditProjectSettings = ["Admin", "Manager"].includes(userRole);
const isReadOnlyRole = userRole === "Employee";

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
   ? `w-full px-4 py-3 rounded-xl border bg-gray-600 border-gray-500 text-white outline-none ${
       !canEditProjectSettings
         ? "opacity-60 cursor-not-allowed"
         : "cursor-pointer"
     }`
   : `w-full px-4 py-3 rounded-xl border bg-gray-50 border-gray-200 text-gray-700 outline-none ${
       !canEditProjectSettings
         ? "opacity-60 cursor-not-allowed"
         : "cursor-pointer"
     }`;

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
  if (!canEditProjectSettings) {
    showModal(
      "Read Only Access",
      "You can view project settings, but only Admin and Manager can update them.",
      "error",
    );
    return;
  }

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

  if (!canViewProjectSettings) {
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

        <div className="space-y-2">
          <div>
            <h1 className={`text-2xl font-bold ${headingClass}`}>
              Project Settings
            </h1>
            <p className={`text-sm mt-1 ${subTextClass}`}>
              Manage project preferences, task defaults, notifications, and
              access controls
            </p>
          </div>

          <div
            className={`flex w-fit items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
              darkMode
                ? "bg-gray-700 text-gray-300 border border-gray-600"
                : "bg-gray-100 text-gray-600 border border-gray-200"
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
                darkMode
                  ? "text-white font-semibold"
                  : "text-black font-semibold"
              }
            >
              Project Settings
            </span>
          </div>
        </div>

        <div className={cardClass}>
          <div className="p-8 text-center">
            <h2 className={`text-xl font-semibold mb-2 ${headingClass}`}>
              Access Restricted
            </h2>
            <p className={`text-sm ${subTextClass}`}>
              Only Admin and Manager can access Project Settings.
            </p>

            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="mt-5 px-5 py-2.5 rounded-xl bg-[#0f766e] text-white hover:opacity-90 cursor-pointer"
            >
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                  disabled={!canEditProjectSettings}
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
                  disabled={!canEditProjectSettings}
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
                  disabled={!canEditProjectSettings}
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
                  disabled={!canEditProjectSettings}
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
                  disabled={!canEditProjectSettings}
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
                  disabled={!canEditProjectSettings}
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
                  disabled={!canEditProjectSettings}
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
                  disabled={!canEditProjectSettings}
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
                  disabled={!canEditProjectSettings}
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
                  disabled={!canEditProjectSettings}
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
              {isReadOnlyRole && (
                <div
                  className={`mb-4 px-4 py-3 rounded-xl text-sm ${
                    darkMode
                      ? "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20"
                      : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                  }`}
                >
                  You have view-only access. Only Admin and Manager can change
                  project settings.
                </div>
              )}

              <p className={`text-sm mb-5 ${subTextClass}`}>
                Save all project-related settings and preferences for your
                workspace.
              </p>

              <button
                type="button"
                onClick={handleSaveProjectSettings}
                disabled={!canEditProjectSettings || isSaving}
                className={`w-full py-3 rounded-xl text-white text-base font-medium transition ${
                  !canEditProjectSettings
                    ? "bg-gray-400 cursor-not-allowed"
                    : isSaving
                      ? "bg-[#0f766e]/70 cursor-not-allowed"
                      : "bg-[#0f766e] hover:opacity-90 cursor-pointer"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  {isSaving && canEditProjectSettings && (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  )}
                  {!canEditProjectSettings
                    ? "View Only Access"
                    : isSaving
                      ? "Saving..."
                      : "Save Project Settings"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
