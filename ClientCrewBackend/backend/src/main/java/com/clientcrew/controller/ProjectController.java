package com.clientcrew.controller;

import java.util.List;
import com.clientcrew.dto.ProjectRequest;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.clientcrew.entity.Project;
import com.clientcrew.service.ProjectService;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // Role-wise project view
 // Return projects based on logged-in user's role
    @GetMapping
    public List<Project> getProjects(Authentication authentication) {

        String email = authentication.getName();

        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_", "");

        return projectService.getProjectsByRole(email, role);
    }

 // Create project - allowed for ADMIN and MANAGER only
    
    
    
    
    @PostMapping
    public Project createProject(@RequestBody ProjectRequest request, Authentication authentication) {
        String email = authentication.getName();

        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_", "");

        return projectService.createProject(request, email, role);
    }
 // Update project - ADMIN can update any project, MANAGER only own project
    @PutMapping("/{id}")
    public Project updateProject(
            @PathVariable Long id,
            @RequestBody ProjectRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_", "");

        return projectService.updateProject(id, request, email, role);
    }
    
 // Delete project - only ADMIN
    @DeleteMapping("/{id}")
    public void deleteProject(
            @PathVariable Long id,
            Authentication authentication) {

        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_", "");

        projectService.deleteProject(id, role);
    }
}