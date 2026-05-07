package com.clientcrew.dto;

public class EmployeeResponse {

    private Long userId;
    private String userFullName;
    private String displayName;
    private String userEmail;
    private String userPhone;
    private String userRole;
    private String userImage;
    private String status;
    private String joinedDate;
    private boolean currentUser;

    public EmployeeResponse(Long userId, String userFullName, String displayName,
                            String userEmail, String userPhone, String userRole,
                            String userImage, String status, String joinedDate,
                            boolean currentUser) {
        this.userId = userId;
        this.userFullName = userFullName;
        this.displayName = displayName;
        this.userEmail = userEmail;
        this.userPhone = userPhone;
        this.userRole = userRole;
        this.userImage = userImage;
        this.status = status;
        this.joinedDate = joinedDate;
        this.currentUser = currentUser;
    }

    public Long getUserId() { return userId; }
    public String getUserFullName() { return userFullName; }
    public String getDisplayName() { return displayName; }
    public String getUserEmail() { return userEmail; }
    public String getUserPhone() { return userPhone; }
    public String getUserRole() { return userRole; }
    public String getUserImage() { return userImage; }
    public String getStatus() { return status; }
    public String getJoinedDate() { return joinedDate; }
    public boolean isCurrentUser() { return currentUser; }
}