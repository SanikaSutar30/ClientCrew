import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import ViewTask from "./ViewTask";
import AddTask from "./AddTask";
import EditTask from "./EditTask";
import DeleteTask from "./DeleteTask";
import ConfirmationModal from "../../components/layout/ConfirmationModal";
// Icons
import {
  Plus,
  CalendarDays,
  ChevronRight,
  CheckCheck,
  CircleDashed,
  ShieldAlert,
  ClipboardCheck,
} from "lucide-react";
// DnD Kit
import {
  DndContext,
  closestCorners,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
// Utilities
import { CSS } from "@dnd-kit/utilities";
// TODO: Improve task filtering


// TaskCard Component
function TaskCard({ task, darkMode, getTagClasses, onDoubleClick }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: {
        type: "task",
        task,
      },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.6 : 1,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick(task);
      }}
      className={`rounded-2xl border-l-4 ${task.borderColor} ${
        darkMode
          ? "bg-gray-700 border border-gray-600"
          : "bg-white border border-gray-200"
      } shadow-sm px-4 py-4 hover:shadow-md transition cursor-pointer`}
    >
      {/* // Task Header */}
      <div className="flex items-start justify-between gap-3">
        <h3
          className={`font-semibold text-[15px] leading-6 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {task.title}
        </h3>

        {/* // Status Indicators
      // To Do */}
        {task.status === "To Do" && (
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <CircleDashed size={16} className="text-blue-600" />
          </div>
        )}
        {/* // In Progress */}
        {task.status === "In Progress" && (
          <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
            <CircleDashed size={16} className="text-amber-600 animate-pulse" />
          </div>
        )}
        {/* // Done */}
        {task.status === "Done" && (
          <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCheck size={16} className="text-emerald-600" />
          </div>
        )}

        {/* // Review */}
        {task.status === "Review" && (
          <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
            <ClipboardCheck size={15} className="text-amber-600" />
          </div>
        )}

        {/* // Blocked */}
        {task.status === "Blocked" && (
          <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
            <ShieldAlert size={15} className="text-red-600" />
          </div>
        )}
      </div>

      {/* // Tags and Subtasks */}
      {(task.tag || task.subtasks) && (
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {task.tag && (
            <span
              className={`text-xs font-medium px-3 py-1 rounded-lg ${getTagClasses(
                task.tag,
              )}`}
            >
              {task.tag}
            </span>
          )}

          {/* // Subtasks */}
          {task.subtasks && (
            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-gray-100 text-gray-700">
              {task.subtasks}
            </span>
          )}
        </div>
      )}

      {/* // Progress Bar */}
      {typeof task.progress === "number" && (
        <div className="mt-3">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0f766e] rounded-full"
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* // Assignee and Due Date */}
      <div className="flex items-center justify-between mt-4 gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 shrink-0">
            <img
              src={task.avatar}
              alt={task.assignee}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <span
            className={`text-sm truncate ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {task.assignee}
          </span>
        </div>

        {/* // Due Date */}
        <div className="flex items-center gap-1 shrink-0">
          <CalendarDays
            size={14}
            className={darkMode ? "text-gray-400" : "text-gray-500"}
          />
          <span
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            {task.dueDate}
          </span>
        </div>
      </div>
    </div>
  );
}

// TaskColumn Component
function TaskColumn({
  column,
  columnTasks,
  darkMode,
  getTagClasses,
  setDefaultStatus,
  setShowAddTask,
  handleViewTask,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.title,
    data: {
      type: "column",
      status: column.title,
    },
  });

  // Column Header with Task Count
  return (
    <div
      ref={setNodeRef}
      className={`w-full rounded-2xl p-4 shadow-sm transition ${
        darkMode
          ? "bg-gray-800 border border-gray-700"
          : "bg-[#f8f9fc] border border-gray-200"
      } ${isOver ? "ring-2 ring-[#0f766e]" : ""}`}
    >
      {/* // Column Header with Task Count */}
      <div
        className={`flex items-center justify-between rounded-2xl px-4 py-4 mb-4 ${column.color}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <h2
            className={`text-sm font-semibold tracking-wide ${
              darkMode ? "text-gray-800" : "text-gray-700"
            }`}
          >
            {column.title}
          </h2>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${column.badge}`}
          >
            {columnTasks.length}
          </span>
        </div>
        {/* // Chevron Icon */}
        <ChevronRight size={18} className="text-gray-500 shrink-0" />
      </div>
      {/* // Task Cards */}
      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent min-h-[420px]">
        {columnTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            darkMode={darkMode}
            getTagClasses={getTagClasses}
            onDoubleClick={handleViewTask}
          />
        ))}
      </div>
      {/* // Add Task Button */}
      <button
        onClick={() => {
          setDefaultStatus(column.title);
          setShowAddTask(true);
        }}
        className={`mt-4 flex items-center gap-2 text-sm font-medium cursor-pointer transition ${
          darkMode
            ? "text-gray-300 hover:text-white"
            : "text-gray-500 hover:text-[#0f766e]"
        }`}
      >
        <Plus size={16} />
        Add a task
      </button>
    </div>
  );
}

