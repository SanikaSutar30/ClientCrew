package com.clientcrew.service;

import java.util.ArrayList;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.clientcrew.dto.EmployeeRequest;
import com.clientcrew.entity.Project;
import com.clientcrew.entity.Role;
import com.clientcrew.entity.User;
import com.clientcrew.repository.ProjectRepository;
import com.clientcrew.repository.UserRepository;
import com.clientcrew.dto.EmployeeResponse;
import com.clientcrew.entity.ActivityType;


@Service
public class EmployeeService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivityLogService activityLogService;

    public EmployeeService(
            UserRepository userRepository,
            ProjectRepository projectRepository,
            PasswordEncoder passwordEncoder,
            ActivityLogService activityLogService
    ) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.passwordEncoder = passwordEncoder;
        this.activityLogService = activityLogService;
    }

    public List<User> getEmployeesByRole(String loggedInEmail, String role) {

        List<User> result = new ArrayList<>();

        // Admin can see all Admins, Managers, Employees
        if (role.equals("ADMIN")) {
            result.addAll(userRepository.findByUserRole(Role.ADMIN));
            result.addAll(userRepository.findByUserRole(Role.MANAGER));
            result.addAll(userRepository.findByUserRole(Role.EMPLOYEE));
            return result;
        }

        // Manager can see Admins + self + employees working on manager projects
        if (role.equals("MANAGER")) {
            result.addAll(userRepository.findByUserRole(Role.ADMIN));

            User manager = userRepository.findByUserEmail(loggedInEmail)
                    .orElseThrow(() -> new RuntimeException("Logged-in manager not found"));

            result.add(manager);

            List<Project> managerProjects =
                    projectRepository.findByManagerEmail(loggedInEmail);

            List<User> teamEmployees = managerProjects.stream()
                    .flatMap(project -> project.getAssignedEmployees().stream())
                    .filter(user -> user.getUserRole() == Role.EMPLOYEE)
                    .distinct()
                    .toList();

            result.addAll(teamEmployees);

            return result.stream().distinct().toList();
        }

        // Employee can see Admins + managers + teammates from same projects
        if (role.equals("EMPLOYEE")) {
            result.addAll(userRepository.findByUserRole(Role.ADMIN));

            List<Project> employeeProjects =
                    projectRepository.findByAssignedEmployees_UserEmail(loggedInEmail);

            List<String> managerEmails = employeeProjects.stream()
                    .map(Project::getManagerEmail)
                    .filter(email -> email != null && !email.isBlank())
                    .distinct()
                    .toList();

            List<User> managers = managerEmails.stream()
                    .map(email -> userRepository.findByUserEmail(email).orElse(null))
                    .filter(user -> user != null && user.getUserRole() == Role.MANAGER)
                    .toList();

            List<User> teammates = employeeProjects.stream()
                    .flatMap(project -> project.getAssignedEmployees().stream())
                    .filter(user -> user.getUserRole() == Role.EMPLOYEE)
                    .toList();

            result.addAll(managers);
            result.addAll(teammates);

            return result.stream().distinct().toList();
        }

     // Customer can see only managers/employees assigned to customer projects
        if (role.equals("CUSTOMER")) {

            List<Project> customerProjects =
                    projectRepository.findByCustomerEmail(loggedInEmail);

            List<User> projectTeamMembers = customerProjects.stream()
                    .flatMap(project -> project.getAssignedEmployees().stream())
                    .filter(user ->
                            user.getUserRole() == Role.MANAGER ||
                            user.getUserRole() == Role.EMPLOYEE
                    )
                    .distinct()
                    .toList();

            result.addAll(projectTeamMembers);

            return result.stream().distinct().toList();
        }

        throw new RuntimeException("Access denied");
    }

    public User addEmployee(EmployeeRequest request, String loggedInEmail, String role) {

        if (!role.equals("ADMIN") && !role.equals("MANAGER")) {
            throw new RuntimeException("Access denied");
        }

        if (request.getUserRole() == Role.ADMIN) {
            throw new RuntimeException("Creating Admin is not allowed");
        }

        if (request.getUserRole() == Role.CUSTOMER) {
            throw new RuntimeException("Use customer module to create customers");
        }

        if (role.equals("MANAGER") && request.getUserRole() != Role.EMPLOYEE) {
            throw new RuntimeException("Manager can add only employees");
        }

        if (userRepository.existsByUserEmail(request.getUserEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUserFullName(request.getUserFullName());
        user.setUserEmail(request.getUserEmail());
        user.setUserPhone(request.getUserPhone());
        user.setUserRole(request.getUserRole());
        user.setStatus(request.getStatus());
        user.setJoinedDate(request.getJoinedDate());
        user.setUserImage(request.getUserImage());

        String rawPassword =
                request.getPassword() != null && !request.getPassword().isBlank()
                        ? request.getPassword()
                        : "123456";

        user.setUserPassword(passwordEncoder.encode(rawPassword));

        User savedUser = userRepository.save(user);

        User performedBy = userRepository.findByUserEmail(loggedInEmail)
                .orElseThrow(() -> new RuntimeException("Logged-in user not found"));

        activityLogService.createActivity(
                ActivityType.EMPLOYEE_CREATED,
                "EMPLOYEE",
                savedUser.getUserId(),
                savedUser.getUserFullName(),
                savedUser.getUserRole().name() + " Created",
                performedBy.getUserFullName() + " created "
                        + savedUser.getUserRole().name().toLowerCase()
                        + " " + savedUser.getUserFullName(),
                null,
                savedUser.getUserEmail(),
                performedBy,
                role.equals("MANAGER") ? loggedInEmail : null,
                null,
                savedUser.getUserEmail()
        );

        return savedUser;    }

    public User updateEmployee(
            Long userId,
            EmployeeRequest request,
            String loggedInEmail,
            String role
    ) {

        if (!role.equals("ADMIN") && !role.equals("MANAGER")) {
            throw new RuntimeException("Access denied");
        }

        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (existingUser.getUserRole() == Role.ADMIN) {
            throw new RuntimeException("Admin user cannot be edited");
        }

        if (existingUser.getUserRole() == Role.CUSTOMER) {
            throw new RuntimeException("Customer cannot be edited from Employee module");
        }

        if (role.equals("MANAGER")) {
            if (existingUser.getUserRole() != Role.EMPLOYEE) {
                throw new RuntimeException("Manager can edit only employees");
            }

            List<Project> managerProjects =
                    projectRepository.findByManagerEmail(loggedInEmail);

            boolean isOwnTeamEmployee = managerProjects.stream()
                    .flatMap(project -> project.getAssignedEmployees().stream())
                    .anyMatch(user -> user.getUserId().equals(existingUser.getUserId()));

            if (!isOwnTeamEmployee) {
                throw new RuntimeException("Access denied: You can edit only your team employees");
            }
        }

        existingUser.setUserFullName(request.getUserFullName());
        existingUser.setUserPhone(request.getUserPhone());
        existingUser.setStatus(request.getStatus());
        existingUser.setJoinedDate(request.getJoinedDate());
        existingUser.setUserImage(request.getUserImage());

        if (role.equals("ADMIN") && request.getUserRole() != null) {
            if (request.getUserRole() == Role.ADMIN || request.getUserRole() == Role.CUSTOMER) {
                throw new RuntimeException("Invalid role update");
            }
            existingUser.setUserRole(request.getUserRole());
        }
        
        
        
        String oldName = existingUser.getUserFullName();
        String oldStatus = existingUser.getStatus();
        String oldRole = existingUser.getUserRole().name();

        User updatedUser = userRepository.save(existingUser);

        User performedBy = userRepository.findByUserEmail(loggedInEmail)
                .orElseThrow(() -> new RuntimeException("Logged-in user not found"));

        String description = performedBy.getUserFullName()
                + " updated " + oldRole.toLowerCase() + " " + oldName;

        if (!oldName.equalsIgnoreCase(updatedUser.getUserFullName())) {
            description += " to " + updatedUser.getUserFullName();
        }

        if (oldStatus != null && updatedUser.getStatus() != null
                && !oldStatus.equalsIgnoreCase(updatedUser.getStatus())) {
            description += " | Status: " + oldStatus + " → " + updatedUser.getStatus();
        }

        if (!oldRole.equalsIgnoreCase(updatedUser.getUserRole().name())) {
            description += " | Role: " + oldRole + " → " + updatedUser.getUserRole().name();
        }

        activityLogService.createActivity(
                ActivityType.EMPLOYEE_UPDATED,
                "EMPLOYEE",
                updatedUser.getUserId(),
                updatedUser.getUserFullName(),
                updatedUser.getUserRole().name() + " Updated",
                description,
                oldName,
                updatedUser.getUserFullName(),
                performedBy,
                role.equals("MANAGER") ? loggedInEmail : null,
                null,
                updatedUser.getUserEmail()
        );

        return updatedUser;    }

    
    
    public void deleteEmployee(Long userId, String role, String loggedInEmail) {

        if (!role.equals("ADMIN")) {
            throw new RuntimeException("Only admin can delete employees");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getUserRole() == Role.ADMIN) {
            throw new RuntimeException("Admin user cannot be deleted");
        }

        if (user.getUserRole() == Role.CUSTOMER) {
            throw new RuntimeException("Customer cannot be deleted from Employee module");
        }

        List<Project> projects = projectRepository.findByAssignedEmployees_UserEmail(user.getUserEmail());

        projects.forEach(project -> {
            project.getAssignedEmployees().removeIf(
                    employee -> employee.getUserId().equals(user.getUserId())
            );
        });

        projectRepository.saveAll(projects);
        
        User performedBy = userRepository.findByUserEmail(loggedInEmail)
                .orElseThrow(() -> new RuntimeException("Logged-in user not found"));

        activityLogService.createActivity(
                ActivityType.EMPLOYEE_DELETED,
                "EMPLOYEE",
                user.getUserId(),
                user.getUserFullName(),
                user.getUserRole().name() + " Deleted",
                performedBy.getUserFullName() + " deleted "
                        + user.getUserRole().name().toLowerCase()
                        + " " + user.getUserFullName(),
                user.getUserEmail(),
                null,
                performedBy,
                null,
                null,
                user.getUserEmail()
        );

        userRepository.delete(user);
        
    }
    
    private EmployeeResponse mapToResponse(User user, String loggedInEmail) {
        boolean currentUser = user.getUserEmail().equalsIgnoreCase(loggedInEmail);

        return new EmployeeResponse(
                user.getUserId(),
                user.getUserFullName(),
                currentUser ? "You" : user.getUserFullName(),
                user.getUserEmail(),
                user.getUserPhone(),
                user.getUserRole().name(),
                user.getUserImage(),
                user.getStatus(),
                user.getJoinedDate(),
                currentUser
        );
    }
    public List<EmployeeResponse> getEmployeeResponsesByRole(
            String loggedInEmail,
            String role
    ) {
        return getEmployeesByRole(loggedInEmail, role)
                .stream()
                .map(user -> mapToResponse(user, loggedInEmail))
                .toList();
    }
}