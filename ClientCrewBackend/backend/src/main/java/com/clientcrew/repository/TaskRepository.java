package com.clientcrew.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clientcrew.entity.Task;
import com.clientcrew.entity.TaskStatus;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProject_IdIn(List<Long> projectIds);

    List<Task> findByAssignee_UserEmail(String userEmail);

    List<Task> findByProject_CustomerEmail(String customerEmail);

    List<Task> findByProject_ManagerEmail(String managerEmail);

    // Recent activity for Admin
    List<Task> findTop5ByOrderByUpdatedAtDesc();

    // Recent activity for Manager
    List<Task> findTop5ByProject_ManagerEmailOrderByUpdatedAtDesc(
            String managerEmail
    );

    // Recent activity for Employee
    List<Task> findTop5ByAssignee_UserEmailOrderByUpdatedAtDesc(
            String userEmail
    );

    // Recent activity for Customer
    List<Task> findTop5ByProject_CustomerEmailOrderByUpdatedAtDesc(
            String customerEmail
    );

    long countByStatus(TaskStatus status);

    long countByAssignee_UserEmail(String userEmail);

    long countByAssignee_UserEmailAndStatus(
            String userEmail,
            TaskStatus status
    );

    long countByProject_ManagerEmail(String managerEmail);

    long countByProject_ManagerEmailAndStatus(
            String managerEmail,
            TaskStatus status
    );

    long countByProject_CustomerEmail(String customerEmail);

    List<Task> findByDueDateBetween(
            LocalDate startDate,
            LocalDate endDate
    );

    List<Task> findTop5ByAssignee_UserEmailOrderByCreatedAtDesc(
            String userEmail
    );

    List<Task> findTop5ByOrderByCreatedAtDesc();
}