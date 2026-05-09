package com.clientcrew.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.clientcrew.entity.Role;
import com.clientcrew.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUserEmail(String userEmail);

    boolean existsByUserEmail(String userEmail);

    List<User> findByUserRole(Role userRole);

    long countByUserRole(Role userRole);

    long countByUserRoleAndStatus(Role userRole, String status);

    List<User> findTop5ByUserRoleOrderByCreatedAtDesc(Role userRole);
}