import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import ViewTask from "./ViewTask";
import AddTask from "./AddTask";
import EditTask from "./EditTask";
import DeleteTask from "./DeleteTask";

import { ConfirmationModal } from "../../components/layout";

import {
  Plus,
  CalendarDays,
  ChevronRight,
  CheckCheck,
  CircleDashed,
  ShieldAlert,
  ClipboardCheck,
} from "lucide-react";

import {
  DndContext,
  closestCorners,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import {
  getAllTasks,
  addTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../../services/taskService";

const backendToUiStatus = (status) => {
  switch (status) {
    case "TO_DO":
      return "To Do";
    case "IN_PROGRESS":
      return "In Progress";
    case "REVIEW":
      return "Review";
    case "BLOCKED":
      return "Blocked";
    case "DONE":
      return "Done";
    default:
      return "To Do";
  }
};

const uiToBackendStatus = (status) => {
  switch (status) {
    case "To Do":
      return "TO_DO";
    case "In Progress":
      return "IN_PROGRESS";
    case "Review":
      return "REVIEW";
    case "Blocked":
      return "BLOCKED";
    case "Done":
      return "DONE";
    default:
      return "TO_DO";
  }
};

const backendToUiPriority = (priority) => {
  switch (priority) {
    case "LOW":
      return "Low";
    case "MEDIUM":
      return "Medium";
    case "HIGH":
      return "High";
    default:
      return "Medium";
  }
};

const getTagByPriority = (priority) => {
  switch (priority) {
    case "High":
      return "Critical";
    case "Medium":
      return "Development";
    case "Low":
      return "Marketing";
    default:
      return "";
  }
};

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

function TaskCard({ task, darkMode, getTagClasses, onDoubleClick, canDrag }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      disabled: !canDrag,
      data: { type: "task", task },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.6 : 1,
    cursor: canDrag ? "grab" : "default",
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
      } shadow-sm px-4 py-4 hover:shadow-md transition ${
        canDrag ? "cursor-grab" : "cursor-default opacity-95"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3
          className={`font-semibold text-[15px] leading-6 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {task.title}
        </h3>

        {task.status === "To Do" && (
          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <CircleDashed size={16} className="text-blue-600" />
          </div>
        )}

        {task.status === "In Progress" && (
          <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
            <CircleDashed size={16} className="text-amber-600 animate-pulse" />
          </div>
        )}

        {task.status === "Done" && (
          <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCheck size={16} className="text-emerald-600" />
          </div>
        )}

        {task.status === "Review" && (
          <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
            <ClipboardCheck size={15} className="text-purple-600" />
          </div>
        )}

        {task.status === "Blocked" && (
          <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
            <ShieldAlert size={15} className="text-red-600" />
          </div>
        )}
      </div>

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

          {task.subtasks && (
            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-gray-100 text-gray-700">
              {task.subtasks}
            </span>
          )}
        </div>
      )}

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
            {task.dueDate || "No date"}
          </span>
        </div>
      </div>
    </div>
  );
}

function TaskColumn({
  column,
  columnTasks,
  darkMode,
  getTagClasses,
  setDefaultStatus,
  setShowAddTask,
  handleViewTask,
  canDragTask,
  canCreateTask,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.title,
    data: { type: "column", status: column.title },
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-full rounded-2xl p-4 shadow-sm transition ${
        darkMode
          ? "bg-gray-800 border border-gray-700"
          : "bg-[#f8f9fc] border border-gray-200"
      } ${isOver ? "ring-2 ring-[#0f766e]" : ""}`}
    >
      <div
        className={`flex items-center justify-between rounded-2xl px-4 py-4 mb-4 ${column.color}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-sm font-semibold tracking-wide text-gray-700">
            {column.title}
          </h2>

          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${column.badge}`}
          >
            {columnTasks.length}
          </span>
        </div>

        <ChevronRight size={18} className="text-gray-500 shrink-0" />
      </div>

      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent min-h-[420px]">
        {columnTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            darkMode={darkMode}
            getTagClasses={getTagClasses}
            onDoubleClick={handleViewTask}
            canDrag={canDragTask(task)}
          />
        ))}
      </div>

      {canCreateTask && (
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
      )}
    </div>
  );
}

