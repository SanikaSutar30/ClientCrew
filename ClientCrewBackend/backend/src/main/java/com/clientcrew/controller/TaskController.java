package com.clientcrew.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.clientcrew.dto.TaskRequest;
import com.clientcrew.dto.TaskResponse;
import com.clientcrew.dto.TaskStatusRequest;
import com.clientcrew.service.TaskService;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getTasks(Authentication authentication) {
        return ResponseEntity.ok(taskService.getTasks(authentication));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return ResponseEntity.ok(taskService.getTaskById(id, authentication));
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @RequestBody TaskRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(taskService.createTask(request, authentication));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @RequestBody TaskRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(taskService.updateTask(id, request, authentication));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(
            @PathVariable Long id,
            @RequestBody TaskStatusRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(taskService.updateTaskStatus(id, request, authentication));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(
            @PathVariable Long id,
            Authentication authentication
    ) {
        taskService.deleteTask(id, authentication);
        return ResponseEntity.ok("Task deleted successfully");
    }
}