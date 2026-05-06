import api from "./api";

// GET all projects
export const getAllProjects = () => {
  return api.get("/api/projects");
};

// CREATE project
export const createProject = (projectData) => {
  return api.post("/api/projects", projectData);
};
