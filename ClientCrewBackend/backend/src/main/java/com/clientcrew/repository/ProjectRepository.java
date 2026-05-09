package com.clientcrew.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clientcrew.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByManagerEmail(String managerEmail);

    List<Project> findByCustomerEmail(String customerEmail);

    List<Project> findByAssignedEmployees_UserEmail(String userEmail);

    long countByManagerEmail(String managerEmail);

    long countByCustomerEmail(String customerEmail);

    long countByStatus(String status);

    long countByManagerEmailAndStatus(
            String managerEmail,
            String status
    );

    long countByCustomerEmailAndStatus(
            String customerEmail,
            String status
    );
}