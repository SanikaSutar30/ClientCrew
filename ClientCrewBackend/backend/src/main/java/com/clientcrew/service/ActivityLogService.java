package com.clientcrew.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clientcrew.entity.ActivityLog;
import com.clientcrew.entity.ActivityType;
import com.clientcrew.entity.Role;
import com.clientcrew.entity.User;
import com.clientcrew.repository.ActivityLogRepository;

@Service
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public ActivityLogService(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    public void createActivity(
            ActivityType activityType,
            String moduleName,
            Long entityId,
            String entityName,
            String title,
            String description,
            String oldValue,
            String newValue,
            User performedBy,
            String managerEmail,
            String customerEmail,
            String targetUserEmail
    ) {
        ActivityLog log = new ActivityLog();

        log.setActivityType(activityType);
        log.setModuleName(moduleName);
        log.setEntityId(entityId);
        log.setEntityName(entityName);
        log.setTitle(title);
        log.setDescription(description);
        log.setOldValue(oldValue);
        log.setNewValue(newValue);

        log.setPerformedByName(performedBy.getUserFullName());
        log.setPerformedByEmail(performedBy.getUserEmail());
        log.setPerformedByRole(performedBy.getUserRole());

        log.setManagerEmail(managerEmail);
        log.setCustomerEmail(customerEmail);
        log.setTargetUserEmail(targetUserEmail);

        activityLogRepository.save(log);
    }

    public List<ActivityLog> getRecentActivitiesByRole(User user) {
        Role role = user.getUserRole();

        if (role == Role.ADMIN) {
            return activityLogRepository.findTop10ByOrderByCreatedAtDesc();
        }

        if (role == Role.MANAGER) {
            return activityLogRepository
                    .findTop10ByManagerEmailOrderByCreatedAtDesc(user.getUserEmail());
        }

        if (role == Role.EMPLOYEE) {
            return activityLogRepository
                    .findTop10ByTargetUserEmailOrderByCreatedAtDesc(user.getUserEmail());
        }

        if (role == Role.CUSTOMER) {
            return activityLogRepository
                    .findTop10ByCustomerEmailOrderByCreatedAtDesc(user.getUserEmail());
        }

        return List.of();
    }
}