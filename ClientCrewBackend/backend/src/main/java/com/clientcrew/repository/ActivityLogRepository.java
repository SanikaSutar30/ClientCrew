package com.clientcrew.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clientcrew.entity.ActivityLog;

public interface ActivityLogRepository
        extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findTop10ByOrderByCreatedAtDesc();

    List<ActivityLog> findTop10ByManagerEmailOrderByCreatedAtDesc(
            String managerEmail
    );

    List<ActivityLog> findTop10ByTargetUserEmailOrderByCreatedAtDesc(
            String targetUserEmail
    );

    List<ActivityLog> findTop10ByCustomerEmailOrderByCreatedAtDesc(
            String customerEmail
    );
}