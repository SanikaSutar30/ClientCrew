let projects = JSON.parse(localStorage.getItem("projects")) || [
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
        assignedEmployees: [
          {
            id: "emp1",
            name: "Priya Singh",
            role: "Manager",
            image: "../assets/Profile.jpg",
          },
          {
            id: "emp2",
            name: "Rahul Sharma",
            role: "Employee",
            image: "../assets/Profile2.jpg",
          },
        ],
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
        assignedEmployees: [
          {
            id: "emp2",
            name: "Rahul Sharma",
            role: "Employee",
            image: "../assets/Profile2.jpg",
          },
          {
            id: "emp3",
            name: "John Doe",
            role: "Employee",
            image: "../assets/Profile3.jpg",
          },
        ],
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
        assignedEmployees: [
          {
            id: "emp1",
            name: "Priya Singh",
            role: "Manager",
            image: "../assets/Profile.jpg",
          },
          {
            id: "emp4",
            name: "Jennifer Brown",
            role: "Employee",
            image: "../assets/Profile4.jpg",
          },
        ],
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
        assignedEmployees: [
          {
            id: "emp3",
            name: "John Doe",
            role: "Employee",
            image: "../assets/Profile3.jpg",
          },
          {
            id: "emp4",
            name: "Jennifer Brown",
            role: "Employee",
            image: "../assets/Profile4.jpg",
          },
        ],
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
        assignedEmployees: [
          {
            id: "emp1",
            name: "Priya Singh",
            role: "Manager",
            image: "../assets/Profile.jpg",
          },
          {
            id: "emp5",
            name: "Amit Patil",
            role: "Employee",
            image: "../assets/Profile5.jpg",
          },
        ],
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
        assignedEmployees: [
          {
            id: "emp2",
            name: "Rahul Sharma",
            role: "Employee",
            image: "../assets/Profile2.jpg",
          },
        ],
      },
    
];

const saveToStorage = () => {
  localStorage.setItem("projects", JSON.stringify(projects));
};

export const getAllProjects = () => {
  return [...projects];
};

export const getProjectById = (id) => {
  const project = projects.find((project) => project.id === id);
  return project ? { ...project } : null;
};

export const addProject = (newProject) => {
  const projectWithId = {
    ...newProject,
    id: projects.length ? Math.max(...projects.map((p) => p.id)) + 1 : 1,
  };

  projects = [projectWithId, ...projects];
  saveToStorage();
  return projectWithId;
};

export const updateProject = (updatedProject) => {
  let updated = false;

  projects = projects.map((project) => {
    if (project.id === updatedProject.id) {
      updated = true;
      return updatedProject;
    }
    return project;
  });

  if (updated) {
    saveToStorage();
    return updatedProject;
  }

  return null;
};

export const deleteProject = (id) => {
  const initialLength = projects.length;

  projects = projects.filter((project) => project.id !== id);

  if (projects.length < initialLength) {
    saveToStorage();
    return true;
  }

  return false;
};
