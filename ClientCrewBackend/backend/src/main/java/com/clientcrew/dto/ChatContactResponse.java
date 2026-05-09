package com.clientcrew.dto;

import java.time.LocalDateTime;

public class ChatContactResponse {

    private Long userId;
    private String fullName;
    private String email;
    private String role;
    private String userImage;
    private long unreadCount;

    private String lastMessage;
    private LocalDateTime lastMessageTime;

    public ChatContactResponse() {}

    public ChatContactResponse(
            Long userId,
            String fullName,
            String email,
            String role,
            String userImage,
            long unreadCount,
            String lastMessage,
            LocalDateTime lastMessageTime
    ) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.userImage = userImage;
        this.unreadCount = unreadCount;
        this.lastMessage = lastMessage;
        this.lastMessageTime = lastMessageTime;
    }

    public Long getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getUserImage() {
        return userImage;
    }

    public long getUnreadCount() {
        return unreadCount;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public LocalDateTime getLastMessageTime() {
        return lastMessageTime;
    }
}