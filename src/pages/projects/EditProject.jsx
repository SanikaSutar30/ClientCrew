import { useState } from "react";
import { X } from "lucide-react";

export default function EditProject({
  darkMode,
  project,
  setShowEdit,
  onUpdateProject,
}) {
  const [formData, setFormData] = useState({
    id: project.id,
    projectName: project.projectName,
    clientName: project.clientName,
    startDate: project.startDate,
    dueDate: project.dueDate,
    status: project.status,
    progress: project.progress,
    icon: project.icon,
    iconColor: project.iconColor,
    team: project.team || [],
    extraMembers: project.extraMembers || 0,
  });

  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle team images
  const _handleTeamChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      const imageUrls = files.map((file) => URL.createObjectURL(file));

      setFormData((prev) => ({
        ...prev,
        team: imageUrls,
      }));
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = "Project name is required";
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    if (
      formData.startDate &&
      formData.dueDate &&
      new Date(formData.dueDate) < new Date(formData.startDate)
    ) {
      newErrors.dueDate = "Due date cannot be before start date";
    }

    if (
      formData.progress < 0 ||
      formData.progress > 100 ||
      formData.progress === ""
    ) {
      newErrors.progress = "Progress must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit update
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onUpdateProject({
      ...formData,
      progress: Number(formData.progress),
      extraMembers: Number(formData.extraMembers),
      icon: formData.icon.toUpperCase(),
    });

    setShowEdit(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div
        className={`w-full max-w-3xl rounded-2xl shadow-xl p-6 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Edit Project</h2>
          <button
            onClick={() => setShowEdit(false)}
            className="p-2 text-gray-500 hover:text-red-500 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Project Name */}
          <div>
            <label className="text-sm font-medium">Project Name</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 rounded-xl border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />
            {errors.projectName && (
              <p className="text-red-500 text-xs mt-1">{errors.projectName}</p>
            )}
          </div>

          {/* Client Name */}
          <div>
            <label className="text-sm font-medium">Client Name</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 rounded-xl border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="text-sm font-medium">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 rounded-xl border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="text-sm font-medium">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 rounded-xl border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 rounded-xl border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            >
              <option>Planning</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>On Hold</option>
            </select>
          </div>

          {/* Progress */}
          <div>
            <label className="text-sm font-medium">Progress (%)</label>
            <input
              type="number"
              name="progress"
              value={formData.progress}
              onChange={handleChange}
              className={`w-full mt-1 px-4 py-2 rounded-xl border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            />
          </div>

          {/* Preview */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium block mb-2">
              Project Preview
            </label>

            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl ${formData.iconColor} text-white flex items-center justify-center font-bold`}
              >
                {formData.icon}
              </div>

              <div>
                <p className="font-semibold">{formData.projectName}</p>
                <p className="text-sm text-gray-500">{formData.clientName}</p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setShowEdit(false)}
              className="px-4 py-2 rounded-xl border cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0f766e] text-white cursor-pointer"
            >
              Update Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
