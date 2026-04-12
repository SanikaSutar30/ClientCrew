import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  SlidersHorizontal,
  Folder,
  LoaderCircle,
  CheckCircle2,
  PauseCircle,
  FileText,
  CheckSquare,
  Settings,
  LayoutGrid
} from "lucide-react";
import { PieChart, Pie,Cell, ResponsiveContainer } from "recharts";
// Components
import AddProject from "./AddProject";
import EditProject from "./EditProject";
import ViewProject from "./ViewProject";
import DeleteProject from "./DeleteProject";

export default function Projects() {
  // State
  const { darkMode } = useOutletContext();
  // Modal state
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Sample projects data
  const [projects, setProjects] = useState([
    {
      id: 1,
      icon: "E",
      iconColor: "bg-cyan-500",
      projectName: "E-commerce Website",
      clientName: "ABC Tech Solutions",
      startDate: "2024-07-16",
      dueDate: "2024-07-19",
      status: "In Progress",
      progress: 70,
      team: ["../assets/Profile.jpg", "../assets/Profile2.jpg"],
      extraMembers: 2,
    },
    {
      id: 2,
      icon: "M",
      iconColor: "bg-blue-500",
      projectName: "Mobile App Development",
      clientName: "XYZ Innovations",
      startDate: "2024-06-22",
      dueDate: "2024-05-22",
      status: "Completed",
      progress: 100,
      team: ["../assets/Profile3.jpg", "../assets/Profile4.jpg"],
      extraMembers: 1,
    },
    {
      id: 3,
      icon: "C",
      iconColor: "bg-orange-500",
      projectName: "CRM Platform Enhancement",
      clientName: "Acme Corp",
      startDate: "2024-06-22",
      dueDate: "2024-09-04",
      status: "On Hold",
      progress: 35,
      team: ["../assets/Profile5.jpg", "../assets/Profile6.jpg"],
      extraMembers: 0,
    },
    {
      id: 4,
      icon: "D",
      iconColor: "bg-amber-500",
      projectName: "Digital Marketing Campaign",
      clientName: "Global Ventures",
      startDate: "2023-02-20",
      dueDate: "2024-03-13",
      status: "In Progress",
      progress: 60,
      team: ["../assets/Profile2.jpg", "../assets/Profile3.jpg"],
      extraMembers: 3,
    },
    {
      id: 5,
      icon: "H",
      iconColor: "bg-emerald-500",
      projectName: "Healthcare Management System",
      clientName: "MediCare Inc",
      startDate: "2023-08-23",
      dueDate: "2024-03-01",
      status: "In Progress",
      progress: 80,
      team: ["../assets/Profile4.jpg", "../assets/Profile5.jpg"],
      extraMembers: 1,
    },
    {
      id: 6,
      icon: "E",
      iconColor: "bg-violet-500",
      projectName: "ERP Software Integration",
      clientName: "Smith & Co",
      startDate: "2024-05-23",
      dueDate: "2024-10-20",
      status: "Planning",
      progress: 10,
      team: ["../assets/Profile6.jpg"],
      extraMembers: 0,
    },
  ]);

  // Filters and pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [clientFilter, setClientFilter] = useState("All Clients");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const itemsPerPage = 6;

  // Handlers
  const handleAddProject = (newProject) => {
    const projectToAdd = {
      id: projects.length + 1,
      icon: newProject.icon || "P",
      iconColor: newProject.iconColor || "bg-teal-500",
      projectName: newProject.projectName,
      clientName: newProject.clientName,
      startDate: newProject.startDate,
      dueDate: newProject.dueDate,
      status: newProject.status,
      progress: Number(newProject.progress || 0),
      team: newProject.team || ["../assets/Profile.jpg"],
      extraMembers: Number(newProject.extraMembers || 0),
    };

    setProjects((prev) => [projectToAdd, ...prev]);
    setShowAdd(false);
  };

//  Open edit modal
  const handleEditClick = (project) => {
    setSelectedProject(project);
    setShowEdit(true);
  };
const handleDeleteClick = (project) => {
  setSelectedProject(project);
  setShowDelete(true);
};


  // Update selected project
  const handleUpdateProject = (updatedProject) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === updatedProject.id ? updatedProject : project,
      ),
    );
    setShowEdit(false);
    setSelectedProject(null);
  };

  // Delete selected project
  const handleDeleteProject = (projectId) => {
    setProjects((prev) => prev.filter((project) => project.id !== projectId));
    setShowDelete(false);
    setSelectedProject(null);
  };

  // Open view modal
  const handleViewClick = (project) => {
    setSelectedProject(project);
    setShowView(true);
  };

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

  const uniqueClients = [
    "All Clients",
    ...new Set(projects.map((p) => p.clientName)),
  ];

  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.clientName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All Status" || project.status === statusFilter;

      const matchesClient =
        clientFilter === "All Clients" || project.clientName === clientFilter;

      return matchesSearch && matchesStatus && matchesClient;
    })
    .sort((a, b) => {
      if (sortOrder === "Newest") {
        return new Date(b.startDate) - new Date(a.startDate);
      }
      return new Date(a.startDate) - new Date(b.startDate);
    });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const safeCurrentPage =
    totalPages === 0 ? 1 : Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const projectStatusData = [
  {
    name: "In Progress",
    value: projects.filter((p) => p.status === "In Progress").length,
    color: "#0f766e",
  },
  {
    name: "Completed",
    value: projects.filter((p) => p.status === "Completed").length,
    color: "#5b7cfa",
  },
  {
    name: "On Hold",
    value: projects.filter((p) => p.status === "On Hold").length,
    color: "#f4a340",
  },
  {
    name: "Planning",
    value: projects.filter((p) => p.status === "Planning").length,
    color: "#38bdf8",
  },
];

  const totalProjects = projects.length;

  const upcomingDeadlines = [...projects]
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      {/* Add project modal */}
      {showAdd && (
        <AddProject
          darkMode={darkMode}
          setShowAdd={setShowAdd}
          onAddProject={handleAddProject}
        />
      )}

      {/* Edit project modal */}
      {showEdit && selectedProject && (
        <EditProject
          darkMode={darkMode}
          project={selectedProject}
          setShowEdit={setShowEdit}
          onUpdateProject={handleUpdateProject}
        />
      )}

      {/* Delete Project modal */}
      {showDelete && selectedProject && (
        <DeleteProject
          darkMode={darkMode}
          project={selectedProject}
          setShowDelete={setShowDelete}
          onDeleteProject={handleDeleteProject}
        />
      )}

      {/* View Project modal */}
      {showView && selectedProject && (
        <ViewProject
          darkMode={darkMode}
          project={selectedProject}
          setShowView={setShowView}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p
            className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}
          >
            Manage all project records here.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#0f766e] text-white hover:opacity-90 cursor-pointer"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Project",
            value: projects.length,
            icon: Folder,
            color: "text-blue-600",
            bg: "bg-blue-100",
          },
          {
            title: "In Progress",
            value: projects.filter((p) => p.status === "In Progress").length,
            icon: LoaderCircle,
            color: "text-emerald-600",
            bg: "bg-emerald-100",
          },
          {
            title: "Completed",
            value: projects.filter((p) => p.status === "Completed").length,
            icon: CheckCircle2,
            color: "text-green-600",
            bg: "bg-green-100",
          },
          {
            title: "On Hold",
            value: projects.filter((p) => p.status === "On Hold").length,
            icon: PauseCircle,
            color: "text-orange-600",
            bg: "bg-orange-100",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`p-5 rounded-xl shadow-sm flex items-center justify-between transition hover:scale-[1.02] ${
                darkMode
                  ? "bg-gray-700 border border-gray-600"
                  : "bg-white border border-gray-200"
              }`}
            >
              {/* Left content */}
              <div>
                <p
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {item.title}
                </p>

                <h2
                  className={`text-2xl font-bold mt-2 ${
                    darkMode ? "text-white" : "text-black"
                  }`}
                >
                  {item.value}
                </h2>
              </div>

              {/* Icon */}
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl ${item.bg}`}
              >
                <Icon size={22} className={item.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main table card */}
      <div
        className={`rounded-2xl shadow-sm overflow-hidden ${
          darkMode
            ? "bg-gray-700 border border-gray-600 text-white"
            : "bg-white border border-gray-200 text-black"
        }`}
      >
        {/* Top filters */}
        <div
          className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 border-b ${
            darkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
          {/* Search */}
          <div
            className={`flex items-center px-3 py-2 rounded-xl w-full lg:w-80 border ${
              darkMode
                ? "bg-gray-600 border-gray-500"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={`bg-transparent outline-none ml-2 w-full text-sm ${
                darkMode
                  ? "text-white placeholder:text-gray-300"
                  : "text-gray-700 placeholder:text-gray-400"
              }`}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-sm border cursor-pointer ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
            >
              <option>All Status</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>On Hold</option>
              <option>Planning</option>
            </select>

            <select
              value={clientFilter}
              onChange={(e) => {
                setClientFilter(e.target.value);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-sm border cursor-pointer ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
            >
              {uniqueClients.map((client) => (
                <option key={client} value={client}>
                  {client}
                </option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-sm border cursor-pointer ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
            >
              <option>Newest</option>
              <option>Oldest</option>
            </select>

            <button
              className={`p-2.5 rounded-xl border cursor-pointer ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* Table header */}
        <div className="px-4 pt-4">
          <div
            className={`grid grid-cols-[2.3fr_1.5fr_1fr_1fr_1fr_1.2fr_1fr_1fr] px-4 py-3 text-sm font-semibold rounded-xl ${
              darkMode ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            <span>Project</span>
            <span>Client</span>
            <span>Start Date</span>
            <span>Due Date</span>
            <span>Status</span>
            <span>Progress</span>
            <span>Team</span>
            <span>Actions</span>
          </div>
        </div>

        {/* Table body */}
        <div className="px-4 pb-4">
          {paginatedProjects.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No projects found
            </div>
          ) : (
            paginatedProjects.map((project) => (
              <div
                key={project.id}
                className={`grid grid-cols-[2.3fr_1.5fr_1fr_1fr_1fr_1.2fr_1fr_1fr] items-center px-4 py-3 border-b last:border-b-0 ${
                  darkMode
                    ? "border-gray-600 hover:bg-gray-600"
                    : "border-gray-100 hover:bg-gray-50"
                } transition rounded-xl`}
              >
                {/* Project */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl ${project.iconColor} text-white flex items-center justify-center font-semibold shrink-0`}
                  >
                    {project.icon}
                  </div>
                  <span
                    className={`font-medium truncate ${
                      darkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {project.projectName}
                  </span>
                </div>

                {/* Client */}
                <span className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  {project.clientName}
                </span>

                {/* Start Date */}
                <span className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  {new Date(project.startDate).toLocaleDateString()}
                </span>

                {/* Due Date */}
                <span className={darkMode ? "text-gray-300" : "text-gray-600"}>
                  {new Date(project.dueDate).toLocaleDateString()}
                </span>

                {/* Status */}
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full w-fit ${getStatusClasses(
                    project.status,
                  )}`}
                >
                  {project.status}
                </span>

                {/* Progress */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getProgressBarColor(
                        project.status,
                      )}`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      darkMode ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {project.progress}%
                  </span>
                </div>

                {/* Team */}
                <div className="flex items-center">
                  {project.team.map((member, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full overflow-hidden border-2 ${
                        darkMode ? "border-gray-700" : "border-white"
                      } ${index !== 0 ? "-ml-2" : ""}`}
                    >
                      <img
                        src={member}
                        alt="team member"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}

                  {project.extraMembers > 0 && (
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold -ml-2 ${
                        darkMode
                          ? "bg-gray-500 text-white border-2 border-gray-700"
                          : "bg-gray-200 text-gray-700 border-2 border-white"
                      }`}
                    >
                      +{project.extraMembers}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewClick(project)}
                    className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    onClick={() => handleEditClick(project)}
                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDeleteClick(project)}
                    className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div
          className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 py-4 border-t ${
            darkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
          <p
            className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}
          >
            Showing{" "}
            <span className="font-medium">
              {filteredProjects.length === 0
                ? 0
                : (safeCurrentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(
                safeCurrentPage * itemsPerPage,
                filteredProjects.length,
              )}
            </span>{" "}
            of <span className="font-medium">{filteredProjects.length}</span>{" "}
            projects
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={safeCurrentPage === 1}
              className={`px-3 py-2 rounded-lg text-sm border ${
                safeCurrentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              } ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium cursor-pointer ${
                    safeCurrentPage === page
                      ? "bg-[#0f766e] text-white"
                      : darkMode
                        ? "bg-gray-600 text-white"
                        : "bg-white border border-gray-200 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))
              }
              disabled={safeCurrentPage === totalPages || totalPages === 0}
              className={`px-3 py-2 rounded-lg text-sm border ${
                safeCurrentPage === totalPages || totalPages === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              } ${
                darkMode
                  ? "bg-gray-600 border-gray-500 text-white"
                  : "bg-white border-gray-200 text-gray-700"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Status */}
        <div
          className={`p-6 rounded-2xl shadow-sm ${
            darkMode
              ? "bg-gray-700 border border-gray-600"
              : "bg-white border border-gray-100"
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-6 ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            Project Status
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Chart */}
            <div className="w-[180px] h-[180px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {projectStatusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center total */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span
                  className={`text-3xl font-bold ${
                    darkMode ? "text-white" : "text-black"
                  }`}
                >
                  {totalProjects}
                </span>
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Total
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-4 w-full">
              {projectStatusData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>

                  <span
                    className={`text-lg font-semibold ${
                      darkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div
          className={`p-6 rounded-2xl shadow-sm ${
            darkMode
              ? "bg-gray-700 border border-gray-600"
              : "bg-white border border-gray-100"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              Upcoming Deadlines
            </h2>

            <button className="text-sm cursor-pointer font-medium text-[#0f766e] hover:underline hover:text-[#115e59] transition">
              View All
            </button>
          </div>

          <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {upcomingDeadlines.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-xl ${project.iconColor} text-white flex items-center justify-center font-semibold shrink-0`}
                  >
                    {project.icon}
                  </div>

                  <div className="min-w-0">
                    <h3
                      className={`text-base font-semibold truncate ${
                        darkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {project.projectName}
                    </h3>
                    <p
                      className={`text-sm truncate ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {project.clientName}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p
                    className={`text-sm font-medium ${
                      darkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {new Date(project.dueDate).toLocaleDateString()}
                  </p>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      project.status === "In Progress"
                        ? "bg-green-100 text-green-700"
                        : project.status === "Completed"
                          ? "bg-slate-200 text-slate-700"
                          : project.status === "On Hold"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Quick Actions */}
        <div
          className={`p-6 rounded-2xl shadow-sm ${
            darkMode
              ? "bg-gray-700 border border-gray-600"
              : "bg-white border border-gray-100"
          }`}
        >
          <h2
            className={`text-xl font-semibold mb-6 ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Add Project */}
            <button
              onClick={() => setShowAdd(true)}
              className={`p-4 rounded-2xl border text-center transition hover:shadow-md cursor-pointer ${
                darkMode
                  ? "bg-gray-600 border-gray-500 hover:bg-gray-500"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-[#0f766e] text-white flex items-center justify-center">
                <Plus size={20} />
              </div>
              <p
                className={`font-medium text-sm ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                Add Project
              </p>
            </button>

            {/* Project Board */}
            <button
              onClick={() => navigate("/project-board")}
              className={`p-4 rounded-2xl border text-center transition hover:shadow-md cursor-pointer ${
                darkMode
                  ? "bg-gray-600 border-gray-500 hover:bg-gray-500"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-blue-500 text-white flex items-center justify-center">
                <LayoutGrid size={20} />
              </div>
              <p
                className={`font-medium text-sm ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                Project Board
              </p>
            </button>

            {/* Go to Tasks */}
            <button
              onClick={() => navigate("/tasks")}
              className={`p-4 rounded-2xl border text-center transition hover:shadow-md cursor-pointer ${
                darkMode
                  ? "bg-gray-600 border-gray-500 hover:bg-gray-500"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-yellow-500 text-white flex items-center justify-center">
                <CheckSquare size={20} />
              </div>
              <p
                className={`font-medium text-sm ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                Manage Tasks
              </p>
            </button>

            {/* Settings */}
            <button
              onClick={() => navigate("/project-settings")}
              className={`p-4 rounded-2xl border text-center transition hover:shadow-md cursor-pointer ${
                darkMode
                  ? "bg-gray-600 border-gray-500 hover:bg-gray-500"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-red-500 text-white flex items-center justify-center">
                <Settings size={20} />
              </div>
              <p
                className={`font-medium text-sm ${
                  darkMode ? "text-white" : "text-black"
                }`}
              >
                Settings
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

