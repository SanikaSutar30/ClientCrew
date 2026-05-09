package com.clientcrew.service.impl;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.clientcrew.dto.dashboard.DashboardActivityResponse;
import com.clientcrew.dto.dashboard.DashboardChartResponse;
import com.clientcrew.dto.dashboard.DashboardNotificationResponse;
import com.clientcrew.dto.dashboard.DashboardProjectResponse;
import com.clientcrew.dto.dashboard.DashboardUserResponse;
import com.clientcrew.dto.dashboard.DashboardResponse;
import com.clientcrew.dto.dashboard.DashboardStatsResponse;
import com.clientcrew.dto.dashboard.DashboardTaskResponse;
import com.clientcrew.dto.dashboard.DashboardCustomerResponse;
import com.clientcrew.entity.ActivityLog;
import com.clientcrew.entity.Project;
import com.clientcrew.entity.Role;
import com.clientcrew.entity.Task;
import com.clientcrew.entity.TaskStatus;
import com.clientcrew.entity.User;
import com.clientcrew.repository.ActivityLogRepository;
import com.clientcrew.repository.ProjectRepository;
import com.clientcrew.repository.TaskRepository;
import com.clientcrew.repository.UserRepository;
import com.clientcrew.service.DashboardService;
import java.time.LocalDateTime;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final ActivityLogRepository activityLogRepository;

    public DashboardServiceImpl(
            UserRepository userRepository,
            ProjectRepository projectRepository,
            TaskRepository taskRepository,
            ActivityLogRepository activityLogRepository
    ) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.activityLogRepository = activityLogRepository;
    }

    @Override
    public DashboardResponse getDashboardData(String filter) {

        String loggedInEmail = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User loggedInUser = userRepository
                .findByUserEmail(loggedInEmail)
                .orElseThrow(() ->
                        new RuntimeException("Logged-in user not found")
                );

        Role role = loggedInUser.getUserRole();

        switch (role) {

        case ADMIN:
            return buildAdminDashboard(filter);

            case MANAGER:
                return buildManagerDashboard(loggedInUser);

            case EMPLOYEE:
                return buildEmployeeDashboard(loggedInUser);

            case CUSTOMER:
                return buildCustomerDashboard(loggedInUser);

            default:
                throw new RuntimeException("Invalid role");
        }
    }

    // ========================= ADMIN =========================

    private DashboardResponse buildAdminDashboard(String filter) {
    	LocalDateTime startDateTime = getStartDateTime(filter);
    	LocalDateTime endDateTime = LocalDateTime.now();

        DashboardResponse response = new DashboardResponse();

        response.setRole("ADMIN");

        DashboardStatsResponse stats = new DashboardStatsResponse();

        stats.setTotalProjects(projectRepository.count());

        stats.setTotalTasks(taskRepository.count());

        stats.setTotalCustomers(userRepository.countByUserRole(Role.CUSTOMER));

        stats.setTotalEmployees(userRepository.countByUserRole(Role.EMPLOYEE));

        stats.setTotalManagers(userRepository.countByUserRole(Role.MANAGER));

        stats.setCompletedTasks(
                taskRepository.countByStatus(TaskStatus.DONE)
        );

        response.setStats(stats);

        response.setRecentTasks(
                mapTasks(
                        taskRepository.findTop5ByOrderByCreatedAtDesc()
                )
        );

        response.setRecentActivities(
                mapActivities(
                        activityLogRepository.findTop10ByOrderByCreatedAtDesc()
                )
        );

        response.setRecentNotifications(
                mapNotifications(
                        activityLogRepository.findTop10ByOrderByCreatedAtDesc()
                )
        );
        response.setTeamMembers(
                mapUsers(
                        userRepository.findByUserRole(Role.EMPLOYEE)
                )
        );
        response.setTaskStatusChart(buildAdminTaskChart());

        response.setProjectStatusChart(buildAdminProjectChart());
        
        response.setRecentCustomers(
                mapCustomers(
                        userRepository.findTop5ByUserRoleOrderByCreatedAtDesc(Role.CUSTOMER)
                )
        );

        response.setTopCustomers(
                mapCustomers(
                        userRepository.findByUserRole(Role.CUSTOMER)
                )
        );

        return response;
    }

    // ========================= MANAGER =========================

    private DashboardResponse buildManagerDashboard(User manager) {

        DashboardResponse response = new DashboardResponse();

        response.setRole("MANAGER");

        DashboardStatsResponse stats = new DashboardStatsResponse();

        stats.setTotalProjects(
                projectRepository.countByManagerEmail(
                        manager.getUserEmail()
                )
        );

        stats.setTotalTasks(
                taskRepository.countByProject_ManagerEmail(
                        manager.getUserEmail()
                )
        );

        stats.setCompletedTasks(
                taskRepository.countByProject_ManagerEmailAndStatus(
                        manager.getUserEmail(),
                        TaskStatus.DONE
                )
        );

        response.setStats(stats);

        response.setRecentTasks(
                mapTasks(
                        taskRepository
                                .findTop5ByProject_ManagerEmailOrderByUpdatedAtDesc(
                                        manager.getUserEmail()
                                )
                )
        );

        response.setRecentActivities(
                mapActivities(
                        activityLogRepository
                                .findTop10ByManagerEmailOrPerformedByEmailOrderByCreatedAtDesc(
                                        manager.getUserEmail(),
                                        manager.getUserEmail()
                                )
                )
        );
        response.setRecentNotifications(
                mapNotifications(
                        activityLogRepository
                                .findTop10ByManagerEmailOrPerformedByEmailOrderByCreatedAtDesc(
                                        manager.getUserEmail(),
                                        manager.getUserEmail()
                                )
                )
        );
        
        List<Project> managerProjects =
                projectRepository.findByManagerEmail(manager.getUserEmail());

        response.setTeamMembers(
                mapTeamMembersFromProjects(managerProjects)
        );
        
        return response;
    }

    // ========================= EMPLOYEE =========================

    private DashboardResponse buildEmployeeDashboard(User employee) {

        DashboardResponse response = new DashboardResponse();

        response.setRole("EMPLOYEE");

        DashboardStatsResponse stats = new DashboardStatsResponse();

        stats.setTotalTasks(
                taskRepository.countByAssignee_UserEmail(
                        employee.getUserEmail()
                )
        );

        stats.setCompletedTasks(
                taskRepository.countByAssignee_UserEmailAndStatus(
                        employee.getUserEmail(),
                        TaskStatus.DONE
                )
        );

        response.setStats(stats);

        response.setRecentTasks(
                mapTasks(
                        taskRepository
                                .findTop5ByAssignee_UserEmailOrderByCreatedAtDesc(
                                        employee.getUserEmail()
                                )
                )
        );

        response.setRecentActivities(
                mapActivities(
                        activityLogRepository
                                .findTop10ByTargetUserEmailOrderByCreatedAtDesc(
                                        employee.getUserEmail()
                                )
                )
        );
        
        
        response.setRecentNotifications(
                mapNotifications(
                        activityLogRepository
                                .findTop10ByTargetUserEmailOrderByCreatedAtDesc(
                                        employee.getUserEmail()
                                )
                )
        );
        
        response.setRecentProjects(
                mapProjects(
                        projectRepository.findByAssignedEmployees_UserEmail(
                                employee.getUserEmail()
                        )
                )
        );

        stats.setActiveProjects(
                projectRepository.findByAssignedEmployees_UserEmail(
                        employee.getUserEmail()
                ).size()
        );
        return response;
    }

    // ========================= CUSTOMER =========================

    private DashboardResponse buildCustomerDashboard(User customer) {

        DashboardResponse response = new DashboardResponse();

        response.setRole("CUSTOMER");

        DashboardStatsResponse stats = new DashboardStatsResponse();

        stats.setTotalProjects(
                projectRepository.countByCustomerEmail(
                        customer.getUserEmail()
                )
        );

        stats.setTotalTasks(
                taskRepository.countByProject_CustomerEmail(
                        customer.getUserEmail()
                )
        );

        response.setStats(stats);

        response.setRecentActivities(
                mapActivities(
                        activityLogRepository
                                .findTop10ByCustomerEmailOrderByCreatedAtDesc(
                                        customer.getUserEmail()
                                )
                )
        );
        
        response.setRecentNotifications(
                mapNotifications(
                        activityLogRepository
                                .findTop10ByCustomerEmailOrderByCreatedAtDesc(
                                        customer.getUserEmail()
                                )
                )
        );

        return response;
    }

    // ========================= CHARTS =========================

    private List<DashboardChartResponse> buildAdminTaskChart() {

        List<DashboardChartResponse> chart = new ArrayList<>();

        chart.add(new DashboardChartResponse(
                "TO_DO",
                taskRepository.countByStatus(TaskStatus.TO_DO)
        ));

        chart.add(new DashboardChartResponse(
                "IN_PROGRESS",
                taskRepository.countByStatus(TaskStatus.IN_PROGRESS)
        ));

        chart.add(new DashboardChartResponse(
                "REVIEW",
                taskRepository.countByStatus(TaskStatus.REVIEW)
        ));

        chart.add(new DashboardChartResponse(
                "BLOCKED",
                taskRepository.countByStatus(TaskStatus.BLOCKED)
        ));

        chart.add(new DashboardChartResponse(
                "DONE",
                taskRepository.countByStatus(TaskStatus.DONE)
        ));

        return chart;
    }

    private List<DashboardChartResponse> buildAdminProjectChart() {

        List<DashboardChartResponse> chart = new ArrayList<>();

        chart.add(new DashboardChartResponse(
                "Planning",
                projectRepository.countByStatus("Planning")
        ));

        chart.add(new DashboardChartResponse(
                "In Progress",
                projectRepository.countByStatus("In Progress")
        ));

        chart.add(new DashboardChartResponse(
                "Completed",
                projectRepository.countByStatus("Completed")
        ));

        chart.add(new DashboardChartResponse(
                "On Hold",
                projectRepository.countByStatus("On Hold")
        ));

        return chart;
    }

    // ========================= MAPPERS =========================

    private List<DashboardTaskResponse> mapTasks(List<Task> tasks) {

        List<DashboardTaskResponse> responses = new ArrayList<>();

        for (Task task : tasks) {

            DashboardTaskResponse dto =
                    new DashboardTaskResponse();

            dto.setId(task.getId());

            dto.setTitle(task.getTitle());

            dto.setProjectName(
                    task.getProject().getProjectName()
            );

            dto.setStatus(
                    task.getStatus().name()
            );

            dto.setPriority(
                    task.getPriority().name()
            );

            dto.setDueDate(task.getDueDate());

            dto.setAssigneeName(
                    task.getAssignee().getUserFullName()
            );

            responses.add(dto);
        }

        return responses;
    }

    private List<DashboardActivityResponse> mapActivities(
            List<ActivityLog> logs
    ) {

        List<DashboardActivityResponse> responses =
                new ArrayList<>();

        for (ActivityLog log : logs) {

            DashboardActivityResponse dto =
                    new DashboardActivityResponse();

            dto.setId(log.getId());

            dto.setTitle(log.getTitle());

            dto.setDescription(log.getDescription());

            dto.setModuleName(log.getModuleName());

            dto.setActivityType(
                    log.getActivityType().name()
            );

            dto.setPerformedByName(
                    log.getPerformedByName()
            );

            dto.setPerformedByRole(
                    log.getPerformedByRole().name()
            );

            dto.setCreatedAt(log.getCreatedAt());

            responses.add(dto);
        }

        return responses;
    }
    
    
    private List<DashboardCustomerResponse> mapCustomers(List<User> customers) {

        List<DashboardCustomerResponse> responses = new ArrayList<>();

        for (User customer : customers) {

            DashboardCustomerResponse dto = new DashboardCustomerResponse();

            dto.setUserId(customer.getUserId());
            dto.setFullName(customer.getUserFullName());
            dto.setEmail(customer.getUserEmail());
            dto.setStatus(customer.getStatus());
            dto.setUserImage(customer.getUserImage());

            responses.add(dto);
        }

        return responses;
    }
    
    private List<DashboardUserResponse> mapTeamMembersFromProjects(
            List<Project> projects
    ) {
        List<DashboardUserResponse> responses = new ArrayList<>();

        for (Project project : projects) {
            for (User employee : project.getAssignedEmployees()) {

                boolean alreadyAdded = responses.stream()
                        .anyMatch(user ->
                                user.getUserId().equals(employee.getUserId())
                        );

                if (!alreadyAdded) {
                    DashboardUserResponse dto = new DashboardUserResponse();

                    dto.setUserId(employee.getUserId());
                    dto.setFullName(employee.getUserFullName());
                    dto.setEmail(employee.getUserEmail());
                    dto.setRole(employee.getUserRole().name());
                    dto.setStatus(employee.getStatus());
                    dto.setUserImage(employee.getUserImage());

                    responses.add(dto);
                }
            }
        }

        return responses;
    }
    
    private List<DashboardProjectResponse> mapProjects(List<Project> projects) {

        List<DashboardProjectResponse> responses = new ArrayList<>();

        for (Project project : projects) {

            DashboardProjectResponse dto = new DashboardProjectResponse();

            dto.setId(project.getId());
            dto.setProjectName(project.getProjectName());
            dto.setClientName(project.getClientName());
            dto.setStatus(project.getStatus());
            dto.setProgress(project.getProgress());
            dto.setDueDate(project.getDueDate());
            dto.setManagerEmail(project.getManagerEmail());

            responses.add(dto);
        }

        return responses;
    }
    
    
    private List<DashboardNotificationResponse> mapNotifications(
            List<ActivityLog> logs
    ) {

        List<DashboardNotificationResponse> responses =
                new ArrayList<>();

        for (ActivityLog log : logs) {

            DashboardNotificationResponse dto =
                    new DashboardNotificationResponse();

            dto.setId(log.getId());

            dto.setTitle(log.getTitle());

            dto.setDescription(log.getDescription());

            dto.setModuleName(log.getModuleName());

            dto.setIsRead(log.getIsRead());

            dto.setCreatedAt(log.getCreatedAt());

            responses.add(dto);
        }

        return responses;
    }
    
    private List<DashboardUserResponse> mapUsers(List<User> users) {

        List<DashboardUserResponse> responses = new ArrayList<>();

        for (User user : users) {

            DashboardUserResponse dto = new DashboardUserResponse();

            dto.setUserId(user.getUserId());
            dto.setFullName(user.getUserFullName());
            dto.setEmail(user.getUserEmail());
            dto.setRole(user.getUserRole().name());
            dto.setStatus(user.getStatus());
            dto.setUserImage(user.getUserImage());

            responses.add(dto);
        }

        return responses;
    }
    private LocalDateTime getStartDateTime(String filter) {

        LocalDateTime now = LocalDateTime.now();

        switch (filter) {
            case "TODAY":
                return now.toLocalDate().atStartOfDay();

            case "THIS_WEEK":
                return now.minusDays(7);

            case "THIS_MONTH":
                return now.withDayOfMonth(1).toLocalDate().atStartOfDay();

            case "THIS_YEAR":
                return now.withDayOfYear(1).toLocalDate().atStartOfDay();

            default:
                return now.withDayOfMonth(1).toLocalDate().atStartOfDay();
        }
    }
}