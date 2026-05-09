package com.clientcrew.service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.clientcrew.dto.report.ReportActivityResponse;
import com.clientcrew.dto.report.ReportChartResponse;
import com.clientcrew.dto.report.ReportDashboardResponse;
import com.clientcrew.dto.report.ReportSummaryResponse;
import com.clientcrew.entity.Project;
import com.clientcrew.entity.Role;
import com.clientcrew.entity.Task;
import com.clientcrew.entity.TaskStatus;
import com.clientcrew.entity.User;
import com.clientcrew.repository.ProjectRepository;
import com.clientcrew.repository.TaskRepository;
import com.clientcrew.repository.UserRepository;

@Service
public class ReportService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public ReportService(
            UserRepository userRepository,
            ProjectRepository projectRepository,
            TaskRepository taskRepository
    ) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
    }

    public ReportDashboardResponse getDashboardReport(String email) {

        User loggedInUser = userRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role role = loggedInUser.getUserRole();

        List<Project> projects = getProjectsByRole(role, email);
        List<Task> tasks = getTasksByRole(role, email);

        ReportDashboardResponse response = new ReportDashboardResponse();

        response.setRole(formatRole(role));
        response.setSummary(buildSummary(role, projects, tasks));
        response.setTaskStatusChart(buildTaskStatusChart(tasks));
        response.setProjectStatusChart(buildProjectStatusChart(projects));
        response.setProductivityChart(buildProductivityChart(projects));
        response.setRecentActivities(buildRecentActivitiesByRole(role, email));
        return response;
    }

    private List<Project> getProjectsByRole(Role role, String email) {
        if (role == Role.ADMIN) {
            return projectRepository.findAll();
        }

        if (role == Role.MANAGER) {
            return projectRepository.findByManagerEmail(email);
        }

        if (role == Role.EMPLOYEE) {
            return projectRepository.findByAssignedEmployees_UserEmail(email);
        }

        if (role == Role.CUSTOMER) {
            return projectRepository.findByCustomerEmail(email);
        }

        return new ArrayList<>();
    }

    private List<Task> getTasksByRole(Role role, String email) {
        if (role == Role.ADMIN) {
            return taskRepository.findAll();
        }

        if (role == Role.MANAGER) {
            return taskRepository.findByProject_ManagerEmail(email);
        }

        if (role == Role.EMPLOYEE) {
            return taskRepository.findByAssignee_UserEmail(email);
        }

        if (role == Role.CUSTOMER) {
            return taskRepository.findByProject_CustomerEmail(email);
        }

        return new ArrayList<>();
    }

    private ReportSummaryResponse buildSummary(
            Role role,
            List<Project> projects,
            List<Task> tasks
    ) {
        ReportSummaryResponse summary = new ReportSummaryResponse();

        if (role == Role.ADMIN) {
            summary.setTotalUsers(userRepository.count());
            summary.setTotalEmployees(userRepository.findByUserRole(Role.EMPLOYEE).size());
            summary.setTotalCustomers(userRepository.findByUserRole(Role.CUSTOMER).size());
        }

        summary.setTotalProjects(projects.size());
        summary.setTotalTasks(tasks.size());

        summary.setCompletedTasks(countByStatus(tasks, TaskStatus.DONE));
        summary.setInProgressTasks(countByStatus(tasks, TaskStatus.IN_PROGRESS));
        summary.setBlockedTasks(countByStatus(tasks, TaskStatus.BLOCKED));
        summary.setPendingTasks(countByStatus(tasks, TaskStatus.TO_DO));
        summary.setReviewTasks(countByStatus(tasks, TaskStatus.REVIEW));

        return summary;
    }

    private long countByStatus(List<Task> tasks, TaskStatus status) {
        return tasks.stream()
                .filter(task -> task.getStatus() == status)
                .count();
    }

    private List<ReportChartResponse> buildTaskStatusChart(List<Task> tasks) {
        return List.of(
                new ReportChartResponse("Completed", countByStatus(tasks, TaskStatus.DONE)),
                new ReportChartResponse("In Progress", countByStatus(tasks, TaskStatus.IN_PROGRESS)),
                new ReportChartResponse("Review", countByStatus(tasks, TaskStatus.REVIEW)),
                new ReportChartResponse("Blocked", countByStatus(tasks, TaskStatus.BLOCKED)),
                new ReportChartResponse("Pending", countByStatus(tasks, TaskStatus.TO_DO))
        );
    }

    private List<ReportChartResponse> buildProjectStatusChart(List<Project> projects) {
        long completed = projects.stream()
                .filter(project -> "Completed".equalsIgnoreCase(project.getStatus()))
                .count();

        long inProgress = projects.stream()
                .filter(project -> "In Progress".equalsIgnoreCase(project.getStatus()))
                .count();

        long onHold = projects.stream()
                .filter(project -> "On Hold".equalsIgnoreCase(project.getStatus()))
                .count();

        long planning = projects.stream()
                .filter(project -> "Planning".equalsIgnoreCase(project.getStatus()))
                .count();

        return List.of(
                new ReportChartResponse("Completed", completed),
                new ReportChartResponse("In Progress", inProgress),
                new ReportChartResponse("On Hold", onHold),
                new ReportChartResponse("Planning", planning)
        );
    }

    private List<ReportChartResponse> buildProductivityChart(List<Project> projects) {
        return projects.stream()
                .limit(6)
                .map(project -> new ReportChartResponse(
                        project.getProjectName(),
                        project.getProgress()
                ))
                .toList();
    }

    private List<ReportActivityResponse> buildRecentActivities(List<Task> tasks) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy");

        return tasks.stream()
                .sorted((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()))
                .limit(5)
                .map(task -> new ReportActivityResponse(
                        task.getTitle(),
                        "Task updated • Status: " + getStatusLabel(task.getStatus())
                                + " • Project: " + task.getProject().getProjectName(),
                        task.getUpdatedAt().format(formatter)
                ))
                .toList();
    }

    private String getStatusLabel(TaskStatus status) {
        if (status == TaskStatus.DONE) return "Completed";
        if (status == TaskStatus.IN_PROGRESS) return "In Progress";
        if (status == TaskStatus.REVIEW) return "In Review";
        if (status == TaskStatus.BLOCKED) return "Blocked";
        return "Pending";
    }

    private String formatRole(Role role) {
        if (role == Role.ADMIN) return "Admin";
        if (role == Role.MANAGER) return "Manager";
        if (role == Role.EMPLOYEE) return "Employee";
        if (role == Role.CUSTOMER) return "Customer";
        return role.name();
    }
    
    
    private List<ReportActivityResponse> buildRecentActivitiesByRole(Role role, String email) {

        List<Task> recentTasks;

        if (role == Role.ADMIN) {
            recentTasks = taskRepository.findTop5ByOrderByUpdatedAtDesc();
        } else if (role == Role.MANAGER) {
            recentTasks = taskRepository.findTop5ByProject_ManagerEmailOrderByUpdatedAtDesc(email);
        } else if (role == Role.EMPLOYEE) {
            recentTasks = taskRepository.findTop5ByAssignee_UserEmailOrderByUpdatedAtDesc(email);
        } else if (role == Role.CUSTOMER) {
            recentTasks = taskRepository.findTop5ByProject_CustomerEmailOrderByUpdatedAtDesc(email);
        } else {
            recentTasks = new ArrayList<>();
        }

        return buildRecentActivities(recentTasks);
    }
}