package com.clientcrew.controller;

// User APIs for dropdowns, admin users page, add/edit/delete users

import java.util.List;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.clientcrew.dto.UserRequest;
import com.clientcrew.entity.Role;
import com.clientcrew.entity.User;
import com.clientcrew.repository.UserRepository;

import org.springframework.security.core.Authentication;

import com.clientcrew.entity.ActivityType;
import com.clientcrew.service.ActivityLogService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    // User repository dependency
    private final UserRepository userRepository;

    // Password encoder dependency
    private final PasswordEncoder passwordEncoder;
    private final ActivityLogService activityLogService;

    // Constructor injection
    public UserController(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            ActivityLogService activityLogService) {

this.userRepository = userRepository;
this.passwordEncoder = passwordEncoder;
this.activityLogService = activityLogService;
}

    // Get all customers for dropdowns
    @GetMapping("/customers")
    public List<User> getCustomers() {

        return userRepository.findByUserRole(Role.CUSTOMER);
    }

    // Get all employees for dropdowns
    @GetMapping("/employees")
    public List<User> getEmployees() {

        return userRepository.findByUserRole(Role.EMPLOYEE);
    }

    // Get all managers for dropdowns
    @GetMapping("/managers")
    public List<User> getManagers() {

        return userRepository.findByUserRole(Role.MANAGER);
    }

    // Get assignable users (Managers + Employees)
    @GetMapping
    public List<User> getAssignableUsers() {

        List<User> managers =
                userRepository.findByUserRole(Role.MANAGER);

        List<User> employees =
                userRepository.findByUserRole(Role.EMPLOYEE);

        managers.addAll(employees);

        return managers;
    }

    // Get all users for admin users page
    @GetMapping("/all")
    public List<User> getAllUsersForAdmin() {

        return userRepository.findAll();
    }

    // Add new user
    @PostMapping
    public ResponseEntity<?> addUser(
            @RequestBody UserRequest dto,
            Authentication authentication
    ) {

        // Prevent creating admin
        if (dto.getUserRole() == Role.ADMIN) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Creating another Admin is not allowed");
        }

        // Prevent duplicate email
        if (userRepository.findByUserEmail(
                dto.getUserEmail()
        ).isPresent()) {

            return ResponseEntity.badRequest()
                    .body("Email already exists");
        }

        User user = new User();

        user.setUserFullName(dto.getUserFullName());
        user.setUserEmail(dto.getUserEmail());
        user.setUserPhone(dto.getUserPhone());
        user.setUserRole(dto.getUserRole());
        user.setStatus(dto.getStatus());
        user.setJoinedDate(dto.getJoinedDate());
        user.setUserImage(dto.getUserImage());

        // Default password
        String rawPassword =
                dto.getPassword() != null
                && !dto.getPassword().isBlank()
                ? dto.getPassword()
                		: "123456";

        // Encrypt password
        user.setUserPassword(
                passwordEncoder.encode(rawPassword)
        );

        User savedUser = userRepository.save(user);
        User performedBy = userRepository.findByUserEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Logged-in user not found"));

        activityLogService.createActivity(
                ActivityType.USER_CREATED,
                "USER",
                savedUser.getUserId(),
                savedUser.getUserFullName(),
                savedUser.getUserRole().name() + " Created",
                performedBy.getUserFullName() + " created user " + savedUser.getUserFullName(),
                null,
                savedUser.getUserEmail(),
                performedBy,
                null,
                savedUser.getUserRole() == Role.CUSTOMER ? savedUser.getUserEmail() : null,
                savedUser.getUserEmail()
        );

        return ResponseEntity.ok(savedUser);
    }

    // Update existing user
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long userId,
            @RequestBody UserRequest dto,
            Authentication authentication
    ){

        User existingUser =
                userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Prevent editing admin
        if (existingUser.getUserRole() == Role.ADMIN) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Admin user cannot be edited");
        }
        
        String oldName = existingUser.getUserFullName();
        String oldRole = existingUser.getUserRole().name();
        String oldStatus = existingUser.getStatus();

        existingUser.setUserFullName(dto.getUserFullName());
        existingUser.setUserPhone(dto.getUserPhone());
        existingUser.setUserRole(dto.getUserRole());
        existingUser.setStatus(dto.getStatus());
        existingUser.setJoinedDate(dto.getJoinedDate());
        existingUser.setUserImage(dto.getUserImage());

        User updatedUser =
                userRepository.save(existingUser);
        
        User performedBy = userRepository.findByUserEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Logged-in user not found"));

        String description = performedBy.getUserFullName()
                + " updated user " + oldName;

        if (!oldName.equalsIgnoreCase(updatedUser.getUserFullName())) {
            description += " to " + updatedUser.getUserFullName();
        }

        if (!oldRole.equalsIgnoreCase(updatedUser.getUserRole().name())) {
            description += " | Role: " + oldRole + " → " + updatedUser.getUserRole().name();
        }

        if (oldStatus != null && updatedUser.getStatus() != null
                && !oldStatus.equalsIgnoreCase(updatedUser.getStatus())) {
            description += " | Status: " + oldStatus + " → " + updatedUser.getStatus();
        }

        activityLogService.createActivity(
                ActivityType.USER_UPDATED,
                "USER",
                updatedUser.getUserId(),
                updatedUser.getUserFullName(),
                "User Updated",
                description,
                oldName,
                updatedUser.getUserFullName(),
                performedBy,
                null,
                updatedUser.getUserRole() == Role.CUSTOMER ? updatedUser.getUserEmail() : null,
                updatedUser.getUserEmail()
        );

        return ResponseEntity.ok(updatedUser);
    }

    // Delete user
    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long userId,
            Authentication authentication
    ){

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Prevent deleting admin
        if (user.getUserRole() == Role.ADMIN) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Admin user cannot be deleted");
        }

        User performedBy = userRepository.findByUserEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Logged-in user not found"));

        activityLogService.createActivity(
                ActivityType.USER_DELETED,
                "USER",
                user.getUserId(),
                user.getUserFullName(),
                user.getUserRole().name() + " Deleted",
                performedBy.getUserFullName() + " deleted user " + user.getUserFullName(),
                user.getUserEmail(),
                null,
                performedBy,
                null,
                user.getUserRole() == Role.CUSTOMER ? user.getUserEmail() : null,
                user.getUserEmail()
        );
        
        userRepository.delete(user);


        return ResponseEntity.ok("User deleted successfully");
    }
}