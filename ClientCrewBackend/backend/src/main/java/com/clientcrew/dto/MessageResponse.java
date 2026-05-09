package com.clientcrew.dto;

import java.time.LocalDateTime;

public class MessageResponse {

    private Long messageId;

    private Long senderId;
    private String senderName;
    private String senderEmail;
    private String senderRole;

    private Long receiverId;
    private String receiverName;
    private String receiverEmail;
    private String receiverRole;

    private Long projectId;
    private String projectName;

    private String content;
    private LocalDateTime sentAt;
    private boolean readStatus;

    public MessageResponse(
            Long messageId,
            Long senderId,
            String senderName,
            String senderEmail,
            String senderRole,
            Long receiverId,
            String receiverName,
            String receiverEmail,
            String receiverRole,
            Long projectId,
            String projectName,
            String content,
            LocalDateTime sentAt,
            boolean readStatus
    ) {
        this.messageId = messageId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.senderEmail = senderEmail;
        this.senderRole = senderRole;
        this.receiverId = receiverId;
        this.receiverName = receiverName;
        this.receiverEmail = receiverEmail;
        this.receiverRole = receiverRole;
        this.projectId = projectId;
        this.projectName = projectName;
        this.content = content;
        this.sentAt = sentAt;
        this.readStatus = readStatus;
    }

    public Long getMessageId() {
        return messageId;
    }

    public Long getSenderId() {
        return senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public String getSenderRole() {
        return senderRole;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public String getReceiverEmail() {
        return receiverEmail;
    }

    public String getReceiverRole() {
        return receiverRole;
    }

    public Long getProjectId() {
        return projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public boolean isReadStatus() {
        return readStatus;
    }
}