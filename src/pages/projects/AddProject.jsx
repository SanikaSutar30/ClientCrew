import { useState, useEffect } from "react";
import {
  Folder,
  User,
  Calendar,
  Percent,
  Palette,
  Users,
  ImagePlus,
  Type,
} from "lucide-react";

export default function AddProject({ darkMode, setShowAdd, onAddProject }) {
  const [formData, setFormData] = useState({
    projectName: "",
    clientName: "",
    startDate: "",
    dueDate: "",
    status: "Planning",
    progress: "",
    team: [],
    extraMembers: 0,
    icon: "",
    iconColor: "bg-teal-500",
  });

  const [errors, setErrors] = useState({});

  // 🔥 Clean up image URLs (important)
  useEffect(() => {
    return () => {
      formData.team.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [formData.team]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTeamChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      const imageUrls = files.map((file) => URL.createObjectURL(file));

      setFormData((prev) => ({
        ...prev,
        team: imageUrls,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectName.trim())
      newErrors.projectName = "Project name is required";

    if (!formData.clientName.trim())
      newErrors.clientName = "Client name is required";

    if (!formData.startDate) newErrors.startDate = "Start date is required";

    if (!formData.dueDate) newErrors.dueDate = "Due date is required";

    if (
      formData.startDate &&
      formData.dueDate &&
      new Date(formData.dueDate) < new Date(formData.startDate)
    ) {
      newErrors.dueDate = "Due date cannot be before start date";
    }

    if (formData.progress === "") newErrors.progress = "Progress is required";
    else if (formData.progress < 0 || formData.progress > 100)
      newErrors.progress = "Progress must be between 0 and 100";

    if (!formData.icon.trim()) newErrors.icon = "Project icon is required";
    else if (formData.icon.length > 1) newErrors.icon = "Use only one letter";

    if (formData.team.length === 0)
      newErrors.team = "At least one team image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      projectName: "",
      clientName: "",
      startDate: "",
      dueDate: "",
      status: "Planning",
      progress: "",
      team: [],
      extraMembers: 0,
      icon: "",
      iconColor: "bg-teal-500",
    });
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onAddProject({
      ...formData,
      progress: Number(formData.progress),
      extraMembers: Number(formData.extraMembers),
      icon: formData.icon.toUpperCase(),
    });

    resetForm();
    // setShowAdd(false);
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
      : "bg-gray-50 border-gray-200 text-black placeholder:text-gray-400"
  }`;

  const labelClass = "block text-sm font-medium mb-2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur px-4">
      <div
        className={`w-full max-w-5xl rounded-2xl p-8 shadow-xl max-h-[90vh] overflow-y-auto ${
          darkMode
            ? "bg-gray-800 border border-gray-600 text-white"
            : "bg-white border border-gray-200 text-black"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Add Project</h2>
            <p className="text-sm text-gray-500">
              Enter project details to create a new record
            </p>
          </div>

          <button
            onClick={() => setShowAdd(false)}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-5">
            {/* Project Name */}
            <div>
              <label className={labelClass}>Project Name</label>
              <div className="flex gap-2">
                <Folder size={18} />
                <input
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              {errors.projectName && (
                <p className="text-red-500 text-xs">{errors.projectName}</p>
              )}
            </div>

            {/* Client */}
            <div>
              <label className={labelClass}>Client Name</label>
              <div className="flex gap-2">
                <User size={18} />
                <input
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              {errors.clientName && (
                <p className="text-red-500 text-xs">{errors.clientName}</p>
              )}
            </div>

            {/* Dates */}
            <div>
              <label className={labelClass}>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-xs">{errors.dueDate}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className={labelClass}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option>Planning</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>On Hold</option>
              </select>
            </div>

            {/* Progress */}
            <div>
              <label className={labelClass}>Progress</label>
              <input
                type="number"
                name="progress"
                value={formData.progress}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.progress && (
                <p className="text-red-500 text-xs">{errors.progress}</p>
              )}
            </div>

            {/* Icon */}
            <div>
              <label className={labelClass}>Icon</label>
              <input
                name="icon"
                maxLength={1}
                value={formData.icon}
                onChange={handleChange}
                className={inputClass}
              />
              {errors.icon && (
                <p className="text-red-500 text-xs">{errors.icon}</p>
              )}
            </div>

            {/* Team */}
            <div>
              <label className={labelClass}>Team Images</label>
              <input
                type="file"
                multiple
                onChange={handleTeamChange}
                className={inputClass}
              />
              {errors.team && (
                <p className="text-red-500 text-xs">{errors.team}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 bg-gray-300 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-[#0f766e] text-white rounded-xl"
            >
              Save Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
