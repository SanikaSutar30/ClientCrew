let tasks = JSON.parse(localStorage.getItem("tasks")) || [
  {
    id: 1,
    title: "Design Login UI",
    project: "CRM Dashboard",
    assignee: "Rahul Sharma",
    avatar: "../assets/Profile.jpg",
    dueDate: "2026-04-25",
    priority: "High",
    description: "Create login screen UI for ClientCrew",
    status: "To Do",
  },
  {
    id: 2,
    title: "Build Customer Table",
    project: "CRM Dashboard",
    assignee: "Priya Singh",
    avatar: "../assets/Profile2.jpg",
    dueDate: "2026-04-28",
    priority: "Medium",
    description: "Implement customers table with filters",
    status: "In Progress",
  },
];

const saveToStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

export const getAllTasks = () => {
  return [...tasks];
};

export const getTaskById = (id) => {
  const task = tasks.find((task) => task.id === id);
  return task ? { ...task } : null;
};

export const addTask = (newTask) => {
  const taskWithId = {
    ...newTask,
    id: tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
  };

  tasks = [taskWithId, ...tasks];
  saveToStorage();
  return taskWithId;
};

export const updateTask = (updatedTask) => {
  let updated = false;

  tasks = tasks.map((task) => {
    if (task.id === updatedTask.id) {
      updated = true;
      return updatedTask;
    }
    return task;
  });

  if (updated) {
    saveToStorage();
    return updatedTask;
  }

  return null;
};

export const deleteTask = (id) => {
  const initialLength = tasks.length;

  tasks = tasks.filter((task) => task.id !== id);

  if (tasks.length < initialLength) {
    saveToStorage();
    return true;
  }

  return false;
};