export default function Tasks() {
  const { darkMode, userRole } = useOutletContext();

  const normalizedRole = userRole?.toUpperCase();

  const isAdmin = normalizedRole === "ADMIN" || userRole === "Admin";
  const isManager = normalizedRole === "MANAGER" || userRole === "Manager";
  const isEmployee = normalizedRole === "EMPLOYEE" || userRole === "Employee";

  const canCreateTask = isAdmin || isManager;
  const canDeleteTask = isAdmin;

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const loggedInEmail = storedUser.email || storedUser.userEmail || "";

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const canEditTask = () => {
    return isAdmin || isManager;
  };

  const canDragTask = (task) => {
    if (isAdmin || isManager) return true;

    if (isEmployee) {
      return task.assigneeEmail === loggedInEmail;
    }

    return false;
  };

  const mapTaskFromBackend = (task) => {
    const uiPriority = backendToUiPriority(task.priority);
    const uiStatus = backendToUiStatus(task.status);

    return {
      id: task.id,
      title: task.title,
      description: task.description || "",
      projectId: task.projectId,
      project: task.projectName,
      assigneeId: task.assigneeId,
      assignee: task.assigneeName,
      assigneeEmail: task.assigneeEmail,
      avatar: task.assigneeImage || "../assets/Profile.jpg",
      createdBy: task.createdByName,
      priority: uiPriority,
      status: uiStatus,
      dueDate: task.dueDate,
      tag: getTagByPriority(uiPriority),
      borderColor: getBorderColorByStatus(uiStatus),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getAllTasks();
      setTasks(data.map(mapTaskFromBackend));
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTasks();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewTask = (task) => {
    setPendingTask(task);
    setShowViewConfirm(true);
  };

  const handleEditTask = (task) => {
    if (!canEditTask(task)) return;

    setSelectedTask(task);
    setShowViewTask(false);
    setShowEditTask(true);
  };

  const handleDeleteClick = (task) => {
    if (!canDeleteTask) return;

    setSelectedTask(task);
    setShowDeleteTask(true);
  };

  const handleAddTask = async (newTask) => {
    try {
      const taskPayload = {
        title: newTask.title,
        description: newTask.description,
        projectId: newTask.projectId,
        assigneeId: newTask.assigneeId,
        priority: newTask.priority?.toUpperCase() || "MEDIUM",
        status: uiToBackendStatus(newTask.status),
        dueDate: newTask.dueDate,
      };

      await addTask(taskPayload);
      await fetchTasks();

      setSuccessTitle("Task Created!");
      setSuccessMessage("Your task has been created successfully.");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    if (!canEditTask(updatedTask)) return;

    try {
      const taskPayload = {
        title: updatedTask.title,
        description: updatedTask.description,
        projectId: updatedTask.projectId,
        assigneeId: updatedTask.assigneeId,
        priority: updatedTask.priority?.toUpperCase() || "MEDIUM",
        status: uiToBackendStatus(updatedTask.status),
        dueDate: updatedTask.dueDate,
      };

      await updateTask(updatedTask.id, taskPayload);
      await fetchTasks();

      setShowEditTask(false);
      setSelectedTask(null);

      setSuccessTitle("Task Updated!");
      setSuccessMessage("Your task has been updated successfully.");
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!canDeleteTask) return;

    try {
      await deleteTask(taskId);
      await fetchTasks();

      setShowDeleteTask(false);
      setShowViewTask(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = Number(active.id);
    const newStatus = String(over.id);

    const draggedTask = tasks.find((task) => Number(task.id) === taskId);
    if (!draggedTask || !canDragTask(draggedTask)) return;

    try {
      await updateTaskStatus(taskId, uiToBackendStatus(newStatus));
      await fetchTasks();
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const filteredTasks =
    selectedProject === "All Projects"
      ? tasks
      : tasks.filter((task) => task.project === selectedProject);

  const projectOptions = [
    "All Projects",
    ...new Set(tasks.map((task) => task.project).filter(Boolean)),
  ];

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

  return (
    <div className="space-y-6">
      {showAddTask && canCreateTask && (
        <AddTask
          darkMode={darkMode}
          onClose={() => setShowAddTask(false)}
          onAddTask={handleAddTask}
          defaultStatus={defaultStatus}
          userRole={userRole}
        />
      )}

      {showViewTask && selectedTask && (
        <ViewTask
          darkMode={darkMode}
          task={selectedTask}
          setShowViewTask={setShowViewTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteClick}
          userRole={userRole}
        />
      )}

      {showEditTask && selectedTask && canEditTask(selectedTask) && (
        <EditTask
          darkMode={darkMode}
          task={selectedTask}
          setShowEditTask={setShowEditTask}
          onUpdateTask={handleUpdateTask}
          userRole={userRole}
        />
      )}

      {showDeleteTask && selectedTask && canDeleteTask && (
        <DeleteTask
          darkMode={darkMode}
          task={selectedTask}
          showDeleteTask={showDeleteTask}
          setShowDeleteTask={setShowDeleteTask}
          onDeleteTask={handleDeleteTask}
          setShowViewTask={setShowViewTask}
          userRole={userRole}
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

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Task Board</h1>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
          >
            Manage and track all project tasks here.
          </p>
        </div>

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
            {projectOptions.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>

          {canCreateTask && (
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
          )}
        </div>
      </div>

      {loading && (
        <p className={darkMode ? "text-gray-300" : "text-gray-500"}>
          Loading tasks...
        </p>
      )}

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
                  canDragTask={canDragTask}
                  canCreateTask={canCreateTask}
                />
              );
            })}
          </div>
        </div>
      </DndContext>
    </div>
  );
}
