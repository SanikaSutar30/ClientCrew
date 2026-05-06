package com.clientcrew.service;

import java.util.List;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clientcrew.entity.Project;
import com.clientcrew.repository.ProjectRepository;
import com.clientcrew.dto.ProjectRequest;
import com.clientcrew.entity.User;
import com.clientcrew.repository.UserRepository;


@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;
    
    
    @Autowired
    private UserRepository userRepository;

    // Get all projects (mainly for admin)
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
    
    
    
    public Project createProject(ProjectRequest request, String loggedInEmail, String role) {
        Project project = new Project();

        project.setProjectName(request.getProjectName());
        project.setClientName(request.getClientName());
        project.setStartDate(request.getStartDate());
        project.setDueDate(request.getDueDate());
        project.setStatus(request.getStatus());
        project.setProgress(request.getProgress());
        project.setCustomerEmail(request.getCustomerEmail());
        project.setProjectImage(request.getProjectImage());

        if (role.equals("MANAGER")) {
            project.setManagerEmail(loggedInEmail);
        }

        List<User> employees = userRepository.findAllById(request.getEmployeeIds());
        project.setAssignedEmployees(employees);

        return projectRepository.save(project);
    }

    // Return projects based on logged-in user role
    public List<Project> getProjectsByRole(String email, String role) {

        if (role.equals("ADMIN")) {
            return projectRepository.findAll();
        }

        if (role.equals("MANAGER")) {
            return projectRepository.findByAssignedEmployees_UserEmail(email);
        }

        if (role.equals("EMPLOYEE")) {
        	return projectRepository.findByAssignedEmployees_UserEmail(email);        }

        if (role.equals("CUSTOMER")) {
            return projectRepository.findByCustomerEmail(email);
        }

        throw new RuntimeException("Invalid role: " + role);
    }

    // Save new project into database
    public Project save(Project project) {
        return projectRepository.save(project);
    }
    
    public Project updateProject(Long id, ProjectRequest request, String loggedInEmail, String role) {

        Project existing = projectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Project not found"));

        // Manager restriction
        if (role.equals("MANAGER")) {
            boolean isAssignedManager = existing.getAssignedEmployees()
                    .stream()
                    .anyMatch(user ->
                            user.getUserEmail().equals(loggedInEmail)
                            && user.getUserRole().name().equals("MANAGER")
                    );

            if (!isAssignedManager) {
                throw new RuntimeException("Access denied: Not your project");
            }
        }

        // Admin → full access
        existing.setProjectName(request.getProjectName());
        existing.setClientName(request.getClientName());
        existing.setStatus(request.getStatus());
        existing.setStartDate(request.getStartDate());
        existing.setDueDate(request.getDueDate());
        existing.setProgress(request.getProgress());
        existing.setCustomerEmail(request.getCustomerEmail());
        existing.setProjectImage(request.getProjectImage());

        List<User> requestedUsers = userRepository.findAllById(
        	    request.getEmployeeIds() == null ? List.of() : request.getEmployeeIds()
        	);

        	if (role.equals("MANAGER")) {
        	    List<User> existingManagers = existing.getAssignedEmployees()
        	            .stream()
        	            .filter(user -> user.getUserRole().name().equals("MANAGER"))
        	            .toList();

        	    requestedUsers.removeIf(user -> user.getUserRole().name().equals("MANAGER"));
        	    requestedUsers.addAll(existingManagers);
        	}

        	existing.setAssignedEmployees(requestedUsers);
        return projectRepository.save(existing);
    }
    
    
    
    public void deleteProject(Long id, String role) {

        if (!role.equals("ADMIN")) {
            throw new RuntimeException("Only admin can delete project");
        }

        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Project not found"));

        projectRepository.delete(project);
    }
}