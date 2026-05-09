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
        String email = user.getUserEmail();

        if (role == Role.ADMIN) {
            return activityLogRepository.findAllByOrderByCreatedAtDesc()
                    .stream()
                    .filter(activity ->
                            activity.getActivityType() != ActivityType.MESSAGE_SENT
                            || email.equalsIgnoreCase(activity.getPerformedByEmail())
                            || email.equalsIgnoreCase(activity.getTargetUserEmail())
                    )
                    .toList();
        }

        if (role == Role.MANAGER) {
            return activityLogRepository.findAllByOrderByCreatedAtDesc()
                    .stream()
                    .filter(activity ->
                            (
                                    activity.getActivityType() == ActivityType.MESSAGE_SENT
                                    && (
                                            email.equalsIgnoreCase(activity.getPerformedByEmail())
                                            || email.equalsIgnoreCase(activity.getTargetUserEmail())
                                    )
                            )
                            || email.equalsIgnoreCase(activity.getManagerEmail())
                            || email.equalsIgnoreCase(activity.getPerformedByEmail())
                    )
                    .toList();
        }

        if (role == Role.EMPLOYEE) {
            return activityLogRepository.findAllByOrderByCreatedAtDesc()
                    .stream()
                    .filter(activity ->
                            (
                                    activity.getActivityType() == ActivityType.MESSAGE_SENT
                                    && (
                                            email.equalsIgnoreCase(activity.getPerformedByEmail())
                                            || email.equalsIgnoreCase(activity.getTargetUserEmail())
                                    )
                            )
                            || email.equalsIgnoreCase(activity.getTargetUserEmail())
                    )
                    .toList();
        }

        if (role == Role.CUSTOMER) {
            return activityLogRepository.findAllByOrderByCreatedAtDesc()
                    .stream()
                    .filter(activity ->
                            (
                                    activity.getActivityType() == ActivityType.MESSAGE_SENT
                                    && (
                                            email.equalsIgnoreCase(activity.getPerformedByEmail())
                                            || email.equalsIgnoreCase(activity.getTargetUserEmail())
                                    )
                            )
                            || email.equalsIgnoreCase(String.valueOf(activity.getTargetUserEmail()))
                    )
                    .toList();
        }

        return List.of();
    }
}