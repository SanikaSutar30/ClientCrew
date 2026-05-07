package com.clientcrew.dto;

import com.clientcrew.entity.TaskStatus;

public class TaskStatusRequest {

    private TaskStatus status;

    public TaskStatusRequest() {
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }
}