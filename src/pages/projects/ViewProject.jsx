import {
  X,
  CalendarDays,
  BadgeCheck,
  FolderKanban,
  User,
  Percent,
  Users,
} from "lucide-react";
import { createPortal } from "react-dom";

export default function ViewProject({ darkMode, project, setShowView }) {
  if (!project) return null;

  const getStatusClasses = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-green-100 text-green-700";
      case "Completed":
        return "bg-slate-200 text-slate-700";
      case "On Hold":
        return "bg-orange-100 text-orange-700";
      case "Planning":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getProgressBarColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-600";
      case "In Progress":
        return "bg-emerald-600";
      case "On Hold":
        return "bg-orange-500";
      case "Planning":
        return "bg-sky-500";
      default:
        return "bg-gray-400";
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowView(false);
      }}
    >
      <div
        className={`w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-xl p-4 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">Project Details</h2>
          <button
            onClick={() => setShowView(false)}
            className="p-2 rounded-lg text-gray-500 hover:text-red-500 text-xl cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main card */}
        <div
          className={`rounded-2xl p-4 border ${
            darkMode
              ? "bg-gray-700 border-gray-600"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left side */}
            <div className="lg:w-1/3 flex flex-col items-center lg:items-start">
              <div
                className={`w-24 h-24 rounded-2xl ${project.iconColor} text-white flex items-center justify-center text-3xl font-bold shadow-md`}
              >
                {project.icon}
              </div>

              <div className="mt-4 text-center lg:text-left">
                <h3 className="text-2xl font-bold">{project.projectName}</h3>
                <p className="text-sm text-gray-500">
                  Project ID: {project.id}
                </p>
              </div>

              <div className="mt-4">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusClasses(
                    project.status,
                  )}`}
                >
                  {project.status}
                </span>
              </div>
            </div>

            {/* Right side */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-xl ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FolderKanban size={16} className="text-blue-500" />
                    <span className="text-sm font-medium">Project Name</span>
                  </div>
                  <p className="text-sm">{project.projectName}</p>
                </div>

                <div
                  className={`p-4 rounded-xl ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <User size={16} className="text-green-500" />
                    <span className="text-sm font-medium">Client Name</span>
                  </div>
                  <p className="text-sm">{project.clientName}</p>
                </div>

                <div
                  className={`p-4 rounded-xl ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays size={16} className="text-purple-500" />
                    <span className="text-sm font-medium">Start Date</span>
                  </div>
                  <p className="text-sm">
                    {new Date(project.startDate).toLocaleDateString()}
                  </p>
                </div>

                <div
                  className={`p-4 rounded-xl ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays size={16} className="text-orange-500" />
                    <span className="text-sm font-medium">Due Date</span>
                  </div>
                  <p className="text-sm">
                    {new Date(project.dueDate).toLocaleDateString()}
                  </p>
                </div>

                <div
                  className={`p-4 rounded-xl ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <BadgeCheck size={16} className="text-cyan-500" />
                    <span className="text-sm font-medium">Status</span>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusClasses(
                      project.status,
                    )}`}
                  >
                    {project.status}
                  </span>
                </div>

                
                <div
                  className={`p-4 rounded-xl ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >

                  <div className="flex items-center gap-2 mb-1">
                    <Users size={16} className="text-pink-500" />
                    <span className="text-sm font-medium">
                      Assigned Members
                    </span>
                  </div>
                  <p className="text-sm">
                    {project.assignedEmployees?.length || 0}
                  </p>
                </div>
                
              </div>

              <div
                className={`p-4 rounded-xl ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Percent size={16} className="text-emerald-500" />
                  <span className="text-sm font-medium">Progress</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getProgressBarColor(
                        project.status,
                      )}`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold min-w-fit">
                    {project.progress}%
                  </span>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Users size={16} className="text-indigo-500" />
                  <span className="text-sm font-medium">Team Members</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {project.assignedEmployees?.map((member) => (
                    <div
                      key={member.id}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl ${
                        darkMode ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p
                          className={`text-xs ${
                            darkMode ? "text-gray-300" : "text-gray-500"
                          }`}
                        >
                          {member.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>{" "}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowView(false)}
                  className="px-4 py-2 rounded-xl bg-[#0f766e] text-white cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}