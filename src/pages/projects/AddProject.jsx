import { useState } from "react";
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

    if (formData.progress === "") {
      newErrors.progress = "Progress is required";
    } else if (
      Number(formData.progress) < 0 ||
      Number(formData.progress) > 100
    ) {
      newErrors.progress = "Progress must be between 0 and 100";
    }

    if (!formData.icon.trim()) {
      newErrors.icon = "Project icon is required";
    } else if (formData.icon.trim().length > 1) {
      newErrors.icon = "Use only one letter";
    }

    if (formData.team.length === 0) {
      newErrors.team = "At least one team image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onAddProject({
      ...formData,
      progress: Number(formData.progress),
      extraMembers: Number(formData.extraMembers),
      icon: formData.icon.toUpperCase(),
    });

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
    setShowAdd(false);
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none ${
    darkMode
      ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
      : "bg-gray-50 border-gray-200 text-black placeholder:text-gray-400"
  }`;

  const labelClass = "block text-sm font-medium mb-2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] px-4">
      <div
        className={`w-full max-w-5xl rounded-2xl p-8 shadow-xl max-h-[90vh] overflow-y-auto transition duration-300 ${
          darkMode
            ? "bg-gray-800 border border-gray-600 text-white"
            : "bg-white border border-gray-200 text-black"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Add Project</h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter project details to create a new record
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAdd(false)}
            className="text-gray-500 hover:text-red-500 text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Project Name */}
            <div>
              <label className={labelClass}>Project Name</label>
              <div className="flex items-center gap-2">
                <Folder size={18} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  placeholder="Enter project name"
                  className={inputClass}
                />
              </div>
              {errors.projectName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.projectName}
                </p>
              )}
            </div>

            {/* Client Name */}
            <div>
              <label className={labelClass}>Client Name</label>
              <div className="flex items-center gap-2">
                <User size={18} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="Enter client name"
                  className={inputClass}
                />
              </div>
              {errors.clientName && (
                <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className={labelClass}>Start Date</label>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-gray-400 shrink-0" />
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className={labelClass}>Due Date</label>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-gray-400 shrink-0" />
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              {errors.dueDate && (
                <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className={labelClass}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            {/* Progress */}
            <div>
              <label className={labelClass}>Progress (%)</label>
              <div className="flex items-center gap-2">
                <Percent size={18} className="text-gray-400 shrink-0" />
                <input
                  type="number"
                  name="progress"
                  value={formData.progress}
                  onChange={handleChange}
                  placeholder="Enter progress"
                  min="0"
                  max="100"
                  className={inputClass}
                />
              </div>
              {errors.progress && (
                <p className="text-red-500 text-xs mt-1">{errors.progress}</p>
              )}
            </div>

            {/* Icon Letter */}
            <div>
              <label className={labelClass}>Project Icon Letter</label>
              <div className="flex items-center gap-2">
                <Type size={18} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="Example: E"
                  maxLength={1}
                  className={inputClass}
                />
              </div>
              {errors.icon && (
                <p className="text-red-500 text-xs mt-1">{errors.icon}</p>
              )}
            </div>

            {/* Icon Color */}
            <div>
              <label className={labelClass}>Icon Color</label>
              <div className="flex items-center gap-2">
                <Palette size={18} className="text-gray-400 shrink-0" />
                <select
                  name="iconColor"
                  value={formData.iconColor}
                  onChange={handleChange}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="bg-teal-500">Teal</option>
                  <option value="bg-cyan-500">Cyan</option>
                  <option value="bg-blue-500">Blue</option>
                  <option value="bg-orange-500">Orange</option>
                  <option value="bg-amber-500">Amber</option>
                  <option value="bg-emerald-500">Emerald</option>
                  <option value="bg-violet-500">Violet</option>
                  <option value="bg-rose-500">Rose</option>
                </select>
              </div>
            </div>

            {/* Extra Members */}
            <div>
              <label className={labelClass}>Extra Team Members</label>
              <div className="flex items-center gap-2">
                <Users size={18} className="text-gray-400 shrink-0" />
                <input
                  type="number"
                  name="extraMembers"
                  value={formData.extraMembers}
                  onChange={handleChange}
                  placeholder="Enter extra members count"
                  min="0"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Team Images */}
            <div>
              <label className={labelClass}>Team Images</label>
              <div className="flex items-center gap-2">
                <ImagePlus size={18} className="text-gray-400 shrink-0" />
                <input
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  multiple
                  onChange={handleTeamChange}
                  className={`w-full px-4 py-3 rounded-xl border outline-none cursor-pointer file:mr-4 file:rounded-lg file:border-0 file:px-3 file:py-2 file:text-sm ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white"
                      : "bg-gray-50 border-gray-200 text-black file:bg-gray-200 file:text-black"
                  }`}
                />
              </div>
              {errors.team && (
                <p className="text-red-500 text-xs mt-1">{errors.team}</p>
              )}
            </div>
          </div>

          {/* Preview */}
          <div
            className={`rounded-2xl p-5 border ${
              darkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <p className="text-sm font-medium mb-4">Preview</p>

            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-xl ${formData.iconColor} text-white flex items-center justify-center font-bold text-xl`}
              >
                {formData.icon ? formData.icon.toUpperCase() : "P"}
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-lg truncate">
                  {formData.projectName || "Project Name"}
                </h3>

                <p className="text-sm text-gray-500 truncate">
                  {formData.clientName || "Client Name"}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0f766e]"
                      style={{ width: `${formData.progress || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formData.progress || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className={`px-5 py-2.5 rounded-xl cursor-pointer ${
                darkMode
                  ? "bg-gray-600 text-white hover:bg-gray-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-white bg-[#0f766e] hover:opacity-90 cursor-pointer"
            >
              Save Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