export default function Tasks() {
  // Get dark mode state from context
  const { darkMode } = useOutletContext();
  // State for selected project filter
  const [selectedProject, setSelectedProject] = useState("All Projects");

  const [showAddTask, setShowAddTask] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState("To Do");

  const [showViewTask, setShowViewTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [showDeleteTask, setShowDeleteTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successTitle, setSuccessTitle] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showViewConfirm, setShowViewConfirm] = useState(false);
  const [pendingTask, setPendingTask] = useState(null);

 const handleViewTask = (task) => {
   setPendingTask(task);
   setShowViewConfirm(true);
 };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowViewTask(false);
    setShowEditTask(true);
  };

  const handleDeleteClick = (task) => {
    setSelectedTask(task);
    setShowDeleteTask(true);
  };
const handleUpdateTask = (updatedTask) => {
  setTasks((prev) =>
    prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
  );

  setShowEditTask(false);
  setSelectedTask(null);

  setSuccessTitle("Task Updated!");
  setSuccessMessage("Your task has been updated successfully.");
  setShowSuccessModal(true);
};

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setShowDeleteTask(false);
    setSelectedTask(null);
  };
  // Initial tasks data
  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Design homepage mockup",
      assignee: "Priya Singh",
      avatar: "../assets/Profile.jpg",
      dueDate: "Apr 25",
      status: "To Do",
      project: "E-commerce Website",
      borderColor: "border-l-blue-400",
    },
    {
      id: "2",
      title: "Research competitors",
      assignee: "Rahul Sharma",
      avatar: "../assets/Profile2.jpg",
      dueDate: "Apr 26",
      status: "To Do",
      project: "CRM Platform Enhancement",
      borderColor: "border-l-blue-400",
    },
    {
      id: "3",
      title: "Develop user authentication",
      assignee: "John Doe",
      avatar: "../assets/Profile3.jpg",
      dueDate: "Apr 28",
      status: "In Progress",
      project: "Mobile App Development",
      tag: "Development",
      progress: 60,
      subtasks: "3 / 5",
      borderColor: "border-l-amber-400",
    },
    {
      id: "4",
      title: "Create marketing plan",
      assignee: "Jennifer Brown",
      avatar: "../assets/Profile4.jpg",
      dueDate: "May 5",
      status: "Review",
      project: "Digital Marketing Campaign",
      tag: "Marketing",
      borderColor: "border-l-purple-400",
    },
    {
      id: "5",
      title: "Fix payment issue",
      assignee: "Amit Patil",
      avatar: "../assets/Profile5.jpg",
      dueDate: "May 1",
      status: "Blocked",
      project: "E-commerce Website",
      tag: "Critical",
      borderColor: "border-l-red-400",
    },
    {
      id: "6",
      title: "Finalize logo design",
      assignee: "Jennifer Brown",
      avatar: "../assets/Profile6.jpg",
      dueDate: "Apr 20",
      status: "Done",
      project: "Healthcare Management System",
      borderColor: "border-l-emerald-400",
    },
    {
      id: "7",
      title: "Write unit tests",
      assignee: "Priya Singh",
      avatar: "../assets/Profile.jpg",
      dueDate: "May 3",
      status: "In Progress",
      project: "Healthcare Management System",
      borderColor: "border-l-amber-400",
    },
    {
      id: "8",
      title: "Set up web hosting",
      assignee: "Priya Singh",
      avatar: "../assets/Profile.jpg",
      dueDate: "Apr 22",
      status: "Done",
      project: "E-commerce Website",
      borderColor: "border-l-emerald-400",
    },
  ]);
  // Filter tasks based on selected project
  const filteredTasks =
    selectedProject === "All Projects"
      ? tasks
      : tasks.filter((task) => task.project === selectedProject);

  // Column definitions with colors and badge styles
  const columns = [
    {
      title: "To Do",
      color: "bg-blue-50",
      badge: "bg-blue-100 text-blue-700",
    },
    {
      title: "In Progress",
      color: "bg-amber-50",
      badge: "bg-amber-100 text-amber-700",
    },
    {
      title: "Review",
      color: "bg-purple-50",
      badge: "bg-purple-100 text-purple-700",
    },
    {
      title: "Blocked",
      color: "bg-red-50",
      badge: "bg-red-100 text-red-700",
    },
    {
      title: "Done",
      color: "bg-emerald-50",
      badge: "bg-emerald-100 text-emerald-700",
    },
  ];

  // Function to get tag classes based on tag type
  const getTagClasses = (tag) => {
    switch (tag) {
      case "Development":
        return "bg-blue-100 text-blue-700";
      case "Marketing":
        return "bg-orange-100 text-orange-700";
      case "Critical":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };
  // Function to get border color based on task status
  const getBorderColorByStatus = (status) => {
    switch (status) {
      case "To Do":
        return "border-l-blue-400";
      case "In Progress":
        return "border-l-amber-400";
      case "Review":
        return "border-l-purple-400";
      case "Blocked":
        return "border-l-red-400";
      case "Done":
        return "border-l-emerald-400";
      default:
        return "border-l-gray-400";
    }
  };

 const handleAddTask = (newTask) => {
   setTasks((prev) => [
     {
       ...newTask,
       borderColor: getBorderColorByStatus(newTask.status),
     },
     ...prev,
   ]);

   setSuccessTitle("Task Created!");
   setSuccessMessage("Your task has been created successfully.");
   setShowSuccessModal(true);
 };

  // Handle drag end event to update task status
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = String(active.id);
    const newStatus = String(over.id);

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              borderColor: getBorderColorByStatus(newStatus),
            }
          : task,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {showAddTask && (
        <AddTask
          darkMode={darkMode}
          onClose={() => setShowAddTask(false)}
          onAddTask={handleAddTask}
          defaultStatus={defaultStatus}
        />
      )}
      {showViewTask && selectedTask && (
        <ViewTask
          darkMode={darkMode}
          task={selectedTask}
          setShowViewTask={setShowViewTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteClick}
        />
      )}

      {showEditTask && selectedTask && (
        <EditTask
          darkMode={darkMode}
          task={selectedTask}
          setShowEditTask={setShowEditTask}
          onUpdateTask={handleUpdateTask}
        />
      )}

      {showDeleteTask && selectedTask && (
        <DeleteTask
          darkMode={darkMode}
          task={selectedTask}
          showDeleteTask={showDeleteTask}
          setShowDeleteTask={setShowDeleteTask}
          onDeleteTask={handleDeleteTask}
          setShowViewTask={setShowViewTask}
        />
      )}

      <ConfirmationModal
        darkMode={darkMode}
        isOpen={showSuccessModal}
        type="success"
        title={successTitle}
        message={successMessage}
        confirmText="OK"
        onConfirm={() => setShowSuccessModal(false)}
      />
      <ConfirmationModal
        darkMode={darkMode}
        isOpen={showViewConfirm}
        type="success"
        title="Open Task"
        message="Do you want to view this task?"
        confirmText="Yes, Open"
        cancelText="Cancel"
        onConfirm={() => {
          setShowViewConfirm(false);

          if (pendingTask) {
            setSelectedTask(pendingTask);
            setShowViewTask(true);
          }
        }}
        onCancel={() => setShowViewConfirm(false)}
      />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {/* // Page Title and Description */}
          <h1 className="text-2xl font-bold">Task Board</h1>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            Manage and track all project tasks here.
          </p>
        </div>

        {/* // Project Filter and New Task Button */}

        <div className="flex items-center gap-3">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className={`px-4 py-2 rounded-xl text-sm border cursor-pointer ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-200 text-gray-700"
            }`}
          >
            {/* // Project Filter Options */}
            <option value="All Projects">All Projects</option>
            <option value="E-commerce Website">E-commerce Website</option>
            <option value="Mobile App Development">
              Mobile App Development
            </option>
            <option value="CRM Platform Enhancement">
              CRM Platform Enhancement
            </option>
            <option value="Digital Marketing Campaign">
              Digital Marketing Campaign
            </option>
            <option value="Healthcare Management System">
              Healthcare Management System
            </option>
          </select>

          {/* // New Task Button */}
          <button
            onClick={() => {
              setDefaultStatus("To Do");
              setShowAddTask(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0f766e] text-white font-medium cursor-pointer hover:opacity-90"
          >
            <Plus size={16} />
            New Task
          </button>
        </div>
      </div>

      {/* Board */}
      {/* // DnD Context for drag-and-drop functionality */}
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="pb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {columns.map((column) => {
              const columnTasks = filteredTasks.filter(
                (task) => task.status === column.title,
              );

              return (
                <TaskColumn
                  key={column.title}
                  column={column}
                  columnTasks={columnTasks}
                  darkMode={darkMode}
                  getTagClasses={getTagClasses}
                  setDefaultStatus={setDefaultStatus}
                  setShowAddTask={setShowAddTask}
                  handleViewTask={handleViewTask}
                />
              );
            })}
          </div>
        </div>
      </DndContext>
    </div>
  );
}
