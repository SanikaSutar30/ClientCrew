package com.clientcrew.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.clientcrew.dto.ProjectRequest;
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

    @GetMapping
    public List<Project> getProjects(Authentication authentication) {
        String email = authentication.getName();
        String role = getRole(authentication);

        return projectService.getProjectsByRole(email, role);
    }

    @PostMapping
    public Project createProject(
            @RequestBody ProjectRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        String role = getRole(authentication);

        return projectService.createProject(request, email, role);
    }

    @PutMapping("/{id}")
    public Project updateProject(
            @PathVariable Long id,
            @RequestBody ProjectRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        String role = getRole(authentication);

        return projectService.updateProject(id, request, email, role);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(
            @PathVariable Long id,
            Authentication authentication
    ) {
        String loggedInEmail = authentication.getName();
        String role = getRole(authentication);

        projectService.deleteProject(id, role, loggedInEmail);
    }

    private String getRole(Authentication authentication) {
        return authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_", "");
    }
}