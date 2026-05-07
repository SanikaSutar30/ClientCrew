package com.clientcrew.service;

import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.clientcrew.dto.TaskRequest;
import com.clientcrew.dto.TaskResponse;
import com.clientcrew.dto.TaskStatusRequest;
import com.clientcrew.entity.Project;
import com.clientcrew.entity.Role;
import com.clientcrew.entity.Task;
import com.clientcrew.entity.TaskStatus;
import com.clientcrew.entity.User;
import com.clientcrew.repository.ProjectRepository;
import com.clientcrew.repository.TaskRepository;
import com.clientcrew.repository.UserRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository,
                       ProjectRepository projectRepository,
                       UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public List<TaskResponse> getTasks(Authentication authentication) {
        User loggedInUser = getLoggedInUser(authentication);

        List<Task> tasks;

        if (loggedInUser.getUserRole() == Role.ADMIN) {
            tasks = taskRepository.findAll();
        } else if (loggedInUser.getUserRole() == Role.MANAGER) {
            tasks = taskRepository.findByProject_ManagerEmail(loggedInUser.getUserEmail());
        } else if (loggedInUser.getUserRole() == Role.EMPLOYEE) {
            List<Project> projects =
                    projectRepository.findByAssignedEmployees_UserEmail(loggedInUser.getUserEmail());

            List<Long> projectIds = projects.stream()
                    .map(Project::getId)
                    .toList();

            tasks = projectIds.isEmpty()
                    ? List.of()
                    : taskRepository.findByProject_IdIn(projectIds);
        } else if (loggedInUser.getUserRole() == Role.CUSTOMER) {
            tasks = taskRepository.findByProject_CustomerEmail(loggedInUser.getUserEmail());
        } else {
            tasks = List.of();
        }

        return tasks.stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TaskResponse getTaskById(Long id, Authentication authentication) {
        Task task = findTask(id);
        User loggedInUser = getLoggedInUser(authentication);

        if (!canViewTask(task, loggedInUser)) {
            throw new AccessDeniedException("You are not allowed to view this task");
        }

        return mapToResponse(task);
    }

    public TaskResponse createTask(TaskRequest request, Authentication authentication) {
        User loggedInUser = getLoggedInUser(authentication);

        if (!(loggedInUser.getUserRole() == Role.ADMIN || loggedInUser.getUserRole() == Role.MANAGER)) {
            throw new AccessDeniedException("Only Admin or Manager can create tasks");
        }

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User assignee = userRepository.findById(request.getAssigneeId())
                .orElseThrow(() -> new RuntimeException("Assignee not found"));

        if (loggedInUser.getUserRole() == Role.MANAGER) {
            if (!project.getManagerEmail().equalsIgnoreCase(loggedInUser.getUserEmail())) {
                throw new AccessDeniedException("Manager can create tasks only for own projects");
            }

            boolean assigneeInProject = project.getAssignedEmployees()
                    .stream()
                    .anyMatch(emp -> emp.getUserId().equals(assignee.getUserId()));

            if (!assigneeInProject) {
                throw new AccessDeniedException("Manager can assign tasks only to project team members");
            }
        }

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setProject(project);
        task.setAssignee(assignee);
        task.setCreatedBy(loggedInUser);
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus());
        task.setDueDate(request.getDueDate());

        return mapToResponse(taskRepository.save(task));
    }

    public TaskResponse updateTask(Long id, TaskRequest request, Authentication authentication) {
        Task task = findTask(id);
        User loggedInUser = getLoggedInUser(authentication);

        if (!(loggedInUser.getUserRole() == Role.ADMIN || loggedInUser.getUserRole() == Role.MANAGER)) {
            throw new AccessDeniedException("Only Admin or Manager can update tasks");
        }

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User assignee = userRepository.findById(request.getAssigneeId())
                .orElseThrow(() -> new RuntimeException("Assignee not found"));

        if (loggedInUser.getUserRole() == Role.MANAGER) {
            if (!task.getProject().getManagerEmail().equalsIgnoreCase(loggedInUser.getUserEmail())) {
                throw new AccessDeniedException("Manager can update only own project tasks");
            }

            if (!project.getManagerEmail().equalsIgnoreCase(loggedInUser.getUserEmail())) {
                throw new AccessDeniedException("Manager can move task only within own projects");
            }

            boolean assigneeInProject = project.getAssignedEmployees()
                    .stream()
                    .anyMatch(emp -> emp.getUserId().equals(assignee.getUserId()));

            if (!assigneeInProject) {
                throw new AccessDeniedException("Manager can assign only project team members");
            }
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setProject(project);
        task.setAssignee(assignee);
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus());
        task.setDueDate(request.getDueDate());

        return mapToResponse(taskRepository.save(task));
    }

    public TaskResponse updateTaskStatus(Long id, TaskStatusRequest request, Authentication authentication) {
        Task task = findTask(id);
        User loggedInUser = getLoggedInUser(authentication);

        if (loggedInUser.getUserRole() == Role.CUSTOMER) {
            throw new AccessDeniedException("Customer cannot update task status");
        }

        if (loggedInUser.getUserRole() == Role.EMPLOYEE) {
            if (!task.getAssignee().getUserEmail().equalsIgnoreCase(loggedInUser.getUserEmail())) {
                throw new AccessDeniedException("Employee can update only own assigned task status");
            }
        }

        if (loggedInUser.getUserRole() == Role.MANAGER) {
            if (!task.getProject().getManagerEmail().equalsIgnoreCase(loggedInUser.getUserEmail())) {
                throw new AccessDeniedException("Manager can update status only for own project tasks");
            }
        }

        TaskStatus newStatus = request.getStatus();

        if (newStatus == null) {
            throw new RuntimeException("Status is required");
        }

        task.setStatus(newStatus);

        return mapToResponse(taskRepository.save(task));
    }

    public void deleteTask(Long id, Authentication authentication) {
        Task task = findTask(id);
        User loggedInUser = getLoggedInUser(authentication);

        if (loggedInUser.getUserRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only Admin can delete tasks");
        }

        taskRepository.delete(task);
    }

    private boolean canViewTask(Task task, User user) {
        if (user.getUserRole() == Role.ADMIN) {
            return true;
        }

        if (user.getUserRole() == Role.MANAGER) {
            return task.getProject().getManagerEmail().equalsIgnoreCase(user.getUserEmail());
        }

        if (user.getUserRole() == Role.EMPLOYEE) {
            return task.getProject().getAssignedEmployees()
                    .stream()
                    .anyMatch(emp -> emp.getUserEmail().equalsIgnoreCase(user.getUserEmail()));
        }

        if (user.getUserRole() == Role.CUSTOMER) {
            return task.getProject().getCustomerEmail().equalsIgnoreCase(user.getUserEmail());
        }

        return false;
    }

    private Task findTask(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    private User getLoggedInUser(Authentication authentication) {
        String email = authentication.getName();

        return userRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Logged-in user not found"));
    }

    private TaskResponse mapToResponse(Task task) {
        TaskResponse response = new TaskResponse();

        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());

        response.setProjectId(task.getProject().getId());
        response.setProjectName(task.getProject().getProjectName());

        response.setAssigneeId(task.getAssignee().getUserId());
        response.setAssigneeName(task.getAssignee().getUserFullName());
        response.setAssigneeEmail(task.getAssignee().getUserEmail());
        response.setAssigneeImage(task.getAssignee().getUserImage());

        response.setCreatedById(task.getCreatedBy().getUserId());
        response.setCreatedByName(task.getCreatedBy().getUserFullName());
        response.setCreatedByEmail(task.getCreatedBy().getUserEmail());

        response.setPriority(task.getPriority());
        response.setStatus(task.getStatus());
        response.setDueDate(task.getDueDate());
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());

        return response;
    }
}