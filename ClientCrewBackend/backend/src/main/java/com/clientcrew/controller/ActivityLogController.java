package com.clientcrew.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.clientcrew.entity.ActivityLog;
import com.clientcrew.entity.Role;
import com.clientcrew.entity.User;
import com.clientcrew.repository.ActivityLogRepository;
import com.clientcrew.repository.UserRepository;
import com.clientcrew.service.ActivityLogService;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "http://localhost:5173")
public class ActivityLogController {

    private final ActivityLogService activityLogService;
    private final UserRepository userRepository;
    private final ActivityLogRepository activityLogRepository;

    public ActivityLogController(
            ActivityLogService activityLogService,
            UserRepository userRepository,
            ActivityLogRepository activityLogRepository
    ) {
        this.activityLogService = activityLogService;
        this.userRepository = userRepository;
        this.activityLogRepository = activityLogRepository;
    }

    // Get activities based on logged-in user role
    @GetMapping
    public List<ActivityLog> getActivities(Authentication authentication) {

        User loggedInUser = userRepository
                .findByUserEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return activityLogService.getRecentActivitiesByRole(loggedInUser);
    }

    // Mark single activity as read
    @PatchMapping("/{id}/read")
    public ActivityLog markActivityAsRead(
            @PathVariable Long id,
            Authentication authentication
    ) {

        ActivityLog activity = activityLogRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Activity not found"));

        User loggedInUser = userRepository
                .findByUserEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        boolean allowed = false;

        if (loggedInUser.getUserRole() == Role.ADMIN) {
            allowed = true;
        }

        if (activity.getPerformedByEmail() != null &&
                loggedInUser.getUserEmail().equalsIgnoreCase(activity.getPerformedByEmail())) {
            allowed = true;
        }

        if (loggedInUser.getUserRole() == Role.MANAGER &&
                loggedInUser.getUserEmail().equalsIgnoreCase(activity.getManagerEmail())) {
            allowed = true;
        }

        if (loggedInUser.getUserRole() == Role.EMPLOYEE &&
                loggedInUser.getUserEmail().equalsIgnoreCase(activity.getTargetUserEmail())) {
            allowed = true;
        }

        if (loggedInUser.getUserRole() == Role.CUSTOMER &&
                loggedInUser.getUserEmail().equalsIgnoreCase(activity.getCustomerEmail())) {
            allowed = true;
        }

        if (!allowed) {
            throw new RuntimeException("Access denied");
        }

        activity.setIsRead(true);

        return activityLogRepository.save(activity);
    }

    // Mark all activities as read
    @PatchMapping("/read-all")
    public String markAllActivitiesAsRead(Authentication authentication) {

        User loggedInUser = userRepository
                .findByUserEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<ActivityLog> activities;

        if (loggedInUser.getUserRole() == Role.ADMIN) {

            activities = activityLogRepository
                    .findTop10ByOrderByCreatedAtDesc();

        } else if (loggedInUser.getUserRole() == Role.MANAGER) {

        	activities = activityLogRepository
        	        .findTop10ByManagerEmailOrPerformedByEmailOrderByCreatedAtDesc(
        	                loggedInUser.getUserEmail(),
        	                loggedInUser.getUserEmail()
        	        );

        } else if (loggedInUser.getUserRole() == Role.EMPLOYEE) {

            activities = activityLogRepository
                    .findTop10ByTargetUserEmailOrderByCreatedAtDesc(
                            loggedInUser.getUserEmail()
                    );

        } else {

            activities = activityLogRepository
                    .findTop10ByCustomerEmailOrderByCreatedAtDesc(
                            loggedInUser.getUserEmail()
                    );
        }

        activities.forEach(activity -> activity.setIsRead(true));

        activityLogRepository.saveAll(activities);

        return "All notifications marked as read";
    }
}